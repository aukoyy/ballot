import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { ChangeEvent } from 'react';
import { backendAddress } from '../../config';
import { RouteMap } from '../RouteMap';
import { useActivePoll } from '../../api/auth/ActivePollContext';

interface HomeProps {}

type Props = RouteComponentProps<{}> & HomeProps;

enum ErrorMessage {
  POLL_NOT_FOUND = 'Poll not found',
  SERVER_ERROR = 'There was an error connecting to the server',
}

const Home = (props: Props) => {
  const [pin, setPin] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { addRespondent } = useActivePoll();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const fetchPoll = async () => {
        const result = await fetch(`${backendAddress}/api/polls/pin/${pin}`, {
          method: 'GET',
        });
        result
          .json()
          .then(res => {
            if (!res.active) {
              // TODO: remove !
              addRespondent(name);
              props.history.push(RouteMap.vote.createPath(res.id, name));
            }
          })
          .catch(err =>
            setErrorMessage(`${ErrorMessage.POLL_NOT_FOUND}: ${err}`)
          );
      };
      fetchPoll();
    } catch (err) {
      setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
    }
  };

  return (
    <div className="h-screen">
      <div className="mt-48 mx-3 sm:mx-auto sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="pin"
            >
              Join a Poll!
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="pin"
              placeholder="Poll Pin"
              value={pin}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPin(e.target.value)
              }
            />
          </div>
          <div className="mb-4 mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Enter your desired name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>

          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            ENTER
          </button>
        </form>
        {errorMessage && (
          <p className="mt-8 text-red-700 font-semibold">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export const HomeComponent = withRouter(Home);
