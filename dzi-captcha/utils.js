const captcha = require("@captchafox/node")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const cfg = require("./config.js")

const getHash = (data) => {
  const hash = crypto.createHash("sha256")
  hash.update(data)
  return hash.digest("hex")
}

const getCookieData = (req) =>
  getHash([req.ip, req.get("user-agent")].join())

const hasValidUserCookie = (req) => {
  const c = req.cookies.get(cfg.cookies.name, { signed: true })
  return c && c === getCookieData(req)
}

const setUserCookie = (req, res) => {
  const data = getCookieData(req)
  const { maxAge, name } = cfg.cookies
  res.cookies.set(name, data, { signed: true, maxAge })
}

const isSmallSizeImg = (req) =>
  req.originalUrl.match(cfg.smallSizeRegex)

const verifyToken = async (token) => {  
  try {
    const data = await captcha.verify(cfg.apiSecret, token)
    return data?.success || false
  } catch {
    return false
  }
}

module.exports = { 
  verifyToken, hasValidUserCookie,
  setUserCookie, isSmallSizeImg
}