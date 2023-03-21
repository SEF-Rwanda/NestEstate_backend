import chai from "chai";
import chaiHttp from "chai-http";
import { MongoMemoryServer } from "mongodb-memory-server";
import HttpStatus from "http-status";
import app from "../index";
import httpStatus from "http-status";
import { users } from "./userCases";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
let verificationToken;
var opt;

const { expect } = chai;
chai.use(chaiHttp);

let mongoServer;

before(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
}, 30000);

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
      console.log(res.body.data.otp);
      otp = res.body.data.otp;

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
      expect(res.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).to.equal(
        'E11000 duplicate key error collection: test.users index: phone_1 dup key: { phone: "0781475108" }'
      );
    } catch (error) {
      console.error(error.message);
    }
  });
});

describe("2 . POST signup,/api/v1/users/verifyEmail", () => {
  let otp;
  let token;
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

  it("User token not found", async () => {
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
});

describe("3 . POST update profile,/api/v1/users/profile/:id", () => {
  it("User updated successfully", async () => {
    
    try {
      const user_id ="6400571004cd83971fecc8f5" //req.params.id;
      const res = await chai
        .request(app)
        .post(`/api/v1/users/profile/${user_id}`)
        .set("Accept", "application/json")
        .send(users[8]);

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal(
        "User updated successfully!"
      );
    } catch (error) {
      console.error(error);
    }
  });
});

describe("4 . POST get all users,/api/v1/users", () => {
  it("Should get all users", async () => {
    
    try {
      const res = await chai
        .request(app)
        .get(`/api/v1/users`)
        .set("Accept", "application/json")

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal(
        "Users retrieved successfully!"
      );
    } catch (error) {
      console.error(error);
    }
  });
});

after(() => {
  mongoServer.stop();
});
