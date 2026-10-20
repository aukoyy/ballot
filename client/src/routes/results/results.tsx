import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface Props {}

const Results = (props: Props) => {
  return <h1>test</h1>;
};

export const ResultsComponent = withRouter(Results);
