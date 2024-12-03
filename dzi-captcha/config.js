module.exports = {
  port: 3000,
  cookies: {
    name: "UserValidation",
    signingKeys: ["randomKey1", "randomKey2"],
    maxAge: 1000 * 60 * 60 * 24, //24hrs
  },
  smallSizeRegex: /.*-(xs|s|m)?\.jpg$/,
  apiSecret: "ok_11111111000000001111111100000000",
}