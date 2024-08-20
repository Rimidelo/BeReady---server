import { dbConnection } from "../db_connection.js";

export const getPlan = async (req, res) => {
  const { userId } = req.params;
  const connection = await dbConnection.createConnection();
  const [userJobs] = await connection.execute(
    `select j.* from tbl_110_UserJobs as uj
     inner join tbl_110_Jobs as j
     on uj.JobID = j.JobID
     where uj.UserID = ${userId};`
  );
  const [userActivities] = await connection.execute(
    `select a.* from tbl_110_UserActivities as ua
     inner join tbl_110_Activities as a 
     on ua.ActivityID = a.ActivityID
     where ua.UserID = ${userId};`
  );
  connection.end();
  const userJobsAndActivities = userJobs.map((job) => ({
    ...job,
    compatibleActivities: userActivities.filter((activity) =>
      job.Characteristics.includes(activity.Type)
    ),
  }));
  res.json(userJobsAndActivities);
};

export const setPlan = (req, res) => {
  //TODO
  console.log(req);
};

export const getUserActivity = async (req, res) => {
  const { userId, activityId } = req.params;
  const connection = await dbConnection.createConnection();
  const [activityDetails] = await connection.execute(
    `select * from tbl_110_Activities
     where ActivityID = ${activityId};`
  );
  const [userRecords] = await connection.execute(
    `select * from tbl_110_UserActivityRecords
     where UserID = ${userId} and ActivityID = ${activityId};`
  );
  connection.end();

  res.json({ activityDetails, userRecords });
};

export const addRecord = (req, res) => {
  //TODO
  console.log(req);
};

export const setRecord = (req, res) => {
  //TODO
  console.log(req);
};

export const deleteRecord = (req, res) => {
  //TODO
  console.log(req);
};
