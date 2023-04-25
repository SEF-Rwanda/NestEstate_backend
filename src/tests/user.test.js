import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";
import httpStatus from "http-status";
import { users } from "./userCases";
import dotenv from "dotenv";
import checkUserData from "../middlewares/checkUserData";
import checkEmailValidity from "../middlewares/checkEmailValidity";
import { properties } from "./propertiesCases";
import checkEnv from "../utils/checkTestEnv";

dotenv.config({ path: "./.env" });

const { expect } = chai;
chai.use(chaiHttp);

let user_id;
let token;

describe("0. Welcome", () => {
  it("should return welcome ", async () => {
    const res = await chai
      .request(app)
      .get("/")
      .set("Accept", "application/json");
    expect(res.body).to.be.an("object");
    expect(res.body.status).to.equal(httpStatus.OK);
    expect(res.status).to.equal(httpStatus.OK);
    expect(res.body.message).to.equal("Welcome to the Nest estate API");
  });
});

describe("1 . POST signup,/api/v1/users/signup", () => {
  it("User validation failed: firstName: First name is required!", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/signup")
      .set("Accept", "application/json")
      .send(users[0])
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.status).to.equal(500);
        expect(res.body.status).to.equal(500);
        expect(res.body.error).to.equal(
          "User validation failed: firstName: First name is required!"
        );
        done();
      });
  });

  it("User validation failed: lastName: last name is required!", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[1]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(500);
      expect(res.body.status).to.equal(500);
      expect(res.body.error).to.equal(
        "User validation failed: lastName: Last name is required!"
      );
    } catch (error) {
      console.error(error);
    }
  });

  it("User validation failed: mail: Email is required!", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[2]);

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(500);
      expect(res.body.status).to.equal(500);
      expect(res.body.error).to.equal(
        "User validation failed: email: Email is required!"
      );
    } catch (error) {
      console.error(error);
    }
  });
  it("User validation failed: email: Provide a valid email please!", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[3]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(500);
      expect(res.body.status).to.equal(500);
      expect(res.body.error).to.equal(
        "User validation failed: email: Provide a valid email please!"
      );
    } catch (error) {
      console.error(error);
    }
  });
  it("User created successfully", async () => {
    let otp;
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[4]);
      otp = res.body.data.otp;
      user_id = res.body.data._id;

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body.status).to.equal(httpStatus.CREATED);
      expect(res.body.message).to.equal(
        "User created successfully,proceed to verify you account"
      );
    } catch (error) {
      console.error(error);
    }
  });

  it("Account associated with this email already exists", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[5]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.CONFLICT);
      expect(res.body.status).to.equal(httpStatus.CONFLICT);
      expect(res.body.error).to.equal(
        "Account associated with this email already exists"
      );
    } catch (error) {
      console.error(error);
    }
  });

  it("Account associated with this phone already exists", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[6]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.CONFLICT);
      expect(res.body.status).to.equal(httpStatus.CONFLICT);
      expect(res.body.error).to.equal(
        "Account associated with this phone already exists"
      );
    } catch (error) {
      console.error(error.message);
    }
  });
});

describe("2 . POST signup,/api/v1/users/verifyEmail", () => {
  let otp;

  before(async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[7]);
      console.log(res?.body?.data?.otp);
      otp = res?.body?.data?.otp;
      token = res?.body?.data?.token;

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body.status).to.equal(httpStatus.CREATED);
      expect(res.body.message).to.equal(
        "User created successfully,proceed to verify you account"
      );
    } catch (error) {
      console.error(error);
    }
  });

  it("User token not found", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/verifyEmail")
        .set("authorization", token)
        .set("Accept", "application/json")
        .send({ opt: otp });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body.error).to.equal("No token found!");
    } catch (error) {
      console.error(error);
    }
  });

  it("You can not proceed without setting a valid token", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/verifyEmail")
        .set("authorization", `Bearer {token}`)
        .set("Accept", "application/json")
        .send({ opt: otp });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).to.equal(
        "You can not proceed without setting a valid token"
      );
    } catch (error) {
      console.error(error);
    }
  });
  it("You can not proceed without setting a valid token", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/verifyEmail")
        .set("authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ otp: "8900" });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.error).to.equal("Invalid code or has expired!.");
    } catch (error) {
      console.error(error);
    }
  });
  it("Email verified successfully!", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/verifyEmail")
        .set("authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ otp: otp });
      token = res.body.data;

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(200);
      expect(res.body.message).to.equal("Email verified successfully!");
    } catch (error) {
      console.error(error);
    }
  });
});

describe("2 . POST Login,/api/v1/users/login", () => {
  it("Successfully login", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/login")
        .set("Accept", "application/json")
        .send({ email: "ngirimanaschadrack@gmail.com", password: "12345678" });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).haveOwnProperty("token");
    } catch (error) {
      console.error(error);
    }
  });
  it("Incorrect  email ", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/login")
        .set("Accept", "application/json")
        .send({ email: "ngirimanaschdrack@gmail.com", password: "12345678" });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
    } catch (error) {
      console.error(error);
    }
  });
  it("incorrect password ", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/login")
        .set("Accept", "application/json")
        .send({ email: "ngirimanaschadrack@gmail.com", password: "123456789" });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
    } catch (error) {
      console.error(error);
    }
  });
  it("invalid email ", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/login")
        .set("Accept", "application/json")
        .send({
          email: "ngirimanaschadrackgmail.com",
          password: "12345678",
        });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
    } catch (error) {
      console.error(error);
    }
  });
  it("Unverified user ", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/login")
        .set("Accept", "application/json")
        .send({
          email: "chadrackngirimana@gmail.com",
          password: "12345678",
        });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body.error).to.equal("The user is not verified");
    } catch (error) {
      console.error(error);
    }
  });
});

describe("user unit test", () => {
  it("test empty firstName", () => {
    const actual = checkUserData(users[0]);
    expect(actual).to.equal(false);
  });
  it("test empty lastName", () => {
    const actual = checkUserData(users[1]);
    expect(actual).to.equal(false);
  });
  it("test empty email", () => {
    const actual = checkUserData(users[2]);
    expect(actual).to.equal(false);
  });

  it("test empty phone", () => {
    const actual = checkUserData(users[8]);
    expect(actual).to.equal(false);
  });
  it("correct data", () => {
    const actual = checkUserData(users[4]);
    expect(actual).to.equal(true);
  });
  it("Check  valid email", () => {
    const actual = checkEmailValidity(users[4]);
    expect(actual).to.equal(true);
  });
  it("Check  invalid email", () => {
    const actual = checkEmailValidity(users[10]);
    expect(actual).to.equal(false);
  });
  it("check if env is TEST", () => {
    const actual = checkEnv("TEST", "TEST");
    expect(actual).to.equal(true);
  });
  it("check if env is not TEST", () => {
    const actual = checkEnv("DEV", "TEST");
    expect(actual).to.equal(false);
  });
  it("check if env is not TEST", () => {
    const actual = checkEnv(undefined, "TEST");
    expect(actual).to.equal(false);
  });
});

describe("create property", () => {
  let token = null;
  before(async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/login")
        .set("Accept", "application/json")
        .send({
          email: "ngirimanaschadrack@gmail.com",
          password: "12345678",
        });
      token = res.body.token;

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).haveOwnProperty("token");
    } catch (error) {
      console.error(error);
    }
  });

  it("test create property successfully", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/properties")
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${token}`)
        .send(properties[0]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body.status).to.equal(httpStatus.CREATED);
      expect(res.body).has.property("data");
    } catch (error) {
      console.error(error);
    }
  });

  it("test create property without title", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/properties")
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${token}`)
        .send(properties[1]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.BAD_REQUEST);

      expect(res.body.error).to.equal("Title must be specified");
    } catch (error) {
      console.error(error);
    }
  });
  it("test create property without size", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/properties")
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${token}`)
        .send(properties[2]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.BAD_REQUEST);

      expect(res.body.error).to.equal("Size must be specified");
    } catch (error) {
      console.error(error);
    }
  });
});
describe("get properties", () => {
  it("get properties", async () => {
    try {
      const res = await chai
        .request(app)
        .get("/api/v1/properties")
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${token}`);

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);

      expect(res.body).haveOwnProperty("data");
    } catch (error) {
      console.error(error);
    }
  });
});

describe("3 . POST update profile,/api/v1/users/profile/:id", () => {
  it("User updated successfully", async () => {
    try {
      const res = await chai
        .request(app)
        .put(`/api/v1/users/profile/${user_id}`)
        .set("Accept", "application/json")
        .send(users[9]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal("User profile updated successfully");
    } catch (error) {
      console.error(error);
    }
  });
  it("User updated with invalid id", async () => {
    try {
      const res = await chai
        .request(app)
        .put(`/api/v1/users/profile/63ffd0082e32e9e7c8d223c2`)
        .set("Accept", "application/json")
        .send(users[9]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.error).to.equal("Something went wrong,please try again");
    } catch (error) {
      console.error(error);
    }
  });
});

describe("4 . GET all users,/api/v1/users", () => {
  let id = null;
  it("Should get all users", async () => {
    try {
      const res = await chai
        .request(app)
        .get(`/api/v1/users`)
        .set("Accept", "application/json");
      id = res.body.data[0]._id;

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal("All available users");
    } catch (error) {
      console.error(error);
    }
  });
  it("Should get user profile", async () => {
    try {
      const res = await chai
        .request(app)
        .get(`/api/v1/users/profile/${id}`)
        .set("Accept", "application/json");
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal("User profile retrieved successfully");
    } catch (error) {
      console.error(error);
    }
  });
  it("Should get user profile", async () => {
    try {
      const res = await chai
        .request(app)
        .get(`/api/v1/users/profile/63ffd0082e32e9e7c8d223c2`)
        .set("Accept", "application/json");
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.error).to.equal("Something went wrong,please try again");
    } catch (error) {
      console.error(error);
    }
  });
  it("Logout", async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/logout`)
        .set("Accept", "application/json");
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      // expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal("Logged out successfully"); //
    } catch (error) {
      console.error(error);
    }
  });
});

describe("forgot and reset", () => {
  let resetToken = null;
  it("Forgot password with valid email", async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/forgotPassword`)
        .set("Accept", "application/json")
        .send({ email: "ngirimanaschadrack@gmail.com" });
      resetToken = res.body.resetToken;

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal("Token sent to email!");
    } catch (error) {
      console.error(error);
    }
  });
  it("Forgot password with invalid email", async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/forgotPassword`)
        .set("Accept", "application/json")
        .send({ email: "ngirimanaschadrak@gmail.com" });
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body.error).to.equal("There is no user with email address.");
    } catch (error) {
      console.error(error);
    }
  });
  it("reset password with valid token", async () => {
    try {
      const res = await chai
        .request(app)
        .patch(`/api/v1/users/resetPassword/${resetToken}`)
        .set("Accept", "application/json")
        .send({ password: "1234567890", passwordConfirm: "1234567890" });

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal("Password reset successfully");
    } catch (error) {
      console.error(error);
    }
  });
  it("reset password with invalid token", async () => {
    try {
      const res = await chai
        .request(app)
        .patch(`/api/v1/users/resetPassword/{resetToken}`)
        .set("Accept", "application/json")
        .send({ password: "1234567890", passwordConfirm: "1234567890" });

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body.error).to.equal("Token is invalid or has expired");
    } catch (error) {
      console.error(error);
    }
  });
});
describe("Payment", () => {
  it("Make payment", async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/payments/create-checkout-session`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${token}`)
        .send({
          property: {
            property: {
              title: "Furnished Rent",
              category: "Rent",
              section: "for sale",
              price: 1000,
              size: "200",
              upi: "12/03/45/672",
              description: "A furnished house for rent at Kanombe",
              mainImage:
                "https://images.unsplash.com/photo-1591280063444-d3c514eb6e13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
              otherImages: [
                "https://images.unsplash.com/photo-1591738802175-709fedef8288?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
                "https://images.unsplash.com/photo-1591738802175-709fedef8288?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
              ],
            },
          },
        });

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body).haveOwnProperty("url");
    } catch (error) {
      console.error(error);
    }
  });
  it("View all payments", async () => {
    try {
      const res = await chai
        .request(app)
        .get(`/api/v1/payments/view-all-payments`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${token}`);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      
    } catch (error) {
      console.error(error);
    }
  });
  it("View my payments", async () => {
    try {
      const res = await chai
        .request(app)
        .get(`/api/v1/payments/view-my-payments`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${token}`);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      
    } catch (error) {
      console.error(error);
    }
  });
});
