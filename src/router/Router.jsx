import React from 'react';
import { HashRouter, Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from '../pages/Home/Home.jsx';
import About from '../pages/About/About.jsx';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render"] }] */

class Hello extends React.Component {
  render() {
    return <h1>Hello! {this.props.match.params.userName}</h1>;
  }
}

Hello.propTypes = {
  match: PropTypes.object,
};

class Router extends React.Component {
  render() {
    return (
      <HashRouter>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">Another page</Link>
            </li>
            <li>
              <Link to="/hello/Home">/hello/:userName</Link>
            </li>
            <li>
              <Link to="/hey/About">/hey/:userName</Link>
            </li>
          </ul>

          <hr />

          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/hello/:userName' component={Hello} />
          <Route path='/hey/:userName' render={props => <h1>Hey! {props.match.params.userName}</h1>} />
        </div>
      </HashRouter>
    );
  }
}

export default Router;
