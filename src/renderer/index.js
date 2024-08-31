// frontend index.js that renders react component (App)

import React from "react";
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '../renderer/styles.css'

const root = createRoot(document.getElementById('root'));
root.render(
  <App />
);

