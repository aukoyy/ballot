import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
const port = 8080;

const configureAccessControl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Expose-Headers', 'authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next();
};

app.use(configureAccessControl);
dotenv.config();

// CONNECT DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log('connected to db!')
);

// MIDDLEWARE
app.use(express.json());

// IMPORT ROUTES
const authRoute = require('./auth/authenticate');
const pollsRoute = require('./routes/Polls');
const activePollsRoute = require('./routes/ActivePolls');

// ROUTES
app.use('/api/users', authRoute);
app.use('/api/polls', pollsRoute);
app.use('/api/active-polls', activePollsRoute);

const hey = 'Hello from ballot-backend';
app.get('/hey', (req: Request, res: Response) => res.json({ hey }).send());

app.listen(port, () => console.log(`Listening on port ${port}!`));
