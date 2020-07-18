const request = require("supertest");
const app = require("../server");

describe("users api", function () {
  it("fetch all users", function (done) {
    request(app).get("/api/users").expect(200, done);
  });
});
