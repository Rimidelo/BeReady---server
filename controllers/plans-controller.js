import { dbConnection } from "../db_connection.js";

export const getPlan = async (req, res) => {
  const { userID } = req.params;
  const connection = await dbConnection.createConnection();
  const [userJobs] = await connection.execute(
    `select
        j.JobID as id,
        j.JobTitle as title,
        j.Characteristics
     from tbl_110_UserJobs as uj
     inner join tbl_110_Jobs as j
     on uj.JobID = j.JobID
     where uj.UserID = ${userID};`
  );
  const [userActivities] = await connection.execute(
    `SELECT
        a.ActivityID AS id,
        a.Name AS name,
        a.Type AS type,
        a.TargetValue AS targetValue,
        (
          SELECT uar.Records
          FROM tbl_110_UserActivityRecords uar
          WHERE uar.UserID = ${userID} AND uar.ActivityID = a.ActivityID
          ORDER BY uar.recordDate DESC LIMIT 1
        ) AS lastRecord
      FROM tbl_110_UserActivities ua
      INNER JOIN tbl_110_Activities a
      ON ua.ActivityID = a.ActivityID
      WHERE ua.UserID = ${userID};`
  );
  connection.end();
  const jobs = userJobs.map((job) => ({
    ...job,
    activities: userActivities
      .filter((activity) => job.Characteristics.includes(activity.type))
      .map((activity) => {
        let progress =
          activity.targetValue -
          Math.abs(activity.targetValue - activity.lastRecord);
        progress = progress < 0 ? 0 : (progress / activity.targetValue) * 100;
        progress = Math.round(progress);
        return {
          ...activity,
          progress,
        };
      }),
  }));
  res.json({ jobs });
};

export const getUserActivity = async (req, res) => {
  const { userID, activityID } = req.params;
  const connection = await dbConnection.createConnection();
  const [activityDetails] = await connection.execute(
    `select
        ActivityID as id,
        Name as name,
        TargetValue as targetValue,
        TargetUnit as targetUnit
     from tbl_110_Activities
     where ActivityID = ${activityID};`
  );
  const [userRecords] = await connection.execute(
    `select
        DATE_FORMAT(recordDate, '%d/%m/%Y') as date,
        Records as result
     from tbl_110_UserActivityRecords
     where UserID = ${userID} and ActivityID = ${activityID};`
  );
  connection.end();

  res.json({
    activityDetails,
    userRecords,
  });
};

export const setRecord = async (req, res) => {
  const { userId, activityId, recordDate, result, feedback } = req.body;
  const connection = await dbConnection.createConnection();
  const [queryResult] = await connection.execute(
    `REPLACE INTO tbl_110_UserActivityRecords
     VALUES ('${userId}', '${activityId}', '${recordDate}', '${result}', '${feedback}');`
  );
  connection.end();
  res.status(200);
};

export const deleteRecord = async (req, res) => {
  const { userId, activityId, recordDate } = req.body;
  const connection = await dbConnection.createConnection();
  const [queryResult] = await connection.execute(
    `DELETE from tbl_110_UserActivityRecords
     where UserID=${userId} and ActivityID=${activityId} and recordDate=${recordDate}`
  );
  connection.end();
  res.status(200);
};

export const getAllActivities = async (req, res) => {
  const connection = await dbConnection.createConnection();
  const [activities] = await connection.execute(
    `SELECT
        ActivityID as id,
        Name as name,
        Type as type,
        TargetValue as targetValue
     FROM tbl_110_Activities;`
  );

  connection.end();

  res.json({ activities });
};

export const getUserActivities = async (req, res) => {
  const { userID } = req.params;
  const connection = await dbConnection.createConnection();
  try {
    const [userActivities] = await connection.execute(
      `SELECT ActivityID FROM tbl_110_UserActivities WHERE UserID = ?`,
      [userID]
    );
    if (userActivities.length === 0) {
      console.log(`No activities found for userID: ${userID}`);
    }
    res.json({ activities: userActivities });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({ error: "Failed to fetch user activities" });
  } finally {
    connection.end();
  }
};

export const updateUserActivities = async (req, res) => {
  const { userID } = req.params;
  const { selectedActivities } = req.body;
  const connection = await dbConnection.createConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `DELETE FROM tbl_110_UserActivities WHERE UserID = ?`,
      [userID]
    );
    for (const activityID of selectedActivities) {
      await connection.execute(
        `INSERT INTO tbl_110_UserActivities (UserID, ActivityID) VALUES (?, ?)`,
        [userID, activityID]
      );
    }
    await connection.commit();

    res.status(200).json({ message: "User activities updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating user activities:", error);
    res.status(500).json({ error: "Failed to update user activities" });
  } finally {
    connection.end();
  }
};
