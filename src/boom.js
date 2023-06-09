require("dotenv").config()
const express = require("express")
const path = require("path")

const app = express()

const { SpotifyWrapper } = require("./spotify.js")
const spotify = new SpotifyWrapper()

const { Player } = require("./player.js")
const player = new Player()

const { Queue } = require("./queue.js")
const queue = new Queue()

const { Connection } = require("./connection.js")
const connection = new Connection(app, player, queue)
const http = connection.get()
connection.open()
connection.tick()

function init() {
	/*
	const spotify = new SpotifyWrapper()
	spotify.search("Never Gonna Give You Up", (song) => {
		console.log(song)
	})
	*/
	console.log(spotify.getLoginURL())
}

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	
	
	
	const filePath = path.join(__dirname, 'public', 'client.html')
	res.sendFile(filePath)

	if (req.query.code) {
		spotify.setAccessToken(req.query.code)
	}
})

http.listen(process.env.PORT, () => {
	init()
	console.log(`Server läuft auf http://localhost:${process.env.PORT}`)
})