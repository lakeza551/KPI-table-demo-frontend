import callApi from "./callApi";

const fetchDepartmentList = async (setSemesterList) => {
    const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/`, 'GET', null)
    setSemesterList((await res.json()).data)
}

export default fetchDepartmentList