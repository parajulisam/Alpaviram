const errorHandler = (err, req, res, next) => {
  console.log(res.statusCode);
  // sometimes 500 error is shown as 200
  // if status code is not 200 then leave it as it is
  // else set it to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);

  console.log("In error handler middleware");
  console.log(err);

  // this will be set in data property (of error.response)
  res.json({
    message: err.message,
    // stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
