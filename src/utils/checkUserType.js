function checkUserType(user) {
    if(user.is_admin)
        return 'แอดมิน'
    if(user.groups.length !== 0 && user.groups[0].is_staff)
        return 'หัวหน้าภาควิชา'
    return 'อาจารย์'
}

export default checkUserType