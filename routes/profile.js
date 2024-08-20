import { Router } from "express";
import {
  getProfile,
  getFirstOrderDetails,
  getProfileImage,
  getProfileStatus,
  setFirstOrderDetails,
} from "../controllers/profile-controller.js";
const profileRouter = new Router();

profileRouter.get("getProfile/:userId", getProfile);
profileRouter.get("login", getProfile);
profileRouter.get("getProfileStatus/:userId", getProfileStatus);
profileRouter.get("getProfileImage/:userId", getProfileImage);
profileRouter.get("getFirstOrderDetails/:userId", getFirstOrderDetails);
profileRouter.post("setFirstOrderDetails/:userId", setFirstOrderDetails);

export { profileRouter };
