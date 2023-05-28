import callApi from "./callApi";

const fetchSemesterList = async (setSemesterList) => {
    const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/`, 'GET', null)
    setSemesterList((await res.json()).data)
}

export default fetchSemesterList