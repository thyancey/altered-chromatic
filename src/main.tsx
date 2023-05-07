import React from 'react'
import ReactDOM from 'react-dom/client'

import Main from './scenes/main/index';
import { store } from './app/store';
import { Provider } from 'react-redux';
import './themes/fonts.css';
import GlobalStyle from './themes/index';
window.global ||= window;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  <React.StrictMode>
    <Provider store={store}>
      <Main />
      <GlobalStyle />
    </Provider>
  </React.StrictMode>,
)
