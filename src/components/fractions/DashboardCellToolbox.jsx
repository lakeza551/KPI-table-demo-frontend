function DashboardCellToolbox(props) {
    const {formUtils, form, setForm, selectedTable, rIndex, cIndex, departmentList} = props
    return (
        <div className="toolbox">
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                <button onClick={() => formUtils.spanColumn(rIndex, cIndex)}>
                    span column
                </button>
                <button onClick={() => formUtils.spanRow(rIndex, cIndex)}>
                    span row
                </button>
                </div>
                span
            </div>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                <button onClick={() => formUtils.unspanColumn(rIndex, cIndex)}>
                    unspan column
                </button>
                <button onClick={() => formUtils.unspanRow(rIndex, cIndex)}>
                    unspan row
                </button>
                </div>
                unspan
            </div>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                <button onClick={() => formUtils.addColumn('left', rIndex, cIndex)}>
                    add left column
                </button>
                <button onClick={() => formUtils.addColumn('right', rIndex, cIndex)}>
                    add right column
                </button>
                </div>
                add column
            </div>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                <button onClick={() => formUtils.addRow('top', rIndex, cIndex)}>
                    add top row
                </button>
                <button onClick={() => formUtils.addRow('bottom', rIndex, cIndex)}>
                    add bottom row
                </button>
                </div>
                add row
            </div>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                    <button onClick={() => formUtils.changeHeight(rIndex, 25)}>
                        increase height
                    </button>
                    <button onClick={() => formUtils.changeHeight(rIndex, -25)}>
                        decrease height
                    </button>
                </div>
                height
            </div>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                <button onClick={() => formUtils.changeWidth(rIndex, 25)}>
                    increase width
                </button>
                <button onClick={() => formUtils.changeWidth(rIndex, -25)}>
                    decrease width
                </button>
                </div>
                width
            </div>
            <button onClick={() => formUtils.deleteRow(rIndex)}>
                delete row
            </button>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                    <button onClick={() => formUtils.addBorder(rIndex, cIndex, 'top')}>
                        add top border
                    </button>
                    <button onClick={() => formUtils.addBorder(rIndex, cIndex, 'bottom')}>
                        add bottom border
                    </button>
                    <button onClick={() => formUtils.addBorder(rIndex, cIndex, 'right')}>
                        add right border
                    </button>
                    <button onClick={() => formUtils.addBorder(rIndex, cIndex, 'left')}>
                        add left border
                    </button>
                    <button onClick={() => formUtils.removeBorder(rIndex, cIndex, 'top')}>
                        remove top border
                    </button>
                    <button onClick={() => formUtils.removeBorder(rIndex, cIndex, 'bottom')}>
                        remove bottom border
                    </button>
                    <button onClick={() => formUtils.removeBorder(rIndex, cIndex, 'right')}>
                        remove right border
                    </button>
                    <button onClick={() => formUtils.removeBorder(rIndex, cIndex, 'left')}>
                        remove left border
                    </button>
                </div>
                border
            </div>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                <button onClick={() => formUtils.setTextAlignment(rIndex, cIndex, 'center')}>
                    center
                </button>
                <button onClick={() => formUtils.setTextAlignment(rIndex, cIndex, 'left')}>
                    left
                </button>
                <button onClick={() => formUtils.setTextAlignment(rIndex, cIndex, 'right')}>
                    right
                </button>
                </div>
                text aligntment
            </div>
            <div className="toolbox-sub-menu">
                <div className="toolbox">
                {departmentList.map(dep => {
                    return (
                        <button onClick={() => formUtils.setTextInCell(rIndex, cIndex, `!department#${dep.id}`)}>
                            {dep.title}
                        </button>
                    )
                })}
                </div>
                department
            </div>
            <button onClick={() => formUtils.setTextInCell(rIndex, cIndex, '!summary#รวม')}>
                summary
            </button>
        </div>
    )
}

export default DashboardCellToolbox