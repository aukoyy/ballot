import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Poll } from '../../models/Poll';
import { useAuth } from '../../api/auth/AuthContext';
import { PollCard } from './cards/PollCard';
import { RouteMap } from '../RouteMap';
import { backendAddress } from '../../config';
import { useActivePoll } from '../../api/auth/ActivePollContext';

enum ErrorMessage {
  USER_NOT_FOUND = 'User not found. Are you sure you are logged in?',
  SERVER_ERROR = 'There was an error connecting to the server',
}

interface ManagePollsComponentRouterProps {}

interface ManagePollsComponentOwnProps {}

type Props = RouteComponentProps<ManagePollsComponentRouterProps> &
  ManagePollsComponentOwnProps;

const ManagePolls = (props: Props) => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [archivedPolls, setArchivedPolls] = useState<Poll[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { initiateNewActivePoll } = useActivePoll();

  useEffect(() => {
    if (user) {
      const userId = user.id;
      try {
        const fetchPolls = async () => {
          const result = await fetch(
            `${backendAddress}/api/polls/user/${userId}`,
            {
              method: 'GET',
            }
          );
          result
            .json()
            .then(res => {
              setPolls(res.filter((poll: Poll) => !poll.archived));
              setArchivedPolls(res.filter((poll: Poll) => poll.archived));
            })
            .catch(err =>
              setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`)
            );
        };
        fetchPolls();
        setErrorMessage('');
      } catch (err) {
        setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
      }
    } else {
      setErrorMessage(`${ErrorMessage.USER_NOT_FOUND}`);
    }
  }, [user]);

  const renderPolls = () => {
    if (polls.length > 0) {
      return (
        <div>
          {polls.map(poll => {
            return (
              <PollCard
                key={poll.id}
                poll={poll}
                archivePoll={archivePoll}
                updatePoll={updatePoll}
                deletePoll={deletePoll}
                conductPoll={conductPoll}
                showResults={showResults}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <p className="font-semibold text-gray-600">
          You don't have any polls yet. Click the New Poll button to start!
        </p>
      );
    }
  };

  const renderArchivedPolls = () => {
    const userHasArchivedPolls = archivedPolls.length > 0;
    if (userHasArchivedPolls) {
      return (
        <div>
          <h1 className="text-4xl border-b-2">Archived Polls</h1>
          {archivedPolls.map(poll => {
            return (
              <PollCard
                key={poll.id}
                poll={poll}
                archived={true}
                archivePoll={archivePoll}
                updatePoll={updatePoll}
                deletePoll={deletePoll}
                conductPoll={conductPoll}
                showResults={showResults}
              />
            );
          })}
        </div>
      );
    }
  };

  const archivePoll = async (pollId: string) => {
    try {
      await fetch(`${backendAddress}/api/polls/archive/${pollId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => console.log(err));
      const archivedPoll = polls.find(poll => poll.id === pollId);
      if (archivedPoll) {
        setArchivedPolls([...archivedPolls, archivedPoll]);
        setPolls(polls.filter(poll => poll.id !== pollId));
      }
    } catch (err) {
      setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
    }
  };

  const updatePoll = (pollId: string) => {
    props.history.push(RouteMap.manage.edit.createPath(pollId));
  };

  const deletePoll = async (pollId: string) => {
    try {
      await fetch(`${backendAddress}/api/polls/${pollId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => console.log(err));
      const filteredPolls = polls.filter(poll => {
        return poll.id !== pollId;
      });
      setPolls(filteredPolls);
    } catch (err) {
      setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
    }
  };

  const conductPoll = (pollId: string) => {
    initiateNewActivePoll(pollId);
    props.history.push(RouteMap.conduct.createPath(pollId));
  };

  const showResults = (pollId: string) => {
    props.history.push(RouteMap.results.createPath(pollId));
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="mx-3 w-full sm:max-w-3xl p-4">
        <h1 className="text-4xl border-b-2">Your Polls</h1>
        <p className="font-bold text-red-500 mt-2">{errorMessage}</p>
        <div className="my-4">{renderPolls()}</div>

        <div className="mb-4 mt-16">{renderArchivedPolls()}</div>
      </div>
    </div>
  );
};

export const ManagePollsComponent = withRouter(ManagePolls);
