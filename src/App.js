import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Auth from './utils/auth';
import Login from './UI/Login';
import './styles/App.scss';
import Register from './UI/Register';
import Home from './UI/Home';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Auth.authenticate() === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);

class App extends Component {
  render() {
    return (
      <div className="App">
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </div>
      </Router>
      </div>
    );
  }
}

export default App;
