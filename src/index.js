import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main';
import * as serviceWorker from './serviceWorker';

window.userId = 1;
window.serviceId = 1;
window.mode = 0;

ReactDOM.render(<Main />, document.getElementById('root'));
serviceWorker.unregister();
