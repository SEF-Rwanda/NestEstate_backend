const checkUserData = (user) => {
  if (
    user.firstName === "" ||
    user.firstName === undefined ||
    user.LastName === "" ||
    user.lastName === undefined ||
    user.email === "" ||
    user.email === undefined ||
    user.phone === "" ||
    user.phone === undefined
  ) {
    return false;
  }
  return true;
};

export default checkUserData;
