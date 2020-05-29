import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { App } from './App';
import 'nprogress/nprogress.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { browserHistory } from './utils/history';

ReactDOM.render(
  <Router history={browserHistory}>
    <App />
  </Router>,
  document.getElementById('root')
);
