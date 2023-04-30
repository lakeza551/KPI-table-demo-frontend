import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import CreateUserForm from './components/CreateUserForm';
import FillUserForm from './components/FillUserForm';
import CreateSummaryForm from './components/CreateSummaryForm';
import ViewSummaryForm from './components/ViewSummaryForm';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path='/create-user-form' element={<CreateUserForm/>}></Route>
          <Route path='/create-summary-form' element={<CreateSummaryForm/>}></Route>
          <Route path='/fill-user-form' element={<FillUserForm/>}></Route>
          <Route path='/view-summary-form' element={<ViewSummaryForm/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
