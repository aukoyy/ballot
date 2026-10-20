import { createContext, useContext } from 'react';
import { Result } from '../../models/Result';

export interface ActivePollContextValues {
  initiateNewActivePoll: (pollId: string) => void;
  currentQuestion: number;
  setActivePollId: (pollId: string) => void;
  addRespondent: (respondentName: string) => void;
  respondents: string[];
}

const defaultContext = <T>() => {
  return {} as T;
};

export const ActivePollContext = createContext<ActivePollContextValues>(
  defaultContext()
);
export const useActivePoll = () => useContext(ActivePollContext);
