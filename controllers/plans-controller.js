import { dbConnection } from "../db_connection.js";

export const getPlan = async (req, res) => {
  const { userId } = req.params;
  const connection = await dbConnection.createConnection();
  const [userJobs] = await connection.execute(
    `select 
        j.JobID as id,
        j.JobTitle as title,
        j.Characteristics
     from tbl_110_UserJobs as uj
     inner join tbl_110_Jobs as j
     on uj.JobID = j.JobID
     where uj.UserID = ${userId};`
  );
  const [userActivities] = await connection.execute(
    `select 
        a.ActivityID as id,
        a.Name as name,
        a.Type as type 
     from tbl_110_UserActivities as ua
     inner join tbl_110_Activities as a 
     on ua.ActivityID = a.ActivityID
     where ua.UserID = ${userId};`
  );
  connection.end();
  const jobs = userJobs.map((job) => ({
    ...job,
    activities: userActivities.filter((activity) =>
      job.Characteristics.includes(activity.Type)
    ),
  }));
  res.json({ jobs });
};

export const getUserActivity = async (req, res) => {
  const { userId, activityId } = req.params;
  const connection = await dbConnection.createConnection();
  const [activityDetails] = await connection.execute(
    `select
        ActivityID as id,
        Name as name,
        TargetValue as targetValue,
        TargetUnit as targetUnit
     from tbl_110_Activities
     where ActivityID = ${activityId};`
  );
  const [userRecords] = await connection.execute(
    `select 
        DATE_FORMAT(recordDate, '%d/%m/%Y') as date,
        Records as result
     from tbl_110_UserActivityRecords
     where UserID = ${userId} and ActivityID = ${activityId};`
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
