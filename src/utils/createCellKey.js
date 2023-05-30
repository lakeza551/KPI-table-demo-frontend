export const columnNameList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const createCellKey = (formType, selectedTable, rIndex, cIndex) => {
    if(formType === 'user-form')
        return `#a${selectedTable + 1}_${columnNameList[cIndex]}${rIndex + 1}`
    if(formType === 'summary-form')
        return `#b${selectedTable + 1}_${columnNameList[cIndex]}${rIndex + 1}`
    if(formType === 'dashboard-form')
        return `#c${selectedTable + 1}_${columnNameList[cIndex]}${rIndex + 1}`
}

export default createCellKey