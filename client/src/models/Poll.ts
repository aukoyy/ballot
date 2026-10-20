import { Question } from './Question';
import { Result } from './Result';

export interface Poll {
  id: string;
  pollPin: number;
  active: boolean;
  archived: boolean;
  title: string;
  questions: Question[];
  results: Result[];
}
