const router = require('express').Router();
import { Request, Response } from 'express';
const ActivePoll = require('../schemas/ActivePoll');
import v4 = require('uuid/v4');

router.post('/new', async (req: Request, res: Response) => {
  const activePollAlreadyExistsOnPoll = await ActivePoll.findOne({
    pollId: req.body.pollId,
  });

  if (activePollAlreadyExistsOnPoll) {
    res.status(400).send({ err: 'Poll is already conducting' });
    return;
  }

  const newActivePoll = new ActivePoll({
    pollId: req.body.pollId,
    currentQuestion: 0,
  });

  try {
    await newActivePoll.save();
    res.status(200).send(newActivePoll);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  console.log('Patching active poll');
  const filter = { id: req.params._id };
  const update = {
    respondents: req.body.respondents,
    answerSets: req.body.answerSets,
    currentQuestion: req.body.currentQuestion,
  };

  // having the findOneAndUpdate return straight to const
  // made the change lag with one turn
  await ActivePoll.findOneAndUpdate(filter, update);
  const activePoll = await ActivePoll.findOne(filter);
  res.status(200).send(activePoll);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const activePollId = req.params.id;
  const activePoll = await ActivePoll.findOneAndDelete(
    { _id: activePollId },
    function(err) {
      err ? console.log(err) : console.log('successful deletion');
    }
  );
  res
    .status(200)
    .send(`Successfully deleted activePoll with id: ${activePollId}`);
});

module.exports = router;
