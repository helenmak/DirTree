import React              from 'react';
import ReactDOM           from 'react-dom';
import 'regenerator-runtime/runtime';

import './index.css';
import App                from './App';

if (module.hot) {
    module.hot.accept('./App.js', function() {
          console.log('Accepting the updated printMe module!');
        ReactDOM.render(<App />, document.getElementById('root'));
        })
    }

ReactDOM.render(<App />, document.getElementById('root'));
