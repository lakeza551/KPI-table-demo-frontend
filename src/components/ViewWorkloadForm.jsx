import { Link } from "react-router-dom"

function ViewWorkloadForm(props) {

    const ButtonBar = () => {
        return (
            <div className="button-bar">
                <Link to={'/workload-form/create'}>สร้างฟอร์มใหม่</Link>
            </div>
        )
    }

    const FormList = () => {
        return (
            <div className="formlist-container">
                <div className="formlist-row">
                    <Link>2566/2</Link>
                    <div className="formlist-row-menu">
                        <Link>แก้ไข</Link>
                        <input type="checkbox" name="" id="" />
                        <label>เปิดใช้งาน</label>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="content-container">
            <ButtonBar />
            <FormList />
        </div>
    )

}

export default ViewWorkloadForm