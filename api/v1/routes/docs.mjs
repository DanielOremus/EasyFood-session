import swaggerUi from "swagger-ui-express"
import { Router } from "express"
import config from "../../../config/default.mjs"
import fs from "fs"
const router = Router()
const swaggerFile = JSON.parse(fs.readFileSync(config.docs.outputFile, "utf-8"))

swaggerFile.servers = [
  {
    url: config.api.baseUrl,
  },
]

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile))

export default router
