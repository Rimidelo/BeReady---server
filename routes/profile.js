import { Router } from "express";
import {
  //   getProfile,
  //   createProfile,
  //   editProfile,
  //   deleteProfile,
  getFirstOrderDetails,
  getProfileImage,
  getProfileStatus,
  setFirstOrderDetails,
} from "../controllers/profile-controller.js";
const profileRouter = new Router();

// profileRouter.get("/:id", getProfile);
// profileRouter.post("/", createProfile);
// profileRouter.put("/:id", editProfile);
// profileRouter.delete("/:id", deleteProfile);
profileRouter.get("getProfileStatus/:userId", getProfileStatus);
profileRouter.get("getProfileImage/:userId", getProfileImage);
profileRouter.get("getFirstOrderDetails/:userId", getFirstOrderDetails);
profileRouter.post("setFirstOrderDetails/:userId", setFirstOrderDetails);

export { profileRouter };
