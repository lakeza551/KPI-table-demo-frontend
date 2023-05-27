import Navbar from './fractions/Navbar';
import ViewWorkloadForm from './ViewWorkloadForm';
import Sidebar from './fractions/Sidebar';
import EditForm from './ViewWorkloadFormComponents/EditForm';
import ViewUserForm from './ViewUserForm';
import ViewUserList from './ViewUserList';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function AdminHomePage() {
    return (
        <div className="App">
            <div className="app-container">
                <Navbar></Navbar>
                <div className="flex">
                    <Sidebar />
                    <Routes>
                        <Route path='/users' element={<ViewUserList />}></Route>
                        <Route path='/workload-form' element={<ViewWorkloadForm />}></Route>
                        <Route path='/workload-form/edit/:semesterId/*' element={<EditForm />}></Route>
                        <Route path='/user-form/*' element={<ViewUserForm />}></Route>
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default AdminHomePage;
