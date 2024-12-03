const express = require("express")
const cookies = require("cookies").express
const path = require("path")
const fs = require("fs")
const cfg = require("./config.js")
const utils = require("./utils.js")

const app = express()

app.use(cookies(cfg.cookies.signingKeys))
app.use("/", express.static("public"))

// middleware to ensure that user is a human
app.use("/dzi", (req, res, next) => {
  if (utils.passedIpFilter(req)) return next()
  if (utils.hasValidUserCookie(req)) return next()
  return res.sendStatus(401)
})

app.put("/verifyCaptcha", async (req, res) => {
  const { token } = req.query
  if (!token || !(await utils.verifyToken(token))) 
    return res.sendStatus(400)
  
  utils.setUserCookie(req, res)
  return res.sendStatus(200)
})

app.get("/dzi/:id/:tileSrc/*.jpg", (req, res) => {
  const { id, tileSrc } = req.params
  const rootDir = utils.searchDir(path.join(".", id), tileSrc)
  const imgPath = path.join(rootDir, ...req.url.split("/").slice(4))
  
  if (!fs.existsSync(imgPath)) return res.sendStatus(404)
  return res.sendFile(imgPath, { root: path.join(__dirname) })
})

app.get("/dzi/:id/:tileSrc", async (req, res) => {
  const { id, tileSrc } = req.params
  
  const dziPath = utils.getDziPath(id, tileSrc)
  if (!dziPath) return res.sendStatus(404)
  
  return res.sendFile(dziPath, { root: path.join(__dirname) })
})

app.listen(cfg.port, () => {
    console.log(`Server listen on port ${cfg.port}`)
})