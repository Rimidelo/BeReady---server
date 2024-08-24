import { Router } from "express";
import {
  getProfile,
  getFirstOrderDetails,
  getProfileImage,
  getProfileStatus,
  setFirstOrderDetails,
} from "../controllers/profile-controller.js";

const profileRouter = new Router();

profileRouter.get("/getProfile/:userID", getProfile);
profileRouter.post("/login", getProfile);
profileRouter.get("/getProfileStatus/:userID", getProfileStatus);
profileRouter.get("/getProfileImage/:userID", getProfileImage);
profileRouter.get("/getFirstOrderDetails/:userID", getFirstOrderDetails);
profileRouter.post("/setFirstOrderDetails/:userID", setFirstOrderDetails);

export { profileRouter };
