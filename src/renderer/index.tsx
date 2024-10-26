import React from "react";
import { createRoot } from 'react-dom/client';
import App from './containers/App';
import './styles.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find a root element');
}

const root = createRoot(rootElement);

root.render(
  <App />
);
