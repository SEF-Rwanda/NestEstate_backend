import chai from "chai";
import chaiHttp from "chai-http";
import { MongoMemoryServer } from "mongodb-memory-server";
import HttpStatus from "http-status";
import app from "../index";
import httpStatus from "http-status";

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

after(() => {
  mongoServer.stop();
});
