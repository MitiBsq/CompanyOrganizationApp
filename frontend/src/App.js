import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import GroupDetails from './components/groups/GroupDetails';
import MainGroups from './components/groups/MainGroups';
import MainPersons from './components/persons/MainPersons';
import Navbar from './components/Navbar';
import ForgotPassword from './components/users/ForgotPass';
import LogIn from './components/users/LogIn';
import SignIn from './components/users/SignIn';
import { UserContext } from './components/users/UserContext';
import { isLoggedIn } from './components/users/isLoggedIn';

function App() {
  //For keeping track if the user is logged or not 
  const [loggedIn, setLoggedIn] = useState(false);
  //For the welcome message(just after the user logged)
  const [welcome, setWelcome] = useState(false);

  //The provider value used with useContext
  const providerValue = useMemo(() => ({ loggedIn, setLoggedIn }), [loggedIn, setLoggedIn]);

  //to check if the user just logged or not 
  useEffect(() => {
    if (loggedIn) {
      setWelcome(true);
    }
  }, [loggedIn]);

  //To check if the user has been logged in in the last 12 hours
  useEffect(() => {
    if (localStorage.jwtToken) {
      (async () => {
        const validToken = await isLoggedIn();
        validToken === true ? setLoggedIn(true) : setLoggedIn(false);
      })();
    }
  }, []);

  return (
    <div>
      <Router>
        <UserContext.Provider value={providerValue}>
          {loggedIn && <Navbar />}
          <Routes>
            <Route path='/' element={loggedIn ? <Navigate to='/home' /> : <Navigate to='/logIn' />}></Route>
            <Route path='/home' element={loggedIn ? <Home welcome={welcome} setWelcome={() => setWelcome(false)} /> : <Navigate to='/logIn' />}></Route>
            <Route path='/logIn' element={loggedIn ? <Navigate to='/home' /> : <LogIn />}></Route>
            <Route path='/SignIn' element={loggedIn ? <Navigate to='/home' /> : <SignIn />}></Route>
            <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
            <Route path='/MainGroups' element={loggedIn ? <MainGroups /> : <Navigate to='/logIn' />}></Route>
            <Route path='/MainPersons' element={loggedIn ? <MainPersons /> : <Navigate to='/logIn' />}></Route>
            <Route path='/group/:id' element={loggedIn ? <GroupDetails /> : <Navigate to='/logIn' />}></Route>
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;