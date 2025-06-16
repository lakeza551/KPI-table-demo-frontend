function verifyImportedData(formTemplate, importedData) {
  const data = {...importedData}
  const messages = []
  for(const [index, table] of formTemplate.entries()) {
    const isVerified = verifyTable(table, importedData)
    const tableIndex = index + 1
    if(!isVerified) {
      messages.push([`ตารางที่ ${tableIndex}. ${table.name}`, false])
      Object.keys(importedData).filter(key => key.startsWith(`#a${tableIndex}`)).forEach(key => {
        delete data[key]
      })
    }
    else
      messages.push([`ตารางที่ ${tableIndex}. ${table.name}`, true])
  }
  return [data, messages]
}

function verifyTable(table, importedData) {
  for(const row of table.rows) {
    for(const column of row.columns) {
      if(!column.type.startsWith('input'))
        continue
      const templateInputType = column.type.split("#")[1]
      const currentCell = importedData[column.key]
      if(templateInputType === 'string' && currentCell !== null && typeof currentCell !== 'string')
        return false
      if(templateInputType === 'number' && currentCell !== null && isNaN(currentCell))
        return false
      if(templateInputType === 'file' && currentCell !== null && typeof currentCell !== 'object')
        return false
      if(templateInputType === 'checkbox' && currentCell !== null && typeof currentCell !== 'boolean')
        return false
    }
  }
  return true
}

export default verifyImportedData