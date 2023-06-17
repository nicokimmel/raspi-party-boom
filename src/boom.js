require("dotenv").config()
const express = require("express")
const path = require("path")

const app = express()

const { Permissions, Group } = require("./permissions.js")
const permissions = new Permissions(path.join(__dirname, "./permissions.json"))

const { SpotifyWrapper } = require("./spotify.js")
const spotify = new SpotifyWrapper()

const { Queue } = require("./queue.js")
const queue = new Queue()

const { Player } = require("./player.js")
const player = new Player(spotify, queue)
player.tick()

const { Connection } = require("./connection.js")
const connection = new Connection(app, player, spotify, queue, permissions)
const https = connection.get()
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
	connection.lookupMac(req.ip, (mac, address, ip) => {

		if (permissions.isEmpty()) {
			console.log("[CONNECTION] No permissions found, setting " + mac + " to admin")
			permissions.setGroup(mac, Group.ADMIN)
		}

		let isAdmin = permissions.getGroup(mac) === Group.ADMIN
		if (isAdmin && req.query.code) {
			spotify.requestAccessToken(req.query.code, onSpotifyReady)
			res.redirect("/")
			return
		}
		res.render(path.join(__dirname, 'public', 'client.ejs'), { isAdmin: isAdmin, spotifyURL: spotify.getLoginURL() })
	})
})

https.listen(process.env.PORT, () => {
	onServerStarted()
	console.log(`Server läuft auf https://localhost:${process.env.PORT}`)
})