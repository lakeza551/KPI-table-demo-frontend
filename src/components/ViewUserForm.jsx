import { useState } from "react"
import FillUserForm from "./ViewUserFormComponents/FillUserForm"
import ViewSummaryForm from "./ViewUserFormComponents/ViewSummaryForm"

function ViewUserForm(props) {
    const [selectedForm, setSelectedForm] = useState('user-form')
    const FormSelectButtonBar = () => {
        return (
            <div className="form-select">
                <button onClick={() => setSelectedForm('user-form')}>ฟอร์ม Work load</button>
                <button onClick={() => setSelectedForm('summary-form')}>ฟอร์มสรุป</button>
            </div>
        )
    }
    return (
        <div className="content-container">
            <div className="form-search">
                <div className="form-search-select">
                    <label htmlFor="">ฟอร์ม</label>
                    <select name="" id="">
                        <option value="">2566/1</option>
                    </select>
                </div>
                <div className="form-search-select">
                    <label htmlFor="">ชื่ออาจารย์</label>
                    <select name="" id="">
                        <option value="">นายปรมรรค ปฐมเพทาย</option>
                    </select>
                </div>
            </div>
            <FormSelectButtonBar />
            {selectedForm === 'user-form' ? <FillUserForm/> : <ViewSummaryForm/>}
        </div>
    )
}

export default ViewUserForm