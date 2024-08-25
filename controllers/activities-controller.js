import { dbConnection } from "../db_connection.js";
import { formatActivity } from "../utils/formatters.js";

export const getAllActivities = async (req, res) => {
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
        Type,
        Name,
        FrameworkType,
        InstituteID,
        TargetValue,
        TargetUnit,
        Description
    } = req.body;

    const connection = await dbConnection.createConnection();
    const [rows] = await connection.execute(`
        SELECT MAX(CAST(ActivityID AS UNSIGNED)) AS maxActivityID
        FROM tbl_110_Activities
      `);
    const newActivityId = (rows[0].maxActivityID + 1).toString();
    await connection.execute(
        "INSERT INTO tbl_110_Activities (ActivityID, Type, Name, FrameworkType, InstituteID, TargetValue, TargetUnit, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [newActivityId, Type, Name, FrameworkType, InstituteID, TargetValue, TargetUnit, Description]
    );

    await connection.end();
    res.status(201).json({ message: "Activity created", newActivityId });
};



export const editActivity = async (req, res) => {
    const { activityID } = req.params;
    if (!activityID) {
        return res.status(400).json({ error: "Activity ID is missing." });
    }
    let query = "UPDATE tbl_110_Activities SET ";
    const queryValues = [];
    const { Type, Name, FrameworkType, InstituteID, TargetValue, TargetUnit, Description } = req.body;  /* Add Description */
    if (Type) {
        query += "Type = ?, ";
        queryValues.push(Type);
    }
    if (Name) {
        query += "Name = ?, ";
        queryValues.push(Name);
    }
    if (FrameworkType) {
        query += "FrameworkType = ?, ";
        queryValues.push(FrameworkType);
    }
    if (InstituteID) {
        query += "InstituteID = ?, ";
        queryValues.push(InstituteID);
    }
    if (TargetValue) {
        query += "TargetValue = ?, ";
        queryValues.push(TargetValue);
    }
    if (TargetUnit) {
        query += "TargetUnit = ?, ";
        queryValues.push(TargetUnit);
    }
    if (Description) {
        query += "Description = ?, ";
        queryValues.push(Description);
    }

    query = query.slice(0, -2) + " WHERE ActivityID = ?";
    queryValues.push(activityID);
    console.log("Executing query:", query);
    console.log("With values:", queryValues);
    try {
        const connection = await dbConnection.createConnection();
        const [result] = await connection.execute(query, queryValues);
        await connection.end();

        console.log("Result from SQL execution:", result);

        if (result.affectedRows > 0) {
            res.json({ message: "Activity updated successfully." });
        } else {
            res.status(404).json({ message: "Activity not found." });
        }
    } catch (error) {
        console.error("Error updating activity:", error);
        res.status(500).json({ error: "Failed to update activity." });
    }
};





export const deleteActivity = async (req, res) => {
    const { ActivityID } = req.params;
    console.log(`Received request to delete activity with ID: ${ActivityID}`);

    if (!ActivityID || isNaN(Number(ActivityID))) {
        return res.status(400).json({ error: "Invalid activity ID" });
    }
    try {
        const connection = await dbConnection.createConnection();
        const [result] = await connection.execute(
            `DELETE FROM tbl_110_Activities WHERE ActivityID = ?`,
            [ActivityID]
        );
        await connection.end();

        if (result.affectedRows > 0) {
            res.json({ message: "Activity deleted successfully" });
        } else {
            res.status(404).json({ message: "Activity not found" });
        }
    } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).json({ error: "Failed to delete activity" });
    }
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
