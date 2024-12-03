const express = require("express")
const cookies = require("cookies").express
const path = require("path")
const fs = require("fs")
const cfg = require("./config.js")
const utils = require("./utils.js")

const app = express()
app.use(cookies(cfg.cookies.signingKeys))
app.use("/", express.static("public"))

// create middleware to ensure that user is a human
app.use("/images", (req, res, next) => {
  if (utils.isSmallSizeImg(req)) return next()
  if (utils.hasValidUserCookie(req)) return next()
  return res.sendStatus(401)

// then serve static images folder, now proteced
}, express.static("images"))

app.put("/verifyCaptcha", async (req, res) => {
  const { token } = req.query
  if (!token || !(await utils.verifyToken(token))) 
    return res.sendStatus(400)
  
  utils.setUserCookie(req, res)
  return res.sendStatus(200)
})

app.listen(cfg.port, () => {
    console.log(`Server listen on port ${cfg.port}`)
})