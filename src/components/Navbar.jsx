import { Link } from "react-router-dom"

function Navbar(props) {
    return (
        <div className="navbar">
            <Link to='/create-user-form'>Create User Form</Link>
            <Link to='/create-summary-form'>Create Summary Form</Link>
            <Link to='/fill-user-form'>Fill User Form</Link>
            <Link to='/view-summary-form'>View Summary Form</Link>
        </div>
    )
}

export default Navbar