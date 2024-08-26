import { Router } from "express";
import {
  getPlan,
  getUserActivity,
  getAllActivities,
  getUserActivities,
  updateUserActivities
} from "../controllers/plans-controller.js";

const plansRouter = new Router();

plansRouter.get("/getPlan/:userID", getPlan);
plansRouter.get("/getUserActivity/:userID", getUserActivity);
plansRouter.get('/getAllActivities', getAllActivities);
plansRouter.get('/getUserActivities/:userID', getUserActivities);
plansRouter.post('/updateUserActivities/:userID', updateUserActivities);


export { plansRouter };
