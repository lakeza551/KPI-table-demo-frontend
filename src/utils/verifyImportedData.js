function verifyImportedData(formTemplate, importedData) {
  for(const table of formTemplate) {
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
  }
  return true
}

export default verifyImportedData