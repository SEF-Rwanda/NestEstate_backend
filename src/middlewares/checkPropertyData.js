import Response from "../utils/Response";
import httpStatus from "http-status";

const checkProperty = (req, res, next) => {
  const { title, description, size } = req.body;
  if (title === undefined || title === "") {
    return Response.errorMessage(
      res,
      "Title must be specified",
      httpStatus.BAD_REQUEST
    );
  } else if (size === undefined || size === "") {
    return Response.errorMessage(
      res,
      "Size must be specified",
      httpStatus.BAD_REQUEST
    );
  }
  next();
};

export default checkProperty;


