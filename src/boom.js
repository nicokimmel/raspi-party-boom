require("dotenv").config()
const express = require("express")
const path = require("path")

const app = express()

const { SpotifyWrapper } = require("./spotify.js")
const spotify = new SpotifyWrapper()

const { Player } = require("./player.js")
const player = new Player(spotify)

const { Queue } = require("./queue.js")
const queue = new Queue()

const { Connection } = require("./connection.js")
const connection = new Connection(app, player, spotify, queue)
const http = connection.get()
connection.open()
connection.tick()

function init() {

}

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {

	connection.lookupMac(req.ip, (mac, ip) => {

		let isAdmin = toString(mac) == toString(process.env.ADMIN_MAC)

		if (req.query.code) {
			spotify.setAccessToken(req.query.code)
			res.redirect("/")
			return
		}

		res.render(path.join(__dirname, 'public', 'client.ejs'), { isAdmin: isAdmin, spotifyURL: spotify.getLoginURL() })
	});
})

http.listen(process.env.PORT, () => {
	init()
	console.log(`Server läuft auf http://localhost:${process.env.PORT}`)
})