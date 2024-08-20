import { Router } from "express";
import {
  getPlan,
  setPlan,
  getUserActivity,
} from "../controllers/plans-controller.js";

const plansRouter = new Router();

plansRouter.get("getPlan/:userid", getPlan);
plansRouter.post("setPlan/:userid", setPlan);
plansRouter.get("getUserActivity/:userid", getUserActivity);

export { plansRouter };
