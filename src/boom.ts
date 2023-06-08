import 'dotenv/config';
import express from "express";
import path from "path";

const app = express();

import { Connection } from "./connection";
const connection = new Connection(app);
const http = connection.get();
connection.open();

import { SpotifyWrapper } from "./spotify";

function init(): void {
	const spotify = new SpotifyWrapper();
	spotify.search("Never Gonna Give You Up", (song) => {
		console.log(song);
	});
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res): void => {
	const filePath = path.join(__dirname, 'public', 'client.html');
	res.sendFile(filePath);
});

http.listen(process.env.PORT!, (): void => {
	init();
	console.log(`Server läuft auf http://localhost:${process.env.PORT}`);
});