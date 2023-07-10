function CellToolbox(props) {
    const {formUtils, rIndex, cIndex, pageX, pageY} = props
    return (
        <div className="toolbox" style={{
            left: pageX,
            top: pageY
        }}>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.addCellStyle(rIndex, cIndex, {
                    backgroundColor: '#E6E6FA'
                })}>
                    <div className="toolbox-color-indicator" style={{backgroundColor: '#E6E6FA'}}></div>
                </button>
                <button onClick={() => formUtils.addCellStyle(rIndex, cIndex, {
                    backgroundColor: '#FFB6C1'
                })}>
                    <div className="toolbox-color-indicator" style={{backgroundColor: '#FFB6C1'}}></div>
                </button>
                <button onClick={() => formUtils.addCellStyle(rIndex, cIndex, {
                    backgroundColor: '#FFFACD'
                })}>
                    <div className="toolbox-color-indicator" style={{backgroundColor: '#FFFACD'}}></div>
                </button>
                <button onClick={() => formUtils.addCellStyle(rIndex, cIndex, {
                    backgroundColor: '#CCFFCC'
                })}>
                    <div className="toolbox-color-indicator" style={{backgroundColor: '#CCFFCC'}}></div>
                </button>
                <button onClick={() => formUtils.addCellStyle(rIndex, cIndex, {
                    backgroundColor: '#FFC0CB'
                })}>
                    <div className="toolbox-color-indicator" style={{backgroundColor: '#FFC0CB'}}></div>
                </button>
                <button onClick={() => formUtils.addCellStyle(rIndex, cIndex, {
                    backgroundColor: '#F0F8FF'
                })}>
                    <div className="toolbox-color-indicator" style={{backgroundColor: '#F0F8FF'}}></div>
                </button>
                <button onClick={() => formUtils.addCellStyle(rIndex, cIndex, {
                    backgroundColor: 'transparent'
                })}>
                    unhighlight
                </button>
                </div>
                highlight
            </div>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.addTextareaStyle(rIndex, cIndex, {
                    fontWeight: 'normal'
                })}>
                    normal
                </button>
                <button onClick={() => formUtils.addTextareaStyle(rIndex, cIndex, {
                    fontWeight: 'bold'
                })}>
                    bold
                </button>
                </div>
                font
            </div>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.spanColumn(rIndex, cIndex)}>
                    span column
                </button>
                <button onClick={() => formUtils.spanRow(rIndex, cIndex)}>
                    span row
                </button>
                </div>
                span
            </div>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.unspanColumn(rIndex, cIndex)}>
                    unspan column
                </button>
                <button onClick={() => formUtils.unspanRow(rIndex, cIndex)}>
                    unspan row
                </button>
                </div>
                unspan
            </div>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.addColumn('left', rIndex, cIndex)}>
                    add left column
                </button>
                <button onClick={() => formUtils.addColumn('right', rIndex, cIndex)}>
                    add right column
                </button>
                </div>
                add column
            </div>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.addRow('top', rIndex, cIndex)}>
                    add top row
                </button>
                <button onClick={() => formUtils.addRow('bottom', rIndex, cIndex)}>
                    add bottom row
                </button>
                </div>
                add row
            </div>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.changeWidth(cIndex, 25)}>
                    increase width
                </button>
                <button onClick={() => formUtils.changeWidth(cIndex, -25)}>
                    decrease width
                </button>
                </div>
                width
            </div>
            <button onClick={() => formUtils.deleteRow(rIndex)}>
                delete this row
            </button>
            <button onClick={() => formUtils.deleteColumn(cIndex)}>
                delete this column
            </button>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
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
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.addTextareaStyle(rIndex, cIndex, {
                    textAlign: 'center'
                })}>
                    center
                </button>
                <button onClick={() => formUtils.addTextareaStyle(rIndex, cIndex, {
                    textAlign: 'left'
                })}>
                    left
                </button>
                <button onClick={() => formUtils.addTextareaStyle(rIndex, cIndex, {
                    textAlign: 'right'
                })}>
                    right
                </button>
                </div>
                text aligntment
            </div>
            <div className="toolbox-sub">
                <div className="toolbox-sub-menu">
                <button onClick={() => formUtils.setTextInCell(rIndex, cIndex, '!input#text')}>
                    text
                </button>
                <button onClick={() => formUtils.setTextInCell(rIndex, cIndex, '!input#number')}>
                    number
                </button>
                <button onClick={() => formUtils.setTextInCell(rIndex, cIndex, '!input#checkbox')}>
                    checkbox
                </button>
                <button onClick={() => formUtils.setTextInCell(rIndex, cIndex, '!input#file')}>
                    file
                </button>
                </div>
                input
            </div>
        </div>
    )
}

export default CellToolbox