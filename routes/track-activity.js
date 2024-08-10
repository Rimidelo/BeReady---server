import { Router } from "express";
import {} from "../controllers/plans-controller.js";

const trackRouter = new Router();

trackRouter.post("addActivityToPlan/:userid", addActivityToPlan);
trackRouter.delete("removeActivityFromPlan/:userid", removeActivityFromPlan);
trackRouter.post("addJobToPlan/:userid", addJobToPlan);
trackRouter.delete("removeJobFromPlan/:userid", removeJobFromPlan);
trackRouter.get("getPlan/:userid", getPlan);
export { trackRouter };

//not finishedddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
