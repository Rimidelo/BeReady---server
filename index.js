import cors from "cors";
import { config } from "dotenv";
import express, { json, urlencoded } from "express";
config();
const app = express();
const port = process.env.PORT || 8081;

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("This is BeReady App");
});

app.use('/assets', express.static('assets'));

import { activitiesRouter } from "./routes/manage-activities.js";
app.use("/activities", activitiesRouter);

import { profileRouter } from "./routes/profile.js";
app.use("/profile", profileRouter);

import { plansRouter } from "./routes/manage-plan.js";
app.use("/managePlan", plansRouter);

import { trackRouter } from "./routes/track-activity.js";
app.use("/userActivityRecords", trackRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something is broken!");
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
