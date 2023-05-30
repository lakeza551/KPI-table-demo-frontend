function TableSelectBar({ formTemplate, selectedTable, setSelectedTable }) {
    const activeStyle = {
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
    const tableCount = formTemplate.length
    return (
        <div className="table-select-bar">
            {Array.apply(null, Array(tableCount)).map((temp, index) => {
                return (
                    <div className="table-select-bar-button-container">
                        <button style={index === selectedTable ? activeStyle : undefined} onClick={() => setSelectedTable(index)}>ตารางที่ {index + 1}</button>
                    </div>
                )
            })}
        </div>
    )
}

export default TableSelectBar