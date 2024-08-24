import { dbConnection } from "../db_connection.js";
import { formatActivity } from "../utils/formatters.js";

export const getAllActivities = async (req, res) => {
    const connection = await dbConnection.createConnection();
    const [rows] = await connection.execute(`
        SELECT
            a.*,
             DATE_FORMAT(s.ScheduleDate, '%d/%m/%Y') AS ScheduleDate,
            TIME_FORMAT(s.StartTime, '%H:%i') AS StartTime,  -- Format without seconds
            TIME_FORMAT(s.EndTime, '%H:%i') AS EndTime,      -- Format without seconds
            s.ParticipantsActual AS ParticipantsActual,
            s.ParticipantsMax AS ParticipantsMax,
            s.ScheduleDay AS ScheduleDay,
            s.RepeatFrequency AS RepeatFrequency
        FROM tbl_110_Activities a
        LEFT JOIN tbl_110_ScheduledActivities s ON a.ActivityID = s.ActivityID
    `);
    await connection.end();

    res.json({ activities: rows.map(formatActivity) });
};


export const getActivitiesByInstitute = async (req, res) => {
  const { instituteID } = req.params;
  const connection = await dbConnection.createConnection();
  const [rows] = await connection.execute(`
        SELECT
             a.*,
             DATE_FORMAT(s.ScheduleDate, '%d/%m/%Y') AS ScheduleDate,
            TIME_FORMAT(s.StartTime, '%H:%i') AS StartTime,
            TIME_FORMAT(s.EndTime, '%H:%i') AS EndTime,
            s.ParticipantsActual AS ParticipantsActual,
            s.ParticipantsMax AS ParticipantsMax,
            s.ScheduleDay AS ScheduleDay,
            s.RepeatFrequency AS RepeatFrequency
        FROM tbl_110_Activities a
        LEFT JOIN tbl_110_ScheduledActivities s ON a.ActivityID = s.ActivityID
        WHERE a.InstituteID = ${instituteID}
    `);
  await connection.end();

  res.json({ activities: rows.map(formatActivity) });
};

export const getActivity = async (req, res) => {
  const { activityID } = req.params;
  const connection = await dbConnection.createConnection();
  const [rows] = await connection.execute(
    `
        SELECT
             a.*,
             DATE_FORMAT(s.ScheduleDate, '%d/%m/%Y') AS ScheduleDate,
            TIME_FORMAT(s.StartTime, '%H:%i') AS StartTime,
            TIME_FORMAT(s.EndTime, '%H:%i') AS EndTime,
            s.ParticipantsActual AS ParticipantsActual,
            s.ParticipantsMax AS ParticipantsMax,
            s.ScheduleDay AS ScheduleDay,
            s.RepeatFrequency AS RepeatFrequency
        FROM tbl_110_Activities a
        LEFT JOIN tbl_110_ScheduledActivities s ON a.ActivityID = s.ActivityID
        WHERE a.ActivityID = ?
    `,
    [activityID]
  );
  await connection.end();

  if (rows.length === 0) {
    res.status(404).json({ message: "Activity not found" });
  } else {
    res.json(formatActivity(rows[0]));
  }
};

export const createActivity = async (req, res) => {
    const {
        ActivityID,
        Type,
        Name,
        FrameworkType,
        CompanyID,
        TargetValue,
        TargetUnit,
    } = req.body;
    const connection = await dbConnection.createConnection();
    await connection.execute(
        "INSERT INTO tbl_110_Activities (ActivityID, Type, Name, FrameworkType, CompanyID, TargetValue, TargetUnit) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [ActivityID, Type, Name, FrameworkType, CompanyID, TargetValue, TargetUnit]
    );
    await connection.end();
    res.status(201).json({ message: "Activity created" });
};

export const editActivity = async (req, res) => {
  const { activityID } = req.params;
  const { Type, Name, FrameworkType, CompanyID, TargetValue, TargetUnit } =
    req.body;
  const connection = await dbConnection.createConnection();
  await connection.execute(
    `UPDATE tbl_110_Activities 
     SET 
        Type = ?, 
        Name = ?, 
        FrameworkType = ?, 
        CompanyID = ?, 
        TargetValue = ?, 
        TargetUnit = ? 
     WHERE ActivityID = ?`,
    [Type, Name, FrameworkType, CompanyID, TargetValue, TargetUnit, activityID]
  );
  await connection.end();
  res.json({ message: "Activity updated" });
};

export const deleteActivity = async (req, res) => {
  const { activityID } = req.params;
  const connection = await dbConnection.createConnection();
  await connection.execute(
    `DELETE FROM tbl_110_Activities WHERE ActivityID = ?`,
    [activityID]
  );
  await connection.end();
  res.json({ message: "Activity deleted" });
};

export const scheduleActivity = async (req, res) => {
  const { activityID } = req.params;
  const { ScheduleDate, ScheduleDay, ScheduleHours, RepeatFrequency } =
    req.body;
  const connection = await dbConnection.createConnection();
  await connection.execute(
    `INSERT INTO tbl_110_ScheduledActivities (ScheduledActivityID, ActivityID, ScheduleDate, ScheduleDay, ScheduleHours, RepeatFrequency) VALUES (?, ?, ?, ?, ?, ?)`,
    [activityID, activityID, ScheduleDate, ScheduleDay, ScheduleHours, RepeatFrequency]
  );
  await connection.end();
  res.status(201).json({ message: "Activity scheduled" });
};
