import { Router } from "express";
import {
  getProfile,
  getFirstOrderDetails,
  setFirstOrderDetails,
} from "../controllers/profile-controller.js";

const profileRouter = new Router();

profileRouter.post("/login", getProfile);
profileRouter.get("/getFirstOrderDetails/:userID", getFirstOrderDetails);
profileRouter.post("/setFirstOrderDetails/:userID", setFirstOrderDetails);

export { profileRouter };
