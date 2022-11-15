import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import HomeContext from './Context/HomeContext/HomeContext';
import Navbar from './Components/CommonComponents/Navbar';

function App() {

  // eslint-disable-next-line no-unused-vars
  const { state, setState } = useContext(HomeContext);

  useEffect(() => {

    // return () => Call Any Function;
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={< Home />}></Route>
        <Route exact path='/about' element={< About />}></Route>
        <Route exact path='/contact' element={< Contact />}></Route>
      </Routes>
    </Router>
  );
};

export default App;