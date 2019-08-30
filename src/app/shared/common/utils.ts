export const appendSearchKeyword = (keyword) => {
    return (keyword && keyword.trim().length>0 ? '/' + keyword : '')
}


export default { appendSearchKeyword };