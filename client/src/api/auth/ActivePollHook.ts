import { ActivePollContextValues } from './ActivePollContext';
import { Result } from '../../models/Result';
import { useState } from 'react';
import { backendAddress } from '../../config';
import { AnswerSet } from '../../models/AnswerSet';

export const CreateActivePollHook = (): ActivePollContextValues => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [activePollId, setActivePollId] = useState<string>('');
  const [respondents, setRespondents] = useState<string[]>([]);
  const [answerSets, setAnswerSets] = useState<AnswerSet[]>([]);

  const initiateNewActivePoll = async (pollId: string) => {
    // fetch for new activepoll and set the activepollid
    try {
      const result = await fetch(`${backendAddress}/api/active-polls/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId,
        }),
      });

      result.json().then(res => {
        setActivePollId(res._id);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addRespondent = (newRespondent: string) => {
    setRespondents([...respondents, newRespondent]);
    updateActivePollService();
  };

  const updateActivePollService = async () => {
    console.log('updateActivePollService function fired');
    console.log(respondents);

    try {
      await fetch(`${backendAddress}/api/active-polls/${activePollId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          respondents,
          answerSets,
          currentQuestion,
        }),
      }).catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  return {
    initiateNewActivePoll,
    currentQuestion,
    setActivePollId,
    addRespondent,
    respondents,
  };
};
