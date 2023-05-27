import { Link } from "react-router-dom"

function Sidebar(props) {
    return (
        <div className="sidebar">
            <Link to={'./users'}>Users</Link>
            <Link to='./dashboard'>Dashboard</Link>
            <Link to='./workload-form'>Workload Form</Link>
            <Link to='./user-form'>View User Form</Link>
        </div>
    )
}

export default Sidebar