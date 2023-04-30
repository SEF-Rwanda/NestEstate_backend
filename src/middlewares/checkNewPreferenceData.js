/* eslint-disable consistent-return */
import httpStatus from "http-status";
import Response from "../utils/Response";

const checkNewPreferenceData = (req, res, next) => {
  const { category, size, price } = req.body;
  if (category === undefined || category === "") {
    return Response.errorMessage(
      res,
      "Category must be specified",
      httpStatus.BAD_REQUEST
    );
  }
  if (size === undefined || size === "") {
    return Response.errorMessage(
      res,
      "Size must be specified",
      httpStatus.BAD_REQUEST
    );
  }
  if (price === undefined || price === null) {
    return Response.errorMessage(
      res,
      "Price must be specified",
      httpStatus.BAD_REQUEST
    );
  }
  next();
};

export default checkNewPreferenceData;
