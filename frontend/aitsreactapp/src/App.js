import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Login from './login';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/login" element ={<Login />} />

      </Routes>
    </Router>
  );
const [issues, setIssues] = useState([]);
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  axios.get('http://localhost:8000/api/issues/')
  .then(response => setIssues(response.data))
  .catch(error => console.log(error));
}, []);

  return (
    <><div>
      {!isLoggedIn ?(
        <Login onLogin = {() => setIsLoggedIn(true)} /> // Pass callback to update state
      ):(
        <>
        <h1>issues  from django</h1>
      <ul>
        {issues.map(Issue =>(<li key={Issue.id}> {Issue.title}: {Issue.description}</li>))}
      </ul>

        </>
      )}
      
    </div>



    <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div></>
  );
}

export default App;
