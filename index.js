const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

//the service port. in production the application is statically hosted by the service on the same port.
//the service port may be set on the cmd line
const port = process.argv.length > 2 ? process.argv[2] : 3000;

//json body parsing using built in middleware
app.use(express.json());

//use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

//serve up the application's static content
app.use(express.static('public'));

//router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if(await DB.getUser(req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await DB.createUser(req.body.email, req.body.password);

        //set the cookie
        setAuthCookie(res, user.token);

        res.send({
            id: user._id,
        });
    }
});

//GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.email);
    if(user) {
        if(await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({ id: user._id });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

//delete auth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

//GetUser return info about a user
apiRouter.get('/user/:email', async (req, res) => {
    const user = await DB.getUser(req,params.email);
    if(user) {
        const token = req?.cookies.token;
        res.send({ email: user.email, authenticated: token === user.token });
        return;
    }
    res.status(404).send({ msg: 'Unknown' });
});

//secureApirRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if(user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

//GetScores
secureApiRouter.get('/scores', async (req, res) => {
    const scores = await DB.getHighScores();
    res.send(scores);
});

//SubmitScore
secureApiRouter.post('/score', async(req, res) => {
    await DB.addScore(req.body);
    const scores = await DB.getHighScores();
    res.send(scores);
});

//default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

//return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

//setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});