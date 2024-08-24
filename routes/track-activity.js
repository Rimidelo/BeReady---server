import { Router } from "express";
import {
  addRecord,
  setRecord,
  deleteRecord,
} from "../controllers/plans-controller.js";

const trackRouter = new Router();

trackRouter.post("/setRecord", setRecord);
trackRouter.delete("/deleteRecord", deleteRecord);
export { trackRouter };
