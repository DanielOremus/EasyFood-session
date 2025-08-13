import { configDotenv } from "dotenv"
import path from "path"
configDotenv({ quiet: true })

const config = Object.freeze({
  appEnv: process.env.APP_ENV || "production",
  api: {
    protocol: process.env.API_PROTOCOL,
    host: process.env.API_HOST,
    port: process.env.API_PORT,
    version: process.env.API_VERSION,
    get baseUrl() {
      let url = `${this.protocol}://${this.host}`
      if (this.port && ![80, 443].includes(this.port)) {
        url += `:${this.port}`
      }
      url += `/api/${this.version}`
      return url
    },
  },
  db: {
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    name: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(",") || [],
    // methods: process.env.CORS_METHODS?.split(",") || ["GET", "POST", "PUT", "DELETE"],
  },
  docs: {
    outputFile: path.join(import.meta.dirname, "../docs/api_v1_docs.json"),
  },
})
export default config
