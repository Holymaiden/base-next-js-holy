import prisma from "../../../src/utils/prisma";
import message from "../../../src/utils/response";
import paginate from "../../../src/utils/pagination";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page, limit, search } = req.query;
      const { filter, status } = req.query;

      const searchQuery = search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {};
      const filterQuery =
        filter && filter !== "all"
          ? {
              role: filter,
            }
          : {};
      const statusQuery =
        status && status != "all"
          ? {
              status: status,
            }
          : {};

      const count = await prisma.user.count({
        where: {
          ...searchQuery,
          ...filterQuery,
          ...statusQuery,
        },
      });

      const paginateResult = await paginate(page, limit, count);

      const users = await prisma.user.findMany({
        where: {
          ...searchQuery,
          ...filterQuery,
          ...statusQuery,
        },
        skip: paginateResult.currentPage.startIndex - 1,
        take: paginateResult.currentPage.limit,
        orderBy: {
          CreatedAt: req.query.order,
        },
      });

      return message.success(res, users, paginateResult);
    } catch (error) {
      return message.error(res, error.message);
    }
  } else if (req.method === "POST") {
    try {
      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          role: req.body.role,
        },
      });
      return message.success(res, user);
    } catch (error) {
      return message.error(res, error.message);
    }
  }

  return message.error(res, "Method not allowed");
}
