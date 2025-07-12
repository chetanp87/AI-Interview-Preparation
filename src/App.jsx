import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'; 
import NavBar from './components/Navbar'
import Home from './components/Home'
import Practice from './components/Practice';
// import Contact from './components/Contact';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-gradient-to-br from-green-900 to-gray-900 min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
      </div>
    </>
  )
}
import About from './components/About';
import Contact from './components/Contact';

export default App
