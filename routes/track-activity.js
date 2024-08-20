import { Router } from "express";
import {
  addRecord,
  setRecord,
  deleteRecord,
} from "../controllers/plans-controller.js";

const trackRouter = new Router();

trackRouter.post("addRecord/:userid", addRecord);
trackRouter.post("setRecord/:userid", setRecord);
trackRouter.delete("deleteRecord/:userid", deleteRecord);
export { trackRouter };
