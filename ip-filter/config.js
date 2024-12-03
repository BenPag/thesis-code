module.exports = {
  port: 3000,
  cookies: {
	name: "UserValidation",
	signingKeys: ["random1", "random2"],
	maxAge: 1000 * 60 * 60 * 24, //24hrs
  },
  apiSecret: "ok_11111111000000001111111100000000",
  allowListPath: "./allowlist.txt",
}