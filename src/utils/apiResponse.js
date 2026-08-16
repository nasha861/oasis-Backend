const sendSuccess = (res, data, message = '', statusCode = 200, meta) => {
  const payload = {
    success: true,
    data,
    message
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess };
