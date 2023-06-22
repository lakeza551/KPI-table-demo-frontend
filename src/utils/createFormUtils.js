import createCellKey from "./createCellKey"


export class CreateFormUtils {  
    defaultRowHeight = 50
    defaultColumnWidth = 175
    defaultTableTemplate = {
        rowHeight: [this.defaultRowHeight],
        columnWidth: [this.defaultColumnWidth],
        rows: [
            {
                columns: [
                    {
                        rowSpan: 1,
                        colSpan: 1,
                        value: null,
                        isMerged: false
                    }
                ]
            }
        ]
    }
    
    constructor(form, setForm, selectedTable, setSelectedTable, formType, formStack, setFormStack) {
        this.form = form
        this.setForm = setForm
        this.selectedTable = selectedTable
        this.setSelectedTable = setSelectedTable
        this.formType = formType
        this.formStack = formStack
        this.setFormStack = setFormStack
    }

    initiateForm() {
        this.setForm(prev => {
            prev.push({...this.defaultTableTemplate})
            return [...prev]
        })
        this.generateKeys()
    }

    saveFormState(prevForm) {
        this.formStack.push(prevForm)
        //console.log(process.memoryUsage())
    }
    
    addRow(direction, rIndex, cIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            var top
            var bottom
            if (direction === 'top') {
                top = prev[this.selectedTable].rows.slice(0, rIndex)
                bottom = prev[this.selectedTable].rows.slice(rIndex, prev[this.selectedTable].rows.length)
                prev[this.selectedTable].rowHeight = [
                    ...prev[this.selectedTable].rowHeight.slice(0, rIndex),
                    this.defaultRowHeight,
                    ...prev[this.selectedTable].rowHeight.slice(rIndex, prev[this.selectedTable].rows.length)
                ]
            }
            else if (direction === 'bottom') {
                top = prev[this.selectedTable].rows.slice(0, rIndex + 1)
                bottom = prev[this.selectedTable].rows.slice(rIndex + 1, prev[this.selectedTable].rows.length)
                prev[this.selectedTable].rowHeight = [
                    ...prev[this.selectedTable].rowHeight.slice(0, rIndex + 1),
                    this.defaultRowHeight,
                    ...prev[this.selectedTable].rowHeight.slice(rIndex + 1, prev[this.selectedTable].rows.length)
                ]
            }
            const newRow = {
                columns: prev[this.selectedTable].rows[rIndex].columns.map(cell => ({
                    colSpan: 1,
                    rowSpan: 1,
                    value: null,
                    isMerged: false
                }))
            }
            prev[this.selectedTable].rows = [...top, newRow, ...bottom]
            return [...prev]
        })
        this.generateKeys()
    }
    
    addColumn(direction, rIndex, cIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            for(const row of prev[this.selectedTable].rows) {
                var left
                var right
                if (direction === 'left') {
                    left = row.columns.slice(0, cIndex)
                    right = row.columns.slice(cIndex, row.columns.length)
                    prev[this.selectedTable].columnWidth = [
                        ...prev[this.selectedTable].columnWidth.slice(0, cIndex),
                        this.defaultColumnWidth,
                        ...prev[this.selectedTable].columnWidth.slice(cIndex, row.columns.length)
                    ]
                }
                else if (direction === 'right') {
                    left = row.columns.slice(0, cIndex + 1)
                    right = row.columns.slice(cIndex + 1, row.columns.length)
                    prev[this.selectedTable].columnWidth = [
                        ...prev[this.selectedTable].columnWidth.slice(0, cIndex + 1),
                        this.defaultColumnWidth,
                        ...prev[this.selectedTable].columnWidth.slice(cIndex + 1, row.columns.length)
                    ]
                }
                const newCell = {
                    colSpan: 1,
                    rowSpan: 1,
                    value: null,
                    isMerged: false
                }
                row.columns = [...left, newCell, ...right]
            }
            return [...prev]
        })
        this.generateKeys()
    }
    
    spanColumn(rIndex, cIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            var lengths = prev[this.selectedTable].rows.map(r => r.columns.length)
            //console.log(lengths)
            if (cell.colSpan < Math.max(...lengths)) {
                cell.colSpan += 1
                for (var currentRow = rIndex; currentRow < cell.rowSpan + rIndex; ++currentRow) {
                    prev[this.selectedTable].rows[currentRow].columns[cIndex + cell.colSpan - 1].isMerged = true
                }
            }
            return [...prev]
        })
        this.generateKeys()
    }
    
    spanRow(rIndex, cIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            if (cell.rowSpan < prev[this.selectedTable].rows.length) {
                cell.rowSpan += 1
                for (var currentColumn = cIndex; currentColumn < cell.colSpan + cIndex; ++currentColumn) {
                    prev[this.selectedTable].rows[rIndex + cell.rowSpan - 1].columns[currentColumn].isMerged = true
                }
            }
            return [...prev]
        })
        this.generateKeys()
    }
    
    unspanColumn(rIndex, cIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            if (cell.colSpan > 1) {
                cell.colSpan -= 1
                for (var currentRow = rIndex; currentRow < cell.rowSpan + rIndex; ++currentRow) {
                    prev[this.selectedTable].rows[currentRow].columns[cIndex + cell.colSpan].isMerged = false
                }
            }
            return [...prev]
        })
        this.generateKeys()
    }
    
    unspanRow(rIndex, cIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            if (cell.rowSpan < prev[this.selectedTable].rows.length) {
                cell.rowSpan -= 1
                for (var currentColumn = cIndex; currentColumn < cell.colSpan + cIndex; ++currentColumn) {
                    prev[this.selectedTable].rows[rIndex + cell.rowSpan].columns[currentColumn].isMerged = false
                }
            }
            return [...prev]
        })
        this.generateKeys()
    }
    
    changeHeight(rIndex, size) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            prev[this.selectedTable].rowHeight[rIndex] += size
            return [...prev]
        })
    }
    
    changeWidth(cIndex, size) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            prev[this.selectedTable].columnWidth[cIndex] += size
            return [...prev]
        })
    }
    
    addTable(tIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            const newTable = {
                rowHeight: [this.defaultRowHeight],
                columnWidth: [this.defaultColumnWidth],
                rows: [
                    {
                        columns: [
                            {
                                rowSpan: 1,
                                colSpan: 1,
                                value: null,
                                isMerged: false
                            }
                        ]
                    }
                ]
            }
            const left = prev.slice(0, tIndex)
            const right = prev.slice(tIndex, prev.length)
            return [...left, newTable, ...right]
        })
        this.generateKeys()
    }
    
    deleteTable(deleteIndex) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        if (this.form.length === 1)
            return
            this.setForm(prev => {
            prev.splice(deleteIndex, 1)
            return [...prev]
        })
        if (this.selectedTable === deleteIndex)
            this.setSelectedTable(prev => prev - 1)
    }
    
    deleteRow(rIndex) {
        if(this.form[this.selectedTable].rows.length === 1)
            return
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            prev[this.selectedTable].rows.splice(rIndex, 1)
            return [...prev]
        })
        this.generateKeys()
    }

    deleteColumn(cIndex) {
        if(this.form[this.selectedTable].columnWidth.length === 1)
            return
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            prev[this.selectedTable].columnWidth.splice(cIndex, 1)
            for(const row of prev[this.selectedTable].rows) {
                console.log(row)
                var cIndexTemp = cIndex
                row.columns.splice(cIndex, 1)
            }
            return [...prev]
        })
        this.generateKeys()
    }

    removeBorder(rIndex, cIndex, direction) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            if(direction === 'top')
                cell.style = {
                    ...cell.style,
                    borderTopStyle: 'none',
                }
            else if(direction === 'bottom')
                cell.style = {
                    ...cell.style,
                    borderBottomStyle: 'none',
                }
            else if(direction === 'right')
                cell.style = {
                    ...cell.style,
                    borderRightStyle: 'none',
                }
            else if(direction === 'left')
                cell.style = {
                    ...cell.style,
                    borderLeftStyle: 'none',
                }
            return [...prev]
        })
    }

    addBorder(rIndex, cIndex, direction) {
        this.saveFormState(JSON.parse(JSON.stringify(this.form)))
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            if(direction === 'top')
                cell.style = {
                    ...cell.style,
                    borderTopStyle: 'solid',
                }
            else if(direction === 'bottom')
                cell.style = {
                    ...cell.style,
                    borderBottomStyle: 'solid',
                }
            else if(direction === 'right')
                cell.style = {
                    ...cell.style,
                    borderRightStyle: 'solid',
                }
            else if(direction === 'left')
                cell.style = {
                    ...cell.style,
                    borderLeftStyle: 'solid',
                }
            return [...prev]
        })
    }

    setTextAlignment(rIndex, cIndex, direction) {
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            if(direction === 'left') {
                cell.textareaStyle = {
                    textAlign: 'left'
                }
            }
            else if(direction === 'right') {
                cell.textareaStyle = {
                    textAlign: 'right'
                }
            }
            else if(direction === 'center') {
                cell.textareaStyle = {
                    textAlign: 'center'
                }
            }
            console.log(prev)
            return [...prev]
        })
    }

    setTextInCell(rIndex, cIndex, text) {
        this.setForm(prev => {
            const cell = prev[this.selectedTable].rows[rIndex].columns[cIndex]
            cell.value = text
            return [...prev]
        })
    }

    generateKeys() {
        this.setForm(prev => {
            prev.forEach((table, tIndex) => {
                table.rows.forEach((row, rIndex) => {
                    row.columns.forEach((cell, cIndex) => {
                        cell.key = createCellKey(this.formType, tIndex, rIndex, cIndex)
                    })
                })
            })
            return [...prev]
        })
    }
    
    undo() {
        if(this.formStack.length === 0)
            return

        this.setForm([...this.formStack.pop()])
    }
}
