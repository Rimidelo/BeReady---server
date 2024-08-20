import { dbConnection } from "../db_connection.js";

export const getProfile = async (req, res) => {
  //TODO
};

export const getProfileStatus = async (req, res) => {
  const { userId } = req.params;
  const connection = await dbConnection.createConnection();
  const [isUserExist] = await connection.execute(
    `select 1 from tbl_110_User where UserID=${userId}`
  );
  const [hasPreferences] = await connection.execute(
    `select 1 from tbl_110_CFMS_Preferences where UserID=${userId}`
  );
  const [hasFirstOrderDetails] = await connection.execute(
    `select 1 from tbl_110_CFMS_First_Order where UserID=${userId}`
  );
  connection.end();
  res.json({
    personalDetails: isUserExist,
    preferences: hasPreferences,
    firstOrderDetails: hasFirstOrderDetails,
  });
};

export const getProfileImage = (req, res) => {
  console.log(req);
};

export const getFirstOrderDetails = async (req, res) => {
  const { userId } = req.params;
  const connection = await dbConnection.createConnection();
  const [firstOrderDetails] = await connection.execute(
    `select * from tbl_110_CFMS_First_Order where UserID=${userId}`
  );
  connection.end();
  res.json(firstOrderDetails);
};

const handleNotSuitableJob = async (jobId) => {
  const connection = await dbConnection.createConnection();
  await connection.execute(
    `delete from tbl_110_UserJobs
     where JobID = ${jobId};`
  );
  connection.end();
};

const assessSuitability = async (userId, firstOrderDetails) => {
  const isSuitabilityChanged = false;
  const connection = await dbConnection.createConnection();
  const [userJobs] = await connection.execute(
    `select jr.* from tbl_110_UserJobs as uj
     inner join tbl_110_JobRequirements as jr on uj.JobID = jr.JobID 
     where uj.UserID = ${userId};`
  );
  connection.end();
  userJobs.forEach((job) => {
    const isSuitableJob = Object.entries(job).every(
      ([name, value]) =>
        name == "JobID" || value == null || firstOrderDetails[name] >= value
    );
    if (!isSuitableJob) {
      handleNotSuitableJob(job.JobID);
      isSuitabilityChanged = true;
    }
  });
  return isSuitabilityChanged;
};

export const setFirstOrderDetails = async (req, res) => {
  const { userId } = req.params;
  const connection = await dbConnection.createConnection();
  const [firstOrderDetails] = await connection.execute(
    `INSERT INTO tbl_110_CFMS_First_Order 
     VALUES (${1}) ON DUPLICATE KEY UPDATE UserID = ${userId}`
  );
  connection.end();
  const isSuitabilityChanged = assessSuitability(userId, firstOrderDetails);
  res.status(200).json(`{ isSuitabilityChanged: ${isSuitabilityChanged} }`);
  console.log(req);
};
