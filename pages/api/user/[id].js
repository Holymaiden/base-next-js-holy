import prisma from "../../../src/utils/prisma";
import message from "../../../src/utils/response";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findUnique({
        where: {
          id: parseInt(req.query.id),
          DeletedAt: null,
        },
      });
      return message.success(res, users);
    } catch (error) {
      return message.error(res, error.message);
    }
  } else if (req.method === "PUT") {
    try {
      const users = await prisma.user.update({
        where: {
          id: parseInt(req.query.id),
        },
        data: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          role: req.body.role,
          status: req.body.status,
        },
      });
      return message.success(res, users);
    } catch (error) {
      return message.error(res, error.message);
    }
  } else if (req.method === "DELETE") {
    try {
      const users = await prisma.user.delete({
        where: {
          id: parseInt(req.query.id),
        },
      });
      return message.success(res, users);
    } catch (error) {
      return message.error(res, error.message);
    }
  }

  return message.error(res, "Method not allowed");
}
