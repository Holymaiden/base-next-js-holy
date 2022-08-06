import prisma from "../../../src/utils/prisma";
import message from "../../../src/utils/response";
import jsonwebtoken from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return message.error(res, "Method not allowed");

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
        password: req.body.password,
        DeletedAt: null,
      },
    });
    if (!user) return message.error(res, "User not found");

    const accessToken = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
        status: user.status,
      },
      "123",
      {
        expiresIn: "1d",
      }
    );
    return message.success(res, { user, accessToken });
  } catch (error) {
    return message.error(res, error.message);
  }
}
