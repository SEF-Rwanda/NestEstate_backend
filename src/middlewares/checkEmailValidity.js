import validator from "validator";

const checkEmailValidity = (user) => {
  if (validator.isEmail(user.email)) {
    return true;
  } else {
    return false;
  }
};

export default checkEmailValidity;
