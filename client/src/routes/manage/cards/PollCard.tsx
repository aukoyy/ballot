import * as React from 'react';
import { Poll } from '../../../models/Poll';
import { useState } from 'react';
import classNames from 'classnames';

interface PollCardProps {
  poll: Poll;
  archived?: boolean;
  archivePoll: (pollId: string) => void;
  updatePoll: (pollId: string) => void;
  deletePoll: (pollId: string) => void;
  conductPoll: (pollId: string) => void;
  showResults: (pollId: string) => void;
}

export const PollCard = (props: PollCardProps) => {
  const { poll, archived } = props;
  const [shouldShowDeletionDialog, setShouldShowDeletionDialog] = useState<
    boolean
  >(false);
  const [shouldShowArchiveDialog, setShouldShowArchiveDialog] = useState<
    boolean
  >(false);

  const archivePoll = () => {
    props.archivePoll(poll.id);
  };

  const updatePoll = (event: React.MouseEvent<HTMLElement>) => {
    props.updatePoll(poll.id);
  };

  const conductPoll = (event: React.MouseEvent<HTMLElement>) => {
    props.conductPoll(poll.id);
  };

  const deletePoll = () => {
    props.deletePoll(poll.id);
  };

  const showResults = () => {
    props.showResults(poll.id);
  };

  const cardClassName = classNames('mt-8 p-4 shadow rounded-t-lg', {
    'rounded-b-lg': !shouldShowDeletionDialog && !shouldShowArchiveDialog,
  });

  return (
    <div>
      <div className={cardClassName}>
        <div className="flex justify-between">
          <h2
            className="text-2xl text-gray-800 cursor-pointer"
            onClick={showResults}
          >
            {poll.title}
          </h2>
          {!archived && (
            <div className="flex">
              <i
                title="Edit this poll"
                onClick={updatePoll}
                className="fas fa-pen fa-lg opacity-50 hover:opacity-75 cursor-pointer"
              />
              <i
                title="Archive this poll"
                onClick={() => {
                  setShouldShowArchiveDialog(true);
                  setShouldShowDeletionDialog(false);
                }}
                className="fas fa-archive ml-8 fa-lg opacity-50 hover:opacity-75 cursor-pointer"
              />
              <i
                title="Delete this poll"
                onClick={() => {
                  setShouldShowDeletionDialog(true);
                  setShouldShowArchiveDialog(false);
                }}
                className="fas fa-trash ml-8 fa-lg opacity-50 hover:opacity-75 cursor-pointer"
              />
              <i
                title="Conduct this poll"
                onClick={conductPoll}
                className="fas fa-play ml-8 fa-lg opacity-50 hover:opacity-75 color-orange-500 cursor-pointer"
              />
            </div>
          )}
        </div>
        <p className="text-gray-600">{poll.questions.length} questions</p>
      </div>
      {shouldShowDeletionDialog && (
        <div className="bg-red-500 rounded-b-lg px-4 py-2 flex justify-between">
          <p className="text-white font-bold">
            Are you sure you want to delete this poll?
          </p>
          <div className="text-white font-bold">
            <button onClick={() => setShouldShowDeletionDialog(false)}>
              Cancel
            </button>
            <button
              onClick={deletePoll}
              className="ml-4 px-2 rounded border-white border-2"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {shouldShowArchiveDialog && (
        <div className="bg-yellow-600 rounded-b-lg px-4 py-2 flex justify-between">
          <p className="text-white font-bold">
            Archive this poll? (this makes the poll "read-only")
          </p>
          <div className="text-white font-bold">
            <button onClick={() => setShouldShowArchiveDialog(false)}>
              Cancel
            </button>
            <button
              onClick={archivePoll}
              className="ml-4 px-2 rounded border-white border-2"
            >
              Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
