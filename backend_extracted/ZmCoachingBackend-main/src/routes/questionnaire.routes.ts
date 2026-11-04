import { Router } from "express";
import {
  getAllQuestionnaires,
  getMyQuestionnaire,
  getQuestionnaireById,
  saveOrSubmitQuestionnaire,
  updateQuestionnaireStatus,
  deleteQuestionnaire,
} from "../controllers/questionnaire.controller";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

// Admin: Get all submitted questionnaires
router.get("/", protect, allowRoles("admin"), getAllQuestionnaires);
router.get("/admin", protect, allowRoles("admin"), getAllQuestionnaires);

// Adhérent: Get personal questionnaire
router.get("/me", protect, getMyQuestionnaire);

// Adhérent: Save draft or submit
router.post("/", protect, saveOrSubmitQuestionnaire);
router.post("/me/submit", protect, saveOrSubmitQuestionnaire);
router.put("/me", protect, saveOrSubmitQuestionnaire);

// Get specific questionnaire by ID
router.get("/:id", protect, getQuestionnaireById);

// Admin: Update status or add coach review notes
router.patch("/admin/:id", protect, allowRoles("admin"), updateQuestionnaireStatus);
router.patch("/:id", protect, allowRoles("admin"), updateQuestionnaireStatus);

// Admin: Delete questionnaire
router.delete("/:id", protect, allowRoles("admin"), deleteQuestionnaire);

export default router;
