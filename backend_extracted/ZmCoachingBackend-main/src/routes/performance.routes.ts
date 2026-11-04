import { Router } from "express";
import {
  getUserPerformance,
  getAllAthletesPerformanceOverview,
  addPerformanceSet,
  deletePerformanceSet,
  addRunLog,
  deleteRunLog,
  addHyroxLog,
  deleteHyroxLog,
  addWodLog,
  deleteWodLog,
  saveCoachConsigne,
  toggleTrackingAccess,
} from "../controllers/performance.controller";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

// Adhérent or Admin: Get performance data for a user
router.get("/user/:userId", protect, getUserPerformance);

// Admin: Overview of all athletes
router.get(
  "/admin/overview",
  protect,
  allowRoles("admin"),
  getAllAthletesPerformanceOverview
);

// Performance Sets (Musculation & Force)
router.post("/set", protect, addPerformanceSet);
router.delete("/set/:id", protect, deletePerformanceSet);

// Running Logs
router.post("/run", protect, addRunLog);
router.delete("/run/:id", protect, deleteRunLog);

// Hyrox Simulations
router.post("/hyrox", protect, addHyroxLog);
router.delete("/hyrox/:id", protect, deleteHyroxLog);

// WODs & Metcons
router.post("/wod", protect, addWodLog);
router.delete("/wod/:id", protect, deleteWodLog);

// Coach Consigne (Admin only)
router.post("/consigne", protect, allowRoles("admin"), saveCoachConsigne);

// Toggle Athlete Tracking Module Access (Admin only)
router.patch(
  "/toggle-tracking",
  protect,
  allowRoles("admin"),
  toggleTrackingAccess
);

export default router;
