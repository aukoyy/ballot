import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes } from './routes/Routes';

const fetchHey = async (setState: (state: string) => void) => {
  const result = await fetch('http://localhost:8080/hey').then(res =>
    res.json()
  );
  console.log(result);
  setState(result.hey);
};

const App: React.FC = () => {
  const [state, setstate] = useState<string>('Loading...');

  useEffect(() => {
    fetchHey(setstate);
  }, []);

  return (
    <div className="App">
      <Routes />
    </div>
  );
};

export default App;