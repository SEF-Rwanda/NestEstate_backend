import bcrypt from "bcryptjs";
/**
 * @export
 * @class HashedPassword
 */
class HashPassword {
  /**
   * Encrypt password
   * @static
   * @param {object} password password
   * @memberof HashPassword
   * @returns {object} hashedPassword
   */
  static hashPassword(password) {
    const hashedPassword = bcrypt.hash(password, 10);
    return hashedPassword;
  }
}

export default HashPassword;
