import { Link, Route, Routes, BrowserRouter } from "react-router-dom"
import CreateUserForm from './CreateUserForm'
import CreateSummaryForm from "./CreateSummaryForm"

function CreateForm(props) {

    const FormSelectButtonBar = () => {
        return (
            <div className="form-select">
                <Link to="/workload-form/create/user-form">ฟอร์ม Work load</Link>
                <Link to="/workload-form/create/summary-form">ฟอร์มสรุป</Link>
                <Link to="/workload-form/create/dashboard-form">ฟอร์ม Dashboard</Link>
            </div>
        )
    }

    return (
        <div className="content-container">
            <FormSelectButtonBar />
            <Routes>
                <Route exact path="/summary-form" element={<CreateSummaryForm/>}></Route>
                <Route exact path="/user-form" element={<CreateUserForm/>}></Route>
            </Routes>
        </div>
    )

}

export default CreateForm