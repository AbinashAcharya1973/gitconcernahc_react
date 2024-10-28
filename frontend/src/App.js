import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './UserContext';
import MainApp from './MainApp'; // Move context consumption here

function App() {
  return (
    <UserProvider>
      <Router>
      <MainApp />
      </Router>
    </UserProvider>
  );
}

export default App;
