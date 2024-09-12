import { Sequelize } from "sequelize";
import pg from "pg";

// export const sequelize = new Sequelize("Alpaviram", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
//   define: {
//     freezeTableName: true,
//   },
// });

export const sequelize = new Sequelize(
  "postgresql://postgres.zggvyibhbndhoultupvl:Alpaviram@527969@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  {
    dialectModule: pg,
  }
);

// const connectdb = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected to the db");
//   } catch (error) {
//     console.log("Unable to cinnect to db ", error);
//   }
// };

export const db = async () => {
  await sequelize
    .authenticate()
    .then(() => {
      console.log("Database Connection Successful!");
    })
    .catch((error) => {
      console.log("Unable to connect to db ", error);
    });
};

// making table
sequelize
  .sync()
  .then(() => {
    console.log("Tables synchronized successfully!");
  })
  .catch((error) => {
    console.error("Error synchronizing tables:", error);
  });
