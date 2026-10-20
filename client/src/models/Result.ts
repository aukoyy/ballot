import { AnswerSet } from './AnswerSet';

export interface Result {
  pollId: string;
  respondents: string[];
  answerSets: AnswerSet[];
}
