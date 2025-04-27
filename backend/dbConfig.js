// const { Sequelize } = require("sequelize");
// const fs = require("fs");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql",
//   }
// );

// const writeErrorToFile = (error) => {
//   const timestamp = new Date().toISOString();
//   const logMessage = `[${timestamp}] - Error: ${error.message}\nStack Trace:\n${error.stack}\n\n`;

//   fs.writeFile("error.txt", logMessage, { flag: "a" }, (err) => {
//     if (err) {
//       console.error("Failed to write to the text file:", err.message);
//     } else {
//       console.log("Error details written to error.txt.");
//     }
//   });
// };

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Successfully connected to the MySQL.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err.message);
//     writeErrorToFile(err);
//   });

// module.exports = sequelize;


const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    pool: {
      max: 50, // Maximum connections in the pool (adjust if needed)
      min: 10, // Minimum number of connections kept alive
      acquire: 30000, // Max time (ms) to get a connection before throwing an error
      idle: 5000, // Max time (ms) a connection can stay idle before being released
    },
    logging: false, // Disable logging for better performance
  }
);

const writeErrorToFile = (error) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] - Error: ${error.message}\nStack Trace:\n${error.stack}\n\n`;

  fs.writeFile("error.txt", logMessage, { flag: "a" }, (err) => {
    if (err) {
      console.error("Failed to write to the text file:", err.message);
    } else {
      console.log("Error details written to error.txt.");
    }
  });
};

sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to MySQL with connection pooling.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
    writeErrorToFile(err);
  });

// Close the database connection when the server shuts down
process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await sequelize.close();
  console.log("Database connection closed.");
  process.exit(0);
});

module.exports = sequelize;
