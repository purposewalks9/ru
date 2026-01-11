import Home from './pages/home'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './component/navbar'
import About from './pages/about'
import Career from './pages/career'
import Stories from './pages/stories'
import TeamSection from './pages/team'
import PressAwards from './pages/press'

function App() {


  return (
  
   <div className="overflow-hidden"> 
   <Navbar />
   <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/about' element={<About />} />
    <Route path='/stories' element={<Stories />} />
    <Route path='/career' element={<Career />} />
    <Route path='/team' element={<TeamSection />} />
    <Route path='/press' element={<PressAwards />} />
   </Routes>
   </div>
   
  )
}

export default App
