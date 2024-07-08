import express from "express";

import { khaltiPay } from "../controllers/khalti-controllers.js";

const router = express.Router();

router.post("/pay", khaltiPay);

export default router;
