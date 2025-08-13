import { Sequelize } from "sequelize"
import config from "./default.mjs"

class DB {
  constructor() {
    this.sequelize = this.getSequelizeInstance()
  }
  getSequelizeInstance() {
    return new Sequelize({
      host: config.db.host,
      dialect: "mysql",
      username: config.db.user,
      password: config.db.password,
      database: config.db.name,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  }
  async connect() {
    try {
      await this.sequelize.authenticate()
      console.log("Successfully connected to DB")
    } catch (error) {
      console.log("Failed to connect to DB")
      console.log(error)
      process.exit(1)
    }
  }
}

const db = new DB()

export const sequelize = db.sequelize

export default db
