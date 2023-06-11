require("dotenv").config()
const express = require("express")
const path = require("path")

const app = express()

const { Permissions, Group } = require("./permissions.js")
const permissions = new Permissions(path.join(__dirname, "permissions.json"))

const { SpotifyWrapper } = require("./spotify.js")
const spotify = new SpotifyWrapper()

const { Queue } = require("./queue.js")
const queue = new Queue()

const { Player } = require("./player.js")
const player = new Player(spotify, queue)
player.tick()

const { Connection } = require("./connection.js")
const connection = new Connection(app, player, spotify, queue, permissions)
const http = connection.get()
connection.open()
connection.tick()

function onServerStarted() {
	permissions.loadFromFile()
}

function onSpotifyReady() {
	spotify.searchPlaybackDevice()
}

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {

	connection.lookupMac(req.ip, (mac, ip) => {

		let isAdmin = mac === null //process.env.ADMIN_MAC
		if (req.query.code) {
			spotify.requestAccessToken(req.query.code, onSpotifyReady)
			res.redirect("/")
			return
		}

		res.render(path.join(__dirname, 'public', 'client.ejs'), { isAdmin: isAdmin, spotifyURL: spotify.getLoginURL() })
	})
})

http.listen(process.env.PORT, () => {
	onServerStarted()
	console.log(`Server läuft auf http://localhost:${process.env.PORT}`)
})