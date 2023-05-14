import './App.css';
import Navbar from './components/Navbar';
import ViewWorkloadForm from './components/ViewWorkloadForm';
import Sidebar from './components/Sidebar';
import CreateForm from './components/ViewWorkloadFormComponents/CreateForm';
import ViewUserForm from './components/ViewUserForm';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <div className="app-container">
      <BrowserRouter>
        <Navbar></Navbar>
        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path='/workload-form' element={<ViewWorkloadForm/>}></Route>
            <Route path='/workload-form/create/*' element={<CreateForm/>}></Route>
            <Route path='/user-form' element={<ViewUserForm/>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
