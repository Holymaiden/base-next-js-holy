/**
 *
 * @param {object} res
 * @param {object} data
 * @param {object} meta
 * @returns {JSON}
 */

const success = (res, data, meta) => {
  return res.status(200).json({
    code: res.statusCode,
    message: "Success",
    data: data,
    meta: meta,
  });
};

const created = (res, data) => {
  return res.status(201).json({
    code: res.statusCode,
    message: "Created",
    data: data,
  });
};

const duplicate = (res, data) => {
  return res.status(209).json({
    code: res.statusCode,
    message: "Duplicate",
    data: data,
  });
};

const error = (res, data) => {
  return res.status(400).json({
    code: res.statusCode,
    message: "Error",
    data: data,
  });
};

const notFound = (res, data) => {
  return res.status(404).json({
    code: res.statusCode,
    message: "Not Found",
    data: data,
  });
};

const unauthorized = (res, data) => {
  return res.status(401).json({
    code: res.statusCode,
    message: "Unauthorized",
    data: data,
  });
};

const loginTimeout = (res, data) => {
  return res.status(440).json({
    code: res.statusCode,
    message: "Login Timeout",
    data: data,
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  success,
  created,
  duplicate,
  error,
  notFound,
  unauthorized,
  loginTimeout,
};
