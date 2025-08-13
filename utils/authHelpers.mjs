import bcrypt from "bcrypt"
import CustomError from "./CustomError.mjs"
import { debugLog } from "./logger.mjs"

export const comparePasswords = async (password, encrypted) => {
  return await bcrypt.compare(password, encrypted)
}
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export const deserializeUser = (UserService) => async (userId) => {
  try {
    if (!userId) throw new Error("No userId provided")
    return await UserService.getById(userId, { exclude: ["email", "password"] })
  } catch (error) {
    debugLog(error)
    throw new CustomError("Session is invalid or has expired", 401)
  }
}

export const serializeUser = (req, userId) => {
  req.session.userId = userId
}
