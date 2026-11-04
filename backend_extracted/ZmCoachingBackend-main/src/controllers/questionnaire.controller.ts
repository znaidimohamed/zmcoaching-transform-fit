import { Request, Response } from "express";
import { Questionnaire } from "../models/questionnaire.model";
import { User } from "../models/user.model";
import { createNotification } from "../utils/createNotification";

// GET /api/questionnaires (Admin)
export const getAllQuestionnaires = async (req: Request, res: Response) => {
  try {
    const questionnaires = await Questionnaire.find()
      .populate("user", "fullName email phone createdAt")
      .sort({ updatedAt: -1 });

    res.json({
      questionnaires,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch questionnaires",
    });
  }
};

// GET /api/questionnaires/me (Current Adhérent)
export const getMyQuestionnaire = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const questionnaire = await Questionnaire.findOne({ user: userId });

    res.json({
      questionnaire: questionnaire || null,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch my questionnaire",
    });
  }
};

// GET /api/questionnaires/:id
export const getQuestionnaireById = async (req: Request, res: Response) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id).populate(
      "user",
      "fullName email phone"
    );

    if (!questionnaire) {
      return res.status(404).json({ message: "Questionnaire not found" });
    }

    // Check permissions
    if (
      req.user?.role !== "admin" &&
      questionnaire.user._id.toString() !== req.user?.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ questionnaire });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch questionnaire",
    });
  }
};

// POST or PUT /api/questionnaires (Save draft or submit)
export const saveOrSubmitQuestionnaire = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const {
      profile,
      goal,
      level,
      availability,
      health,
      nutrition,
      final,
      status,
      coachNotes,
    } = req.body;

    const isSubmitting = status === "submitted";

    const updatePayload: any = {
      user: userId,
      status: status || "draft",
    };

    if (profile) updatePayload.profile = profile;
    if (goal) updatePayload.goal = goal;
    if (level) updatePayload.level = level;
    if (availability) updatePayload.availability = availability;
    if (health) updatePayload.health = health;
    if (nutrition) updatePayload.nutrition = nutrition;
    if (final) updatePayload.final = final;
    if (coachNotes !== undefined) updatePayload.coachNotes = coachNotes;
    if (isSubmitting) updatePayload.submittedAt = new Date();

    const questionnaire = await Questionnaire.findOneAndUpdate(
      { user: userId },
      updatePayload,
      { upsert: true, new: true, runValidators: false }
    );

    // Sync basic info to the User model if provided
    if (profile) {
      const userUpdate: any = {};
      if (profile.age) userUpdate.age = profile.age;
      if (profile.height) userUpdate.height = profile.height;
      if (profile.currentWeight) userUpdate.weight = profile.currentWeight;
      if (goal?.primaryGoal) userUpdate.goal = goal.primaryGoal;
      if (final?.whatsappNumber) userUpdate.phone = final.whatsappNumber;

      await User.findByIdAndUpdate(userId, userUpdate);
    }

    // If submitted, notify admin/coach
    if (isSubmitting) {
      const admins = await User.find({ role: "admin" }).select("_id");
      for (const admin of admins) {
        await createNotification({
          recipient: admin._id,
          sender: userId,
          title: "Nouveau questionnaire adhérent soumis",
          message: "Un adhérent a soumis son bilan initial et ses objectifs.",
          type: "system",
          link: "/dashboard/questionnaires",
        });
      }
    }

    res.status(200).json({
      message: isSubmitting
        ? "Questionnaire submitted successfully to Coach Mohamed Znaidy"
        : "Questionnaire draft saved successfully",
      questionnaire,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to save questionnaire",
    });
  }
};

// PATCH /api/questionnaires/admin/:id or /api/questionnaires/:id (Admin update)
export const updateQuestionnaireStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, coachNotes } = req.body;

    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      return res.status(404).json({ message: "Questionnaire not found" });
    }

    if (status) questionnaire.status = status;
    if (coachNotes !== undefined) questionnaire.coachNotes = coachNotes;

    await questionnaire.save();

    // Notify user if coach added feedback
    if (coachNotes) {
      await createNotification({
        recipient: questionnaire.user,
        sender: req.user?.userId,
        title: "Retour du coach sur votre questionnaire",
        message: "Coach Mohamed Znaidy a analysé votre questionnaire et a laissé des remarques.",
        type: "system",
        link: "/user/questionnaire",
      });
    }

    res.json({
      message: "Questionnaire updated successfully",
      questionnaire,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to update questionnaire",
    });
  }
};

// DELETE /api/questionnaires/:id (Admin only)
export const deleteQuestionnaire = async (req: Request, res: Response) => {
  try {
    await Questionnaire.findByIdAndDelete(req.params.id);
    res.json({ message: "Questionnaire deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to delete questionnaire",
    });
  }
};
