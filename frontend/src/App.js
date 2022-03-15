import React from 'react';
import Nav from './components/Nav/Nav';
import Books from './components/Books/Books';
import Issue from './components/Issue/Issue';
import IssuedBook from './components/IssuedBook/IssuedBook';
import Return from './components/Return/Return';
import ReturnAdmin from './components/ReturnAdmin/ReturnAdmin';
import Search from './components/search/search';
import Login from './components/Login/Login';
import SearchAdmin from './components/searchAdmin/searchAdmin';
import Issuing from './components/Issuing/Issuing';
import './App.css';
import {Route, Redirect, Switch} from 'react-router-dom';

class App extends React.Component {

  render(){
    return (
      <div className="App">
        <Nav />
        <Switch>
          <Route path='/' exact strict component={Books}/>
          <Route path='/issue' exact strict component={Issue}/>
	  <Route path='/issuedbook' exact strict component={IssuedBook}/>
          <Route path='/return' exact strict component={Return}/>
          <Route path='/search' exact strict component={Search}/>
	  <Route path='/login' exact strict component={Login}/>
	  <Route path='/searchAdmin' exact strict component={SearchAdmin}/>
	  <Route path='/issuing' exact strict component={Issuing}/>
	  <Route path='/returnAdmin' exact strict component={ReturnAdmin}/>
          <Redirect from='*' to='/'/>
        </Switch>
      </div>
    );
  }
}

export default App;
