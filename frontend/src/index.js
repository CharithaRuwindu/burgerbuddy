import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';

export default function App() {
  return(
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={Layout}>

        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);