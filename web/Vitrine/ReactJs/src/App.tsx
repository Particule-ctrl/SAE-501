import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IndexOne from './index/index-one';
import IndexTwo from './index/index-two';
import IndexThree from './index/index-three';
import IndexFour from './index/index-four';
import IndexFive from './index/index-five';
import IndexSix from './index/index-six';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<IndexOne />} />
        <Route path='/index-two' element={<IndexTwo />} />
        <Route path='/index-three' element={<IndexThree />} />
        <Route path='/index-four' element={<IndexFour />} />
        <Route path='/index-five' element={<IndexFive />} />
        <Route path='/index-six' element={<IndexSix />} />
        <Route path='/signup' element={<Signup />} /> {/* Route pour la page d'inscription */}
        <Route path="/login" element={<Login />} /> {/* Ajoutez la route pour Login */}
      </Routes>
    </>
  );
}

export default App;