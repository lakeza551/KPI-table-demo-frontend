import Navbar from './fractions/Navbar';
import ViewWorkloadForm from './AdminNavbarPages/ViewWorkloadForm';
import Sidebar from './fractions/Sidebar';
import EditForm from './ViewWorkloadFormComponents/EditForm';
import ViewUserForm from './AdminNavbarPages/ViewUserForm';
import ViewUserList from './AdminNavbarPages/ViewUserList';
import ViewDashboard from './AdminNavbarPages/ViewDashboard';
import ViewDepartment from './AdminNavbarPages/ViewDepartment';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import Cookies from 'universal-cookie';

function AdminHomePage() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    useEffect(() => {
        if(cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN) === undefined)
            navigate('/auth')
    })


    return (
        <div className="App">
            <div className="app-container">
                <Navbar></Navbar>
                <div className="flex">
                    <Sidebar />
                    <Routes>
                        <Route path='/dashboard' element={<ViewDashboard />}></Route>
                        <Route path='/users' element={<ViewUserList key={'user-list'}/>}></Route>
                        <Route path='/workload-form' element={<ViewWorkloadForm />}></Route>
                        <Route path='/department' element={<ViewDepartment/>}></Route>
                        <Route path='/workload-form/edit/:semesterId/*' element={<EditForm />}></Route>
                        <Route path='/user-form/*' element={<ViewUserForm />}></Route>
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default AdminHomePage;
