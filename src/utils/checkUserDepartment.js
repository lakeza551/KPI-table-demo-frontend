function checkUserDepartment(user) {
    if(user.groups.length > 0)
        return user.groups[0].title
    return 'ไม่สังกัดภาควิชาใด'
}

export default checkUserDepartment