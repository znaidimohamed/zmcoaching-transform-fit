import { Request, Response } from "express";
import {
  PerformanceSet,
  RunLog,
  HyroxLog,
  WodLog,
  CoachConsigne,
  PerformanceAccess,
} from "../models/performance.model";
import { User } from "../models/user.model";
import { createNotification } from "../utils/createNotification";

// Helper to resolve user target
const resolveTargetUserId = (req: Request): string | null => {
  let paramId = req.params.userId;
  if (!paramId || paramId === "me") {
    return req.user?.userId || null;
  }
  return paramId;
};

// GET /api/performance/user/:userId
export const getUserPerformance = async (req: Request, res: Response) => {
  try {
    const targetUserId = resolveTargetUserId(req);

    if (!targetUserId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Authorization: User can only see their own performance unless they are admin
    if (req.user?.role !== "admin" && req.user?.userId !== targetUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const [loggedSets, loggedRuns, loggedHyrox, loggedWods, consigneDoc, accessDoc] =
      await Promise.all([
        PerformanceSet.find({ user: targetUserId }).sort({ date: -1, createdAt: -1 }),
        RunLog.find({ user: targetUserId }).sort({ date: -1, createdAt: -1 }),
        HyroxLog.find({ user: targetUserId }).sort({ date: -1, createdAt: -1 }),
        WodLog.find({ user: targetUserId }).sort({ date: -1, createdAt: -1 }),
        CoachConsigne.findOne({ user: targetUserId, active: true }).sort({ createdAt: -1 }),
        PerformanceAccess.findOne({ user: targetUserId }),
      ]);

    const formattedSets = loggedSets.map((s) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      userId: targetUserId,
      exercise: s.exercise,
      category: s.category || "Musculation",
      weight: s.weight,
      reps: s.reps,
      rpe: s.rpe ?? 8,
      estimated1RM: s.estimated1RM || Math.round(s.weight * (1 + s.reps / 30) * 10) / 10,
      notes: s.notes || "",
      date: s.date.toISOString(),
      isPR: !!s.isPR,
    }));

    const formattedRuns = loggedRuns.map((r) => ({
      id: r._id.toString(),
      _id: r._id.toString(),
      userId: targetUserId,
      type: r.type,
      distance: r.distance,
      minutes: r.minutes,
      seconds: r.seconds,
      pace: r.pace || "",
      speed: r.speed || 0,
      hr: r.hr,
      notes: r.notes || "",
      surface: r.surface,
      elevation: r.elevation,
      cadence: r.cadence,
      intervalStructure: r.intervalStructure,
      intervalRest: r.intervalRest,
      date: r.date.toISOString(),
    }));

    const formattedHyrox = loggedHyrox.map((h) => ({
      id: h._id.toString(),
      _id: h._id.toString(),
      userId: targetUserId,
      category: h.category,
      stationTimes: h.stationTimes || {},
      runPaceSecs: h.runPaceSecs,
      roxtimeSecs: h.roxtimeSecs,
      totalTime: h.totalTime,
      notes: h.notes || "",
      date: h.date.toISOString(),
    }));

    const formattedWods = loggedWods.map((w) => ({
      id: w._id.toString(),
      _id: w._id.toString(),
      userId: targetUserId,
      type: w.type,
      name: w.name,
      score: w.score,
      details: w.details || "",
      date: w.date.toISOString(),
    }));

    res.json({
      userId: targetUserId,
      loggedSets: formattedSets,
      loggedRuns: formattedRuns,
      loggedHyrox: formattedHyrox,
      loggedWods: formattedWods,
      consigne: consigneDoc ? consigneDoc.content : "",
      trackingEnabled: accessDoc ? accessDoc.trackingEnabled : true,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch performance data",
    });
  }
};

// GET /api/performance/admin/overview
export const getAllAthletesPerformanceOverview = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" }).select("fullName email phone createdAt");

    const userIds = users.map((u) => u._id);

    const [setsCount, runsCount, hyroxCount] = await Promise.all([
      PerformanceSet.aggregate([
        { $match: { user: { $in: userIds } } },
        { $group: { _id: "$user", count: { $sum: 1 }, lastDate: { $max: "$date" } } },
      ]),
      RunLog.aggregate([
        { $match: { user: { $in: userIds } } },
        { $group: { _id: "$user", count: { $sum: 1 }, totalKm: { $sum: "$distance" } } },
      ]),
      HyroxLog.aggregate([
        { $match: { user: { $in: userIds } } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
      ]),
    ]);

    const setsMap = new Map(setsCount.map((item) => [item._id.toString(), item]));
    const runsMap = new Map(runsCount.map((item) => [item._id.toString(), item]));
    const hyroxMap = new Map(hyroxCount.map((item) => [item._id.toString(), item]));

    const result = users.map((u) => {
      const uid = u._id.toString();
      const s = setsMap.get(uid);
      const r = runsMap.get(uid);
      const h = hyroxMap.get(uid);

      return {
        user: {
          id: uid,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
        },
        setsCount: s?.count || 0,
        runsCount: r?.count || 0,
        totalKm: r?.totalKm || 0,
        hyroxCount: h?.count || 0,
        lastActivity: s?.lastDate || null,
      };
    });

    res.json({ athletes: result });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch athletes overview",
    });
  }
};

// POST /api/performance/set
export const addPerformanceSet = async (req: Request, res: Response) => {
  try {
    const rawSet = req.body.set || req.body;
    const targetUserId = req.body.userId || req.user?.userId;

    if (!targetUserId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const { exercise, category, weight, reps, rpe, notes, date } = rawSet;

    if (!exercise || weight === undefined || reps === undefined) {
      return res.status(400).json({
        message: "exercise, weight, and reps are required",
      });
    }

    const numericWeight = Number(weight);
    const numericReps = Number(reps);
    const numericRpe = rpe !== undefined ? Number(rpe) : 8;
    const estimated1RM =
      rawSet.estimated1RM ||
      Math.round(numericWeight * (1 + numericReps / 30) * 10) / 10;

    // Check if this is a PR for this user on this exercise
    const previousBest = await PerformanceSet.findOne({
      user: targetUserId,
      exercise: exercise,
    }).sort({ estimated1RM: -1 });

    const isPR = !previousBest || estimated1RM > (previousBest.estimated1RM || 0);

    const newSet = await PerformanceSet.create({
      user: targetUserId,
      exercise,
      category: category || "Musculation",
      weight: numericWeight,
      reps: numericReps,
      rpe: numericRpe,
      estimated1RM,
      notes: notes || "",
      date: date ? new Date(date) : new Date(),
      isPR,
    });

    res.status(201).json({
      message: "Set logged successfully",
      set: {
        id: newSet._id.toString(),
        _id: newSet._id.toString(),
        userId: targetUserId,
        exercise: newSet.exercise,
        category: newSet.category,
        weight: newSet.weight,
        reps: newSet.reps,
        rpe: newSet.rpe,
        estimated1RM: newSet.estimated1RM,
        notes: newSet.notes,
        date: newSet.date.toISOString(),
        isPR: newSet.isPR,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to log set",
    });
  }
};

// DELETE /api/performance/set/:id
export const deletePerformanceSet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const set = await PerformanceSet.findById(id);

    if (!set) {
      return res.status(404).json({ message: "Set not found" });
    }

    if (req.user?.role !== "admin" && set.user.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await PerformanceSet.findByIdAndDelete(id);
    res.json({ message: "Set deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete set" });
  }
};

// POST /api/performance/run
export const addRunLog = async (req: Request, res: Response) => {
  try {
    const rawRun = req.body.run || req.body;
    const targetUserId = req.body.userId || req.user?.userId;

    if (!targetUserId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const {
      type,
      distance,
      minutes,
      seconds,
      pace,
      speed,
      hr,
      notes,
      surface,
      elevation,
      cadence,
      intervalStructure,
      intervalRest,
      date,
    } = rawRun;

    const numDistance = Number(distance);
    const numMinutes = Number(minutes);
    const numSeconds = Number(seconds || 0);

    // Calculate pace & speed if missing
    let finalPace = pace;
    let finalSpeed = speed;
    const totalMinutes = numMinutes + numSeconds / 60;

    if ((!finalPace || !finalSpeed) && numDistance > 0 && totalMinutes > 0) {
      const paceDecimal = totalMinutes / numDistance;
      const paceMin = Math.floor(paceDecimal);
      const paceSec = Math.round((paceDecimal - paceMin) * 60);
      finalPace = `${String(paceMin).padStart(2, "0")}:${String(paceSec).padStart(2, "0")}/km`;
      finalSpeed = Math.round((numDistance / (totalMinutes / 60)) * 10) / 10;
    }

    const newRun = await RunLog.create({
      user: targetUserId,
      type: type || "5K Tempo",
      distance: numDistance,
      minutes: numMinutes,
      seconds: numSeconds,
      pace: finalPace,
      speed: finalSpeed,
      hr: hr ? Number(hr) : undefined,
      notes: notes || "",
      surface: surface || "Route",
      elevation: elevation ? Number(elevation) : undefined,
      cadence: cadence ? Number(cadence) : undefined,
      intervalStructure: intervalStructure || "",
      intervalRest: intervalRest || "",
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      message: "Run logged successfully",
      run: {
        id: newRun._id.toString(),
        _id: newRun._id.toString(),
        userId: targetUserId,
        type: newRun.type,
        distance: newRun.distance,
        minutes: newRun.minutes,
        seconds: newRun.seconds,
        pace: newRun.pace,
        speed: newRun.speed,
        hr: newRun.hr,
        notes: newRun.notes,
        surface: newRun.surface,
        elevation: newRun.elevation,
        cadence: newRun.cadence,
        intervalStructure: newRun.intervalStructure,
        intervalRest: newRun.intervalRest,
        date: newRun.date.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to log run" });
  }
};

// DELETE /api/performance/run/:id
export const deleteRunLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const run = await RunLog.findById(id);

    if (!run) {
      return res.status(404).json({ message: "Run log not found" });
    }

    if (req.user?.role !== "admin" && run.user.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await RunLog.findByIdAndDelete(id);
    res.json({ message: "Run log deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete run log" });
  }
};

// POST /api/performance/hyrox
export const addHyroxLog = async (req: Request, res: Response) => {
  try {
    const rawHyrox = req.body.simulation || req.body;
    const targetUserId = req.body.userId || req.user?.userId;

    if (!targetUserId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const {
      category,
      stationTimes,
      runPaceSecs,
      roxtimeSecs,
      totalTime,
      notes,
      date,
    } = rawHyrox;

    const newHyrox = await HyroxLog.create({
      user: targetUserId,
      category: category || "Open Men",
      stationTimes: stationTimes || {},
      runPaceSecs: runPaceSecs ? Number(runPaceSecs) : undefined,
      roxtimeSecs: roxtimeSecs ? Number(roxtimeSecs) : undefined,
      totalTime: totalTime || "42:00",
      notes: notes || "",
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      message: "Hyrox simulation logged successfully",
      hyrox: {
        id: newHyrox._id.toString(),
        _id: newHyrox._id.toString(),
        userId: targetUserId,
        category: newHyrox.category,
        stationTimes: newHyrox.stationTimes,
        runPaceSecs: newHyrox.runPaceSecs,
        roxtimeSecs: newHyrox.roxtimeSecs,
        totalTime: newHyrox.totalTime,
        notes: newHyrox.notes,
        date: newHyrox.date.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to log Hyrox simulation",
    });
  }
};

// DELETE /api/performance/hyrox/:id
export const deleteHyroxLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hyrox = await HyroxLog.findById(id);

    if (!hyrox) {
      return res.status(404).json({ message: "Hyrox log not found" });
    }

    if (req.user?.role !== "admin" && hyrox.user.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await HyroxLog.findByIdAndDelete(id);
    res.json({ message: "Hyrox simulation deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to delete Hyrox log",
    });
  }
};

// POST /api/performance/wod
export const addWodLog = async (req: Request, res: Response) => {
  try {
    const rawWod = req.body.wod || req.body;
    const targetUserId = req.body.userId || req.user?.userId;

    if (!targetUserId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const { type, name, score, details, date } = rawWod;

    const newWod = await WodLog.create({
      user: targetUserId,
      type: type || "AMRAP",
      name: name || "Custom WOD",
      score: score || "Completed",
      details: details || "",
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      message: "WOD logged successfully",
      wod: {
        id: newWod._id.toString(),
        _id: newWod._id.toString(),
        userId: targetUserId,
        type: newWod.type,
        name: newWod.name,
        score: newWod.score,
        details: newWod.details,
        date: newWod.date.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to log WOD" });
  }
};

// DELETE /api/performance/wod/:id
export const deleteWodLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wod = await WodLog.findById(id);

    if (!wod) {
      return res.status(404).json({ message: "WOD not found" });
    }

    if (req.user?.role !== "admin" && wod.user.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await WodLog.findByIdAndDelete(id);
    res.json({ message: "WOD deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete WOD" });
  }
};

// POST /api/performance/consigne
export const saveCoachConsigne = async (req: Request, res: Response) => {
  try {
    const { userId, consigne } = req.body;
    const coachId = req.user?.userId;

    if (!userId || !consigne) {
      return res.status(400).json({
        message: "userId and consigne are required",
      });
    }

    // Deactivate previous consignes
    await CoachConsigne.updateMany({ user: userId }, { active: false });

    const newConsigne = await CoachConsigne.create({
      user: userId,
      coach: coachId,
      content: consigne,
      active: true,
    });

    // Send notification to the athlete
    await createNotification({
      recipient: userId,
      sender: coachId,
      title: "Nouvelle consigne d'entraînement",
      message: `Coach Mohamed Znaidy vous a envoyé une nouvelle consigne de performance : "${consigne.slice(0, 80)}..."`,
      type: "system",
      link: "/user/performance",
    });

    res.json({
      message: "Consigne saved and transmitted successfully",
      consigne: newConsigne.content,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to save coach consigne",
    });
  }
};

// PATCH /api/performance/toggle-tracking
export const toggleTrackingAccess = async (req: Request, res: Response) => {
  try {
    const { userId, enabled } = req.body;

    if (!userId || enabled === undefined) {
      return res.status(400).json({
        message: "userId and enabled flag are required",
      });
    }

    const access = await PerformanceAccess.findOneAndUpdate(
      { user: userId },
      { trackingEnabled: Boolean(enabled) },
      { upsert: true, new: true }
    );

    res.json({
      message: `Performance tracking ${access.trackingEnabled ? "enabled" : "disabled"}`,
      trackingEnabled: access.trackingEnabled,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to toggle tracking access",
    });
  }
};
