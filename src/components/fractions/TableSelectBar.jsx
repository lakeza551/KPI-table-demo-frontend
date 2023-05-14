function TableSelectBar({ formTemplate, setSelectedTable }) {
    const tableCount = formTemplate.length
    return (
        <div className="table-select-bar">
            {Array.apply(null, Array(tableCount)).map((temp, index) => {
                return (
                    <div className="table-select-bar-button-container">
                        <button onClick={() => setSelectedTable(index)}>ตารางที่ {index + 1}</button>
                    </div>
                )
            })}
        </div>
    )
}

export default TableSelectBar