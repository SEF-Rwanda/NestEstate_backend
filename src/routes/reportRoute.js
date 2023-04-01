import express from "express";

import ReportController from "../controllers/ReportController";

const router = express.Router();

router.get("/", ReportController.countRecords);

export default router;
