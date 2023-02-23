import EmailTemplate from "./EmailTemplate";
import sendGrid from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const { SENDGRID_API_KEY } = process.env;
sendGrid.setApiKey(SENDGRID_API_KEY);
/**
 * @export
 * @class Email
 */
class Email {
  /**
   * verify email
   * @static
   * @param {Object} req the template to use
   * @param {Object} user the template to use
   * @returns {Object} send Email to the buyer
   */

  static async verificationEmail(req, user) {
    const msg = EmailTemplate.userVerificationEmail(req, user);
    try {
      await sendGrid.send(msg);
      console.log("email sent");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default Email;
