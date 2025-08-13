import cookieParser from "cookie-parser"
import logger from "morgan"
import path from "path"
import express from "express"
import UploadsManager from "../UploadsManager.mjs"
import SeedUploader from "../seedHelpers/SeedUploader.mjs"
import { initTables, syncTables } from "../seedHelpers/syncTables.mjs"
import helmet from "helmet"
import config from "../../config/default.mjs"
import cors from "cors"
import { default as createEntityAssociations } from "../../api/v1/models/associations/index.mjs"
import db from "../../config/db.mjs"
import { default as session, sessionStore } from "../../config/session.mjs"

const __dirname = import.meta.dirname

export const initApp = async (app) => {
  await db.connect()
  createEntityAssociations()
  // await initTables()
  // SeedUploader.uploadAll()

  app.set("views", path.join(__dirname, "../../views"))
  app.set("view engine", "ejs")
  app.set("trust proxy", 1)

  //Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false,
      hsts: config.appEnv === "production" ? { maxAge: 31536000, includeSubDomains: true } : false,
      referrerPolicy: { policy: "no-referrer" },
      frameguard: { action: "deny" },
      xssFilter: true,
    })
  )

  //Session
  app.use(session)
  sessionStore.sync()

  //Cors
  app.use(
    cors({
      origin: config.appEnv === "production" ? config.cors.origins : ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )

  app.use(logger("dev"))
  app.use(express.json({ limit: "1mb" }))
  app.use(express.urlencoded({ limit: "1mb", extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, "../../public")))
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")))

  UploadsManager.initUploadFolder()
}
