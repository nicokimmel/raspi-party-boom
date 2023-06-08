import 'dotenv/config';
import express from "express";
import path from "path";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const app = express();
const port = 3000;

function init() {
	console.log(process.env.SPOTIFY_CLIENT_ID);
	const spotify = SpotifyApi.withClientCredentials(process.env.SPOTIFY_CLIENT_ID!, process.env.SPOTIFY_CLIENT_SECRET!);
	spotify.search("Flamingo", ["track"])
	.then((items) => {
		console.log(items.tracks.items[0]);
	})
    .catch((error) => {
     	console.log(error);
    });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	const filePath = path.join(__dirname, 'public', 'client.html');
	res.sendFile(filePath);
});

app.listen(port, () => {
	init();
	console.log(`Server läuft auf http://localhost:${port}`);
});