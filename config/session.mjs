import session from "express-session"
import { sequelize } from "./db.mjs"
import createStore from "connect-session-sequelize"
import config from "./default.mjs"

const SequelizeStore = createStore(session.Store)
const SESSION_MAX_AGE = 24 * 3600 * 1000 //1 day
const sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 24 * 3600 * 1000,
  expiration: SESSION_MAX_AGE,
})

export default session({
  secret: config.session.secret,
  store: sessionStore,
  rolling: true,
  cookie: {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    sameSite: "strict",
    secure: config.api.protocol === "https",
  },
  resave: false,
  saveUninitialized: false,
})

export { sessionStore }
