import config from "../config/default.mjs"

export const debugLog = (msg) => {
  if (config.appEnv !== "production") {
    console.log(msg)
  }
}
