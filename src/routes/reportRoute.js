import express from "express";

import ReportController from "../controllers/ReportController";
import protectedRoute from "../middlewares/protectRoute";

const router = express.Router();

router.get("/", protectedRoute, ReportController.countRecords);

export default router;
