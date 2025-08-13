export const setValidQueryPagination = (reqQuery, paginationDefaultData) => {
  let { page, perPage } = paginationDefaultData
  let applyPagination = false
  if (reqQuery.page) {
    applyPagination = true
    if (reqQuery.page >= 0) page = parseInt(reqQuery.page)
  }
  if (reqQuery.perPage) {
    applyPagination = true
    if (reqQuery.perPage > 0) perPage = parseInt(reqQuery.perPage)
  }

  if (applyPagination) {
    reqQuery.page = page
    reqQuery.perPage = perPage
  }
  console.log(reqQuery)

  return reqQuery
}
