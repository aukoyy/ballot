import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface Props {}

const Vote = (props: Props) => {
  return <h1>Test Vote</h1>;
};

export const VoteComponent = withRouter(Vote);
