const request = require("supertest");
const app = require("../index"); // your Express app

describe("User API", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should login user and return token", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });
});
