import chai from "chai";
import chaiHttp from "chai-http";
import { MongoMemoryServer } from "mongodb-memory-server";

const { expect } = chai;
chai.use(chaiHttp);

let mongoServer;

before(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
});

describe("Example test", () => {
  it('should return "Hello, world!"', (done) => {
    chai
      .request("http://localhost:3000")
      .get("/")
      .end((err, res) => {
        chai.expect(res.text).to.equal("Hello, world!");
        done();
      });
  });
});

after(() => {
  mongoServer.stop();
});
