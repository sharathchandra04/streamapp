import './App.css';
import React, { useEffect, useRef } from 'react';

// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';
import MovieGrid from './components/Grid';
import Player from './components/Player'
import LivePlayer from './components/LivePlayer'

// import Home from './Home';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieGrid />} />
        {/* <Route path="/play" element={<Player />} /> */}
        <Route path="/play/:id" element={<LivePlayer />} />
        {/* <Route path="/play/:id" element={<Player />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
