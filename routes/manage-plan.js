import { Router } from "express";
import {
  getPlan,
  getUserActivity,
} from "../controllers/plans-controller.js";

const plansRouter = new Router();

plansRouter.get("/getPlan/:userID", getPlan);
plansRouter.get("/getUserActivity/:userID", getUserActivity);

export { plansRouter };
