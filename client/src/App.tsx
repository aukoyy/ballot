import React from 'react';
import './App.css';
import { Routes } from './routes/Routes';
import { AuthContext } from './api/auth/AuthContext';
import { CreateAuthHook } from './api/auth/AuthHook';
import { ActivePollContext } from './api/auth/ActivePollContext';
import { CreateActivePollHook } from './api/auth/ActivePollHook';

const App: React.FC = () => {
  return (
    <div className="App">
      <AuthContext.Provider value={CreateAuthHook()}>
        <ActivePollContext.Provider value={CreateActivePollHook()}>
          <Routes />
        </ActivePollContext.Provider>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
