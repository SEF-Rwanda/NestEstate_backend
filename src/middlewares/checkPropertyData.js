/* eslint-disable consistent-return */
import httpStatus from 'http-status';
import Response from '../utils/Response';

const checkProperty = (req, res, next) => {
  const {
    title, description, size, category, price, upi,
  } = req.body;
  if (title === undefined || title === '') {
    return Response.errorMessage(
      res,
      'Title must be specified',
      httpStatus.BAD_REQUEST,
    );
  } if (size === undefined || size === '') {
    return Response.errorMessage(
      res,
      'Size must be specified',
      httpStatus.BAD_REQUEST,
    );
  } if (description === undefined || description === '') {
    return Response.errorMessage(
      res,
      'Description must be specified',
      httpStatus.BAD_REQUEST,
    );
  } if (category === undefined || category === '') {
    return Response.errorMessage(
      res,
      'Category must be specified',
      httpStatus.BAD_REQUEST,
    );
  } if (price === undefined || price === 0 || price === '') {
    return Response.errorMessage(
      res,
      'Price must be specified',
      httpStatus.BAD_REQUEST,
    );
  } if (upi === undefined || upi === '') {
    return Response.errorMessage(
      res,
      'UPI must be specified',
      httpStatus.BAD_REQUEST,
    );
  }
  next();
};

export default checkProperty;
