import callApi from "./callApi"

async function fetchRawDataAllDeparment(semesterId, setRawDataList) {
    var rawDataList = {}
    const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/raw_data/`, 'GET', null)
    const resData = (await res.json()).data
    for(const rawDataObj of resData) {
        rawDataList[rawDataObj.group.id] = rawDataObj.raw_data_list
    }
    setRawDataList(rawDataList)
}

export default fetchRawDataAllDeparment