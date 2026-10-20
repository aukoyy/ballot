import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
import { QuestionCard } from './cards/QuestionCard';
import { Question } from '../../models/Question';
import { RouteMap } from '../RouteMap';
import { useAuth } from '../../api/auth/AuthContext';
import { backendAddress } from '../../config';
const uuidv4 = require('uuid/v4');

enum ErrorMessage {
  QUESTION_NOT_FOUND = 'Question not found',
  USER_NOT_FOUND = 'User not found. Are you sure you are logged in?',
  SERVER_ERROR = 'There was an error connecting to the server',
}

interface CreateComponentRouterProps {
  pollId: string;
}

interface CreateComponentOwnProps {}

type CreateComponentProps = RouteComponentProps<CreateComponentRouterProps> &
  CreateComponentOwnProps;

const EditPoll = (props: CreateComponentProps) => {
  const { user } = useAuth();
  const [pollTitle, setPollTitle] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<string>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newOption, setNewOption] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isCreatingNewPoll = props.match.params.pollId === 'new';
  const pollId = props.match.params.pollId;

  useEffect(() => {
    if (!isCreatingNewPoll) {
      try {
        const fetchPoll = async () => {
          const result = await fetch(`${backendAddress}/api/polls/${pollId}`, {
            method: 'GET',
          });
          result
            .json()
            .then(res => {
              setQuestions(res.questions);
              setPollTitle(res.title);
            })
            .catch(err =>
              setErrorMessage(`${ErrorMessage.QUESTION_NOT_FOUND}: ${err}`)
            );
        };
        fetchPoll();
      } catch (err) {
        setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
      }
    }
  }, [isCreatingNewPoll, pollId]);

  const handleOnPollSaveClicked = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (isCreatingNewPoll) {
      postNewPoll();
    } else {
      patchPoll();
    }
  };

  const postNewPoll = async () => {
    try {
      if (user) {
        const result = await fetch(`${backendAddress}/api/polls/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            active: false,
            userId: user.id,
            title: pollTitle,
            questions,
          }),
        }).catch(err => console.log(err));
        if (result) {
          setIsLoading(false);
        }
        props.history.push(RouteMap.manage.path);
      } else {
        setErrorMessage(`${ErrorMessage.USER_NOT_FOUND}`);
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
    }
  };

  const patchPoll = async () => {
    const pollId = props.match.params.pollId;
    try {
      const result = await fetch(`${backendAddress}/api/polls/${pollId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pollTitle,
          questions,
        }),
      }).catch(err => console.log(err));
      if (result) {
        setIsLoading(false);
      }
      props.history.push(RouteMap.manage.path);
    } catch (err) {
      setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
      setIsLoading(false);
    }
  };

  const handleOnQuestionSubmitted = async (e: FormEvent) => {
    e.preventDefault();
    if (newQuestion && newQuestion.length > 0) {
      setQuestions([
        ...questions,
        { question: newQuestion, options, id: uuidv4() },
      ]);
      setNewQuestion('');
      setOptions([]);
      document.getElementById('new-question-form')!.style.border = '';
    }
  };

  const updateQuestion = (questionId: string) => {
    removeQuestion(questionId);
    const question = questions.find(question => {
      return question.id === questionId;
    });
    if (question) {
      document.getElementById('new-question-form')!.style.border =
        '#3182ce solid 5px';
      setNewQuestion(question.question);
      setOptions(question.options);
    } else {
      setErrorMessage(ErrorMessage.QUESTION_NOT_FOUND);
    }
  };

  const removeOption = (option: string) => {
    return setOptions(
      options.filter(optionToBeRemoved => {
        return option !== optionToBeRemoved;
      })
    );
  };

  const removeQuestion = (questionId: string) => {
    const filteredQuestions = questions.filter(questionToBeRemoved => {
      return questionToBeRemoved.id !== questionId;
    });
    setQuestions(filteredQuestions);
  };

  const renderQuestions = () => {
    return (
      <div>
        {questions.map(question => (
          <QuestionCard
            key={question.id}
            question={question}
            removeQuestion={removeQuestion}
            updateQuestion={updateQuestion}
          />
        ))}
      </div>
    );
  };

  const renderCreateQuestionForm = () => {
    return (
      <form
        onSubmit={handleOnQuestionSubmitted}
        className="shadow rounded-lg p-4"
        id="new-question-form"
      >
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-4"
            htmlFor="question"
          >
            Question
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="question"
            placeholder="Question"
            value={newQuestion}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewQuestion(e.target.value)
            }
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-4"
            htmlFor="options"
          >
            Options
          </label>
          <div className="flex flex-wrap">
            {options.map(option => (
              <span className="flex items-center bg-blue-200 rounded-full px-5 py-2 text-sm font-semibold m-2">
                <p className="mr-8 text-lg">{option}</p>
                <i
                  onClick={() => {
                    removeOption(option);
                  }}
                  className="far fa-times-circle fa-2x text-red-300 hover:text-red-400 cursor-pointer"
                />
              </span>
            ))}
          </div>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="options"
            placeholder="Option"
            value={newOption}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewOption(e.target.value)
            }
          />
          <button
            type="button"
            className="my-2 p-2 px-5 hover:bg-gray-100 shadow rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              if (newOption.length > 0) {
                setOptions([...options, newOption]);
                setNewOption('');
              }
            }}
          >
            Add option
          </button>
        </div>

        <button
          className="py-2 mt-4 w-full bg-blue-500 hover:bg-blue-600 font-bold text-white rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add question
        </button>
      </form>
    );
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="mx-3 w-full sm:max-w-3xl p-4">
        <div className="flex justify-between items-center">
          {isCreatingNewPoll && (
            <h1 className="text-4xl">Create a new poll!</h1>
          )}
          {!isCreatingNewPoll && <h1 className="text-4xl">Update your poll</h1>}

          <div>
            <button
              onClick={() => props.history.goBack()}
              className="py-2 px-8 w-auto bg-gray-200 hover:bg-gray-400 font-bold text-gray-700 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Cancel
            </button>
            {questions.length > 0 && (
              <button
                onClick={handleOnPollSaveClicked}
                className="py-2 px-8 w-auto ml-4 bg-green-500 hover:bg-green-600 font-bold text-white rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isLoading ? 'Loading...' : 'Save Poll'}
              </button>
            )}
          </div>
        </div>

        <p className="text-red-500 font-bold">{errorMessage}</p>

        <div>
          <input
            className="w-full py-4 px-2 mt-8 border-b-4 focus:border-blue-400 text-2xl focus:outline-none"
            type="text"
            value={pollTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPollTitle(e.target.value)
            }
            placeholder="Poll title"
          />
        </div>

        <div className="my-4">{renderQuestions()}</div>

        {questions.length > 0 && <hr className="mt-8" />}

        <div className="my-4">{renderCreateQuestionForm()}</div>
      </div>
    </div>
  );
};

export const EditPollComponent = withRouter(EditPoll);
