import { dbConnection } from "../db_connection.js";

const getProgress = async (userID, activityID, targetValue) => {
  const connection = await dbConnection.createConnection();
  const [last] = await connection.execute(
    `select Records as record
     from tbl_110_UserActivityRecords
     where UserID=${userID} and ActivityID=${activityID}
     ORDER BY recordDate DESC
     limit 1;`
  );
  connection.end();
  return (targetValue - Math.abs(targetValue - last.record)) / targetValue;
};

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
  const { userId, activityId, recordDate, result, feedback } = req.params;
  const connection = await dbConnection.createConnection();
  const [queryResult] = await connection.execute(
    `INSERT INTO tbl_110_UserActivityRecords (UserID, ActivityID, recordDate, RECORDS, Description)
     VALUES (${userId}, ${activityId}, ${recordDate}, ${result}, ${feedback})
     ON DUPLICATE KEY UPDATE 
     RECORDS = VALUES(RECORDS), 
     Description = VALUES(Description)`
  );
  connection.end();
  res.status(200);
};

export const deleteRecord = async (req, res) => {
  const { userId, activityId, recordDate } = req.params;
  const connection = await dbConnection.createConnection();
  const [queryResult] = await connection.execute(
    `DELETE from tbl_110_UserActivityRecords
     where UserID=${userId} and ActivityID=${activityId} and recordDate=${recordDate}`
  );
  connection.end();
  res.status(200);
};
