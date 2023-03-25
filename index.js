const express = require('express');
const app = express();
const DB = require('./database.js');

//the service port. in production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

//json body parsing using built in middleware
app.use(express.json());

//serve up the application's static content
app.use(express.static('public'));

//router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//GetScores
apiRouter.get('/scores', async (_req, res) => {
    const scores = await DB.getHighScores();
    res.send(scores);
});

//SubmitScore
apiRouter.post('/score', async(req, res) => {
    DB.addScore(req.body);
    const scores = await DB.getHighScores();
    res.send(scores);
});

//return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public'});
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});