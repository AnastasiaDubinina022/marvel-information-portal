import React from 'react';
import ReactDOM from 'react-dom/client';
// alt.variant
// import {createRoot} from 'react-dom/client';
import App from './components/app/App';

import './styles/style.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// alt. variant React.18
// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// синтаксис 17й версии (так же импорт ReactDOM from 'react-dom';):
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
