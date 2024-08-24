import { Router } from "express";
import {
  addRecord,
  setRecord,
  deleteRecord,
} from "../controllers/plans-controller.js";

const trackRouter = new Router();

trackRouter.post("/addRecord/:userID", addRecord);
trackRouter.post("/setRecord/:userID", setRecord);
trackRouter.delete("/deleteRecord/:userID", deleteRecord);
export { trackRouter };
