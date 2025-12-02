import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './api/api';
import { Provider } from 'react-redux';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

import { store } from './redux/store';
import { App } from './App';

const containerElement = document.getElementById('root-page');
if (!containerElement) {
  throw new Error('Root container missing in index.html');
}

export const Root = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
};

createRoot(containerElement).render(<Root />);
