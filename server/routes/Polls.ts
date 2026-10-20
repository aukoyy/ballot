const router = require('express').Router();
import { verify } from '../auth/verifyToken';
import { Request, Response } from 'express';
const Poll = require('../schemas/Poll');
import v4 = require('uuid/v4');

router.get('/:id', async (req: Request, res: Response) => {
  const poll = await Poll.findOne({ id: req.params.id });
  res.status(200).send(poll);
});

router.get('/pin/:pin', async (req: Request, res: Response) => {
  const poll = await Poll.findOne({ pollPin: req.params.pin });
  res.status(200).send(poll);
});

router.get('/user/:userId', async (req: Request, res: Response) => {
  const userPolls = await Poll.find({ userId: req.params.userId });
  res.status(200).send(userPolls);
});

router.post('/new', async (req: Request, res: Response) => {
  const newPoll = new Poll({
    id: v4(),
    userId: req.body.userId,
    pollPin: generate(6),
    active: req.body.active,
    archived: false,
    title: req.body.title,
    questions: req.body.questions,
  });

  try {
    await newPoll.save();
    res.status(200).send(newPoll);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/archive/:id', async (req: Request, res: Response) => {
  const filter = { id: req.params.id };
  const update = { archived: true };

  // having the findOneAndUpdate return straight to const
  // made the change lag with one turn
  await Poll.findOneAndUpdate(filter, update);
  const poll = await Poll.findOne(filter);
  res.status(200).send(poll);
});

router.patch('/:id', async (req: Request, res: Response) => {
  const filter = { id: req.params.id };
  const update = { title: req.body.title, questions: req.body.questions };

  // having the findOneAndUpdate return straight to const
  // made the change lag with one turn
  await Poll.findOneAndUpdate(filter, update);
  const poll = await Poll.findOne(filter);
  res.status(200).send(poll);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const pollId = req.params.id;
  const poll = await Poll.findOneAndDelete({ id: pollId }, function(err) {
    err ? console.log(err) : console.log('successful deletion');
  });
  res.status(200).send(`Successfully deleted poll with id: ${pollId}`);
});

function generate(n) {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  const result = ('' + number).substring(add);
  if (result.length < 6) {
    return generate(6);
  } else {
    return result;
  }
}

module.exports = router;
