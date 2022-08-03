import prisma from "../../../src/utils/prisma";
import message from "../../../src/utils/response";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findUnique({
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
