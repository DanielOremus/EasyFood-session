import config from "../config/default.mjs"

export const useErrorHandler = (app) => {
  // catch 404 and forward to error handler

  app.use((req, res, next) => {
    const err = new Error("Endpoint not found")
    err.status = 404

    next(err)
  })
  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    //   res.locals.message = err.message
    //   res.locals.error = req.app.get("env") === "development" ? err : {}

    // const resMsg = config.appEnv === "development" ? err : err.message
    // render the error page
    res.status(err.status || 500).json({ success: false, msg: err.message })
  })
}
