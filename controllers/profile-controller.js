import { dbConnection } from "../db_connection.js";

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

export const setFirstOrderDetails = async (req, res) => {
  const { userId } = req.params;
  const connection = await dbConnection.createConnection();
  const [firstOrderDetails] = await connection.execute(
    `INSERT INTO tbl_110_CFMS_First_Order 
     VALUES (${1}) ON DUPLICATE KEY UPDATE UserID = ${userId}`
  );
  connection.end();
  // assessSuitability(userId);
  console.log(req);
};
