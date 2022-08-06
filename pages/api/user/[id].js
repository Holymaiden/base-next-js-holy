import prisma from "../../../src/utils/prisma";
import message from "../../../src/utils/response";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      const form = formidable({ multiples: false });
      return form.parse(req, async (err, fields, files) => {
        if (err) return message.error(res, err.message);

        if (files) {
          fields.image = await saveFile(files.image, "avatar");
        }
        const users = await prisma.user.update({
          where: {
            id: parseInt(req.query.id),
          },
          data: {
            name: fields.name,
            email: fields.email,
            phone: fields.phone,
            role: fields.role,
            status: fields.status,
          },
        });
        return message.success(res, users);
      });
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
