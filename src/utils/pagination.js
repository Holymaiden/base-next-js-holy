/**
 * @param {BigInteger} page
 * @param {BigInteger} limit
 * @param {BigInteger} dataLength
 * @returns {Object}
 * create paginate
 */
export default async function paginate(page = 1, limit = 5, dataLength) {
  let result = {};
  page = parseInt(page);
  limit = parseInt(limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = (page - 1) * limit + dataLength;

  result.currentPage = {
    page: page,
    limit: limit,
    startIndex,
    endIndex,
  };

  if (endIndex < dataLength) {
    result.nextPage = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 1) {
    result.previousPage = {
      page: page - 1,
      limit: limit,
    };
  }

  result.totalPage = Math.ceil(dataLength / limit);

  return result;
}
