import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const { SENDGRID_SENDER } = process.env;

/**
 * @export
 * @class EmailTemplate
 */
class EmailTemplate {
  /**
   * register a new
   * @static
   * @param {Object} req request object
   * @param {Object} user user
   * @returns {Object} Verification Email template for consumers
   */
  static userVerificationEmail(req, user) {
    return {
      to: user.email,
      subject: "Verify email",
      from: SENDGRID_SENDER,
      html: `<div style="position: absolute; width: 100%; height: 100%; background-color: #f4f4f4;">
      <div style="display: flex; height: 120px; font-size: 25px;">
      <div>
      <h3 style="color: #6736CF; margin-left: 20px; font-weight: 900;">NestEstate LTD</h3>
      </div>
      </div>
      <div style="height: 60%; margin: auto; width: 94%; text-align: left; background-color: #ffff; -webkit-box-shadow: 5px 5px 5px 5px black; -moz-box-shadow: 5px 5px 5px 5px black; box-shadow: 5px 5px 5px 5px black;">
      <div style="height: 65%; padding: 10px;">
      <p>Hi ${user.firstName},</p>
      <p>NestEstate LTD needs to verify your email address associated with the account created.</p>
      <p>To verify your email address, use the code below.</p>
      <p>This code expires in 10 minutes after the original verification request</p>
      <h1>${user.otp}</h1>
      </div>
      <div style="background-color: #f4f4f4; height: 25%; width: 100%; float: bottom; padding: 10px;">
      <p>If you have any issue, please reach out to us via our support email <a href="mailto:${SENDGRID_SENDER}" target="_self"> NestEstate LTD</a></p>
      </div>
      </div>
      </div>`,
    };
  }

  static userResetPasswordEmail(req, user, token) {
    return {
      to: user.email,
      subject: "Reset your password",
      from: SENDGRID_SENDER,
      token: token,

      html: `<p>HI ${user.firstName},</p>
            <p>Please click on this link to create a new password : ${token} </p>`,
    };
  }

  /**
   * register a new
   * @static
   * @param {Object} user request object
   * @param {String} property id
   
   */
  static newPropertyEmail(user, propertyId) {
    return {
      to: user.email,
      subject: "Preferred property has been added",
      from: SENDGRID_SENDER,
      html: `<div style="position: absolute; width: 100%; height: 100%; background-color: #f4f4f4;">
      <div style="display: flex; height: 120px; font-size: 25px;">
      <div>
      <h3 style="color: #6736CF; margin-left: 20px; font-weight: 900;">NestEstate LTD</h3>
      </div>
      </div>
      <div style="height: 60%; margin: auto; width: 94%; text-align: left; background-color: #ffff; -webkit-box-shadow: 5px 5px 5px 5px black; -moz-box-shadow: 5px 5px 5px 5px black; box-shadow: 5px 5px 5px 5px black;">
      <div style="height: 65%; padding: 10px;">
      <p>Hi ${user.firstName},</p>
      <p>NestEstate LTD want to let you know that property march your preference has been added</p>
      <p>To navigate to it , use the link below.</p>
      <a href="http://localhost:3000/all-properties/${propertyId}">http://localhost:3000/all-properties/${propertyId}</a>
      </div>
      <div style="background-color: #f4f4f4; height: 25%; width: 100%; float: bottom; padding: 10px;">
      <p>If you have any issue, please reach out to us via our support email <a href="mailto:${SENDGRID_SENDER}" target="_self"> NestEstate LTD</a></p>
      </div>
      </div>
      </div>`,
    };
  }
}

export default EmailTemplate;
