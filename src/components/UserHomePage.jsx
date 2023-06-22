import Navbar from './fractions/Navbar';
import Sidebar from './fractions/Sidebar';
import ViewUserForm from './UserNavbarPages/ViewUserForm';
import ViewDashboard from './UserNavbarPages/ViewDashboard'
import Cookies from 'universal-cookie';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

function UserHomePage() {
    const navigate = useNavigate()
    useEffect(() => {
        const cookies = new Cookies()
        if(cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN) === undefined)
            navigate('/')
    })
    return (
        <div className="App">
            <div className="app-container">
                <Navbar></Navbar>
                <div className="flex" style={{
                    height: 'fit-content'
                }}>
                    <Sidebar />
                    <Routes>
                        <Route path='/form/*' element={<ViewUserForm />}></Route>
                        <Route path='/dashboard/*' element={<ViewDashboard/>}></Route>
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default UserHomePage;
