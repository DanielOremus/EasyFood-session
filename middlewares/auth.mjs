import { deserializeUser } from "../utils/authHelpers.mjs"
import UserService from "../api/v1/services/UserService.mjs"

function getAuthMiddleware(func) {
  return async (req, res, next) => {
    try {
      const user = await deserializeUser(UserService)(req.session.userId)
      req.user = user

      if (func && !func(req)) return res.status(403).json({ success: false, msg: "Forbidden" })

      next()
    } catch (error) {
      res.status(401).json({ success: false, msg: error.message })
    }
  }
}

export const requireAuth = getAuthMiddleware()
export const requireAdmin = getAuthMiddleware((req) => req.user?.isAdmin)
export const ownerChecker = (fieldSource, fieldName) =>
  getAuthMiddleware((req) => {
    const userId = req[fieldSource][fieldName]
    return req.user?.id == userId
  })
export const ensureAccOwnerOrAdmin = (fieldSource, fieldName) =>
  getAuthMiddleware((req) => {
    const userId = req[fieldSource][fieldName]
    return req.user?.isAdmin || req.user?.id == userId
  })
