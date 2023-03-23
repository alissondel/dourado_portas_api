export default async function Paginate(count, perPage, currentPage) {
  const pagesCount = await Math.ceil(count / perPage);

  return { perPage, currentPage, count, pagesCount };
}
