import React from 'react'
import Canvas from './components/Canvas';
import Settings from './components/Settings';
import Toolbar from './components/Toolbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import "./styles/app.scss"

const route = () => {
  return (
    <div className='app'>
      <Toolbar />
      <Settings />
      <Canvas />
    </div>
  )
}

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path='/draw/:id' element={route()} />
          <Route path='*' element={<Navigate to={`/draw/f${(+new Date()).toString(16)}`} />} />
        </Routes>
    </Router>
  )
}

export default App;
