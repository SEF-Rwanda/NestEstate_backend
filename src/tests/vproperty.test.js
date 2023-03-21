import chai from "chai";
import chaiHttp from "chai-http";
import { MongoMemoryServer } from "mongodb-memory-server";
import HttpStatus from "http-status";
import app from "../index";
import httpStatus from "http-status";
import { properties } from "./propertyCases";
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


describe("5 . GET all properties,/api/v1/properties", () => {
  it("should retrieve all properties", async () => {
    
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/properties`)
        .set("Accept", "application/json");

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal(
        "Property retrieved successfully!"
      );
    } catch (error) {
      console.error(error);
    }
  });
});

describe("6 . POST update property,/api/v1/properties/:id", () => {
  it("Property updated successfully", async () => {
    
    try {
      const property_id ="640741450d18e5190ff61a22";
      const res = await chai
        .request(app)
        .post(`/api/v1/properties/${property_id}`)
        .set("Accept", "application/json")
        .send(properties[0]);

      expect(res.body).to.be.an("object");
      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal(
        "Property updated successfully!"
      );
    } catch (error) {
      console.error(error);
    }
  });
});

after(() => {
  mongoServer.stop();
});
