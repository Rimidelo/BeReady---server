import { dbConnection } from "../db_connection.js";

export const getProfile = async (req, res) => {
  const { email, password } = req.body;
  const connection = await dbConnection.createConnection();
  const [userProfile] = await connection.execute(
    `SELECT * FROM tbl_110_User WHERE Email = ? AND Password = ?`,
    [email, password]
  );
  connection.end();
  if (userProfile.length > 0) {
    res.json(userProfile[0]);
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};



export const getProfileStatus = async (req, res) => {
  const { userID } = req.params;
  const connection = await dbConnection.createConnection();
  const [isUserExist] = await connection.execute(
    `select 1 from tbl_110_User where UserID=${userID}`
  );
  const [hasPreferences] = await connection.execute(
    `select 1 from tbl_110_CFMS_Preferences where UserID=${userID}`
  );
  const [hasFirstOrderDetails] = await connection.execute(
    `select 1 from tbl_110_CFMS_First_Order where UserID=${userID}`
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
  const { userID } = req.params;
  const connection = await dbConnection.createConnection();
  const [firstOrderDetails] = await connection.execute(
    `select * from tbl_110_CFMS_First_Order where UserID=${userID}`
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

const assessSuitability = async (userID, firstOrderDetails) => {
  const isSuitabilityChanged = false;
  const connection = await dbConnection.createConnection();
  const [userJobs] = await connection.execute(
    `select jr.* from tbl_110_UserJobs as uj
     inner join tbl_110_JobRequirements as jr on uj.JobID = jr.JobID 
     where uj.UserID = ${userID};`
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
  const { userID } = req.params;
  const connection = await dbConnection.createConnection();
  const [firstOrderDetails] = await connection.execute(
    `INSERT INTO tbl_110_CFMS_First_Order 
     VALUES (${1}) 
     ON DUPLICATE KEY UPDATE UserID = ${userID}`
  );
  connection.end();
  const isSuitabilityChanged = assessSuitability(userID, firstOrderDetails);
  res.status(200).json(`{ isSuitabilityChanged: ${isSuitabilityChanged} }`);
};
