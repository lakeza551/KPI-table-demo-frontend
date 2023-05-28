import callApi from "./callApi"

async function fetchRawDataAllDeparment(semesterId, setRawDataList) {
    var res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/`, 'GET', null)
    const departmentList = (await res.json()).data
    var rawDataList = {}
    for(const department of departmentList) {
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/raw_data/?group_id=${department.id}`, 'GET', null)
        rawDataList[department.id] = (await res.json()).data[0].raw_data_list
    }
    setRawDataList(rawDataList)
}

export default fetchRawDataAllDeparment