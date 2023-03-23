const express = require('express');
const app = express();

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
apiRouter.get('scores', (_req, res) => {
    res.send(scores);
});

//SubmitScore
apiRouter.post('/score', (req, res) => {
    scores = updateScores(req.body, scores);
    res.send(scores);
});

//return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public'});
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

//updateScores considers a new score for inclusion in the high scores.
//the high scores are saved in memory and disappear whenever the service is restarted.
let scores = [];
function updateScores(newScore, scores) {
    let found = false;
    for(const[i, prevScore] of scores.entries()) {
        if(newScore.score > prevScore.score) {
            score.splice(i, 0, newScore);
            found = true;
            break;
        }
    }

    if(!found) {
        scores.push(newScore);
    }

    if(scores.length > 10) {
        scores.length = 10;
    }

    return scores;
}