import { createConnection } from "mysql";
import { Sequelize } from 'sequelize';
export const dbConfig = () => {
  const host = process.env.DBHOST || "";
  const user = process.env.DBUSER || "";
  const password = process.env.DBPASSWORD || "";
  const database = process.env.DBNAME || "";

  return { host, user, password, database };
};
export const dbConnect = (dbConfig) => {
  const config = dbConfig();
  if (dbConnect.connection) {
    return dbConnect.connection;
  } else {
    try {
      const connection = createConnection(config);
      dbConnect.connection = connection;
      console.log("connected to database");
      return connection;
    } catch (err) {
      console.log(`Error creating connection: ${err}`);
      return null;
    }
  }
};

// const dbConnect =  (dbConfig) => {
//   const config = dbConfig();
//   const connection = mysql.createConnection(config);
//   if (connection) {
//     return connection;
//   } else {
//     console.log("error creating connection");
//     return false;
//   }
// };
const dbClose = (connection) => {
  if (!connection) {
    return false;
  }
  connection.end((err) => {
    if (err) {
      console.error("Error closing connection:", err);
    } else {
      console.log("Connection closed successfully.");
    }
  });
};
// export { dbConnect, dbClose, dbConfig };
