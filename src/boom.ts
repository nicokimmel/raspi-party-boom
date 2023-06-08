import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	const filePath = path.join(__dirname, 'public', 'client.html');
	res.sendFile(filePath);
});

app.listen(port, () => {
	console.log(`Server läuft auf http://localhost:${port}`);
});