import './App.css';
import './ReactDataTable.css'
import './ReactGoogleChart.css'
import Auth from './Auth'
import Home from './Home';
import AdminHomePage from './components/AdminHomePage';
import UserHomePage from './components/UserHomePage';
import {HashRouter, Routes, Route, useNavigate} from 'react-router-dom'

function App() {
  //const navigate = useNavigate()
  return (
    <HashRouter basename='/'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth/*' element={<Auth/>}/>
        <Route path='/admin/*' element={<AdminHomePage/>}/>
        <Route path='/user/*' element={<UserHomePage/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App;
