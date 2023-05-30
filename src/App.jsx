import './App.css';
import './ReactDataTable.css'
import './ReactGoogleChart.css'
import Auth from './Auth'
import Home from './Home';
import AdminHomePage from './components/AdminHomePage';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'

function App() {
  //const navigate = useNavigate()
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth/*' element={<Auth/>}/>
        <Route path='/admin/*' element={<AdminHomePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
