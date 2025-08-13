import express from "express"
import { useErrorHandler } from "./middlewares/errorHandler.mjs"
import { initApp } from "./utils/app/init.mjs"
import router from "./api/v1/routes/index.mjs"
const app = express()

await initApp(app)
app.use("/api/v1", router)
useErrorHandler(app)

export default app
