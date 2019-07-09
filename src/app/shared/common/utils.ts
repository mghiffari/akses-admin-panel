export const appendSearchKeyword = (keyword) => {
    return (keyword && keyword.trim().length>0 ? '/' + keyword : keyword)
}


export default { appendSearchKeyword };