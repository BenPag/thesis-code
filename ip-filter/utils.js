const captcha = require("@captchafox/node")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const cfg = require("./config.js")

function getHash(data) {
  const hash = crypto.createHash("sha256")
  hash.update(data)
  return hash.digest("hex")
}

function passedIpFilter(req) {
  const allowList = fs.readFileSync(cfg.allowListPath, 'utf8')
  // https://github.com/expressjs/express/issues/3030
  const ip = req.ip?.replace("::ffff:", "")
  return ip && allowList.includes(ip)
}

async function verifyToken(token) {  
  try {
    const data = await captcha.verify(cfg.apiSecret, token)
    return data?.success || false
  } catch {
    return false
  }
}

function getCookieData(req) {
  return getHash([req.ip, req.get("user-agent")].join())
}

function hasValidUserCookie(req) {
  const c = req.cookies.get(cfg.cookies.name, { signed: true })
  return c && c === getCookieData(req)
}

function setUserCookie(req, res) {
  const data = getCookieData(req)
  const { maxAge, name } = cfg.cookies
  res.cookies.set(name, data, { signed: true, maxAge })
}

function searchDir(root, dirname) {
  const files = fs.readdirSync(root)

  // search through the files
  for (const file of files) {
    const filePath = path.join(root, file)
  
  if (file === dirname) return filePath
  
    if (fs.statSync(filePath).isDirectory()) {
      const res = searchDir(filePath, dirname)
      if (res) return res 
    }
  }
  return false
}

function getDziPath(id, tileSrc) {
  const jsonPath = path.join(".", id, "imageData-v1.3.json")
  if (!fs.existsSync(jsonPath)) return false
  
  const imgData = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
  const imgStackData = Object.values(imgData.imageStack)
  
  const tiles = imgStackData.map((v) => v.images.map((i) => i.tiles)).flat()
  const tile = tiles.find((t) => t.src === `${tileSrc}.dzi`)
  
  const dziPath = path.join(".", id, tile.path, tile.src)
  if (!fs.existsSync(dziPath)) return false
  return dziPath
}

module.exports = { 
  passedIpFilter, verifyToken, hasValidUserCookie, 
  setUserCookie, searchDir, getDziPath
}