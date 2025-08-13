import { sequelize } from "../../config/db.mjs"

export async function initTables() {
  //USE ONLY ONCE!!!
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
    await sequelize.sync({ force: true })
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1")
    console.log("Successfully initialized all tables")
  } catch (error) {
    console.log("Failed to initialize tables")
    console.log(error)
    process.exit(0)
  }
}

export async function syncTables() {
  try {
    await sequelize.sync({ alter: true })
    console.log("Successfully synced all tables")
  } catch (error) {
    console.log("Failed to sync tables")
    console.log(error)
    process.exit(0)
  }
}
