import chai from "chai";
import chaiHttp from "chai-http";
import { MongoMemoryServer } from "mongodb-memory-server";
import HttpStatus from "http-status";
import app from "../index";
import httpStatus from "http-status";
import { users } from "./userCases";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const { expect } = chai;
chai.use(chaiHttp);

let mongoServer;

before(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const mongoUri = mongoServer.getUri();
  console.log("###################" + mongoUri);

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
  it("User validation failed: firstName: First name is required!", async () => {
    try {
      const res = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .set("Accept", "application/json")
        .send(users[0]);
      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(500);
      expect(res.body.status).to.equal(500);
      expect(res.body.error).to.equal(
        "User validation failed: firstName: First name is required!"
      );
    } catch (error) {
      console.error(error);
    }
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
});

after(() => {
  mongoServer.stop();
});
