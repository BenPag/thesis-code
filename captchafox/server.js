const express = require("express")
const bodyParser = require("body-parser")
const captchafox = require("@captchafox/node")
const fs = require("fs")

// https://docs.captchafox.com/automated-testing
const apiSecret = "ok_11111111000000001111111100000000"
const port = 3000
const app = express()

app.use(bodyParser.text());
app.use("/", express.static("public"))

app.post("/loadTestImg", async (req, res) => {
	try {
		const token = req.body
		const data = await captchafox.verify(apiSecret, token)
		if (data.success) {
			const img = fs.readFileSync("test_image.jpg")
			return res.send(img.toString("base64"))
		}
	} catch {
		return res.sendStatus(500)
	}
	
	return res.sendStatus(403)
})

app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
})