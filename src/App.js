import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect  } from 'react-router-dom';

import AuthContext from './components/context/authContext'
import Navigation from './components/Navigation/Navigation'
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

import 'tachyons';

class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId })
  }

  logout = () => {
    this.setState({ token: null, userId: null })
  }

  render() {
    return (
      <Router>
        <AuthContext.Provider value={{
          token: this.state.token, 
          userId: this.state.userId, 
          login: this.login, 
          logout: this.logout
        }} >
          <Navigation />
          <Switch>
            { this.state.token &&  <Redirect from='/' to='/events' exact />}
            { this.state.token &&  <Redirect from='/auth' to='/events' exact />}
            { !this.state.token && <Route path='/auth' component={Auth} />}
            <Route path='/events' component={Events} />
            { this.state.token && <Route path='/bookings' component={Bookings} />}
            { !this.state.token &&  <Redirect from='/bookings' to='/auth' exact />}
            { !this.state.token &&  <Redirect from='/' to='/auth' exact />}
          </Switch>
        </AuthContext.Provider>
      </Router>
    );
  }
}

export default App;
