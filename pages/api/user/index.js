import prisma from "../../../src/utils/prisma";
import message from "../../../src/utils/response";
import paginate from "../../../src/utils/pagination";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    return get(req, res);
  } else if (req.method === "POST") {
    return post(req, res);
  }

  return message.error(res, "Method not allowed");
}

const get = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const { filter, status } = req.query;

    const searchQuery = search
      ? {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
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
        DeletedAt: null,
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
};

const post = async (req, res) => {
  try {
    const form = formidable({ multiples: false });
    return form.parse(req, async (err, fields, files) => {
      if (err) return message.error(res, err.message);

      fields.image = await saveFile(files.image, "avatar");
      const user = await prisma.user.create({
        data: {
          name: fields.name,
          email: fields.email,
          password: fields.password,
          phone: fields.phone,
          role: fields.role,
          image: fields.image,
        },
      });
      return message.success(res, user);
    });
  } catch (error) {
    return message.error(res, error.message);
  }
};

const saveFile = async (file, folder) => {
  const data = fs.readFileSync(file._writeStream.path);
  fs.writeFileSync(
    `./public/${folder}/${
      file.newFilename + "." + file.mimetype.split("/")[1]
    }`,
    data
  );
  await fs.unlinkSync(file._writeStream.path);
  return file.newFilename + "." + file.mimetype.split("/")[1];
};
