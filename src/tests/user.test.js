const request = require("supertest");
const app = require("../index"); // <-- ensure you export app from index.js or app.js
const { User } = require("../models");
const messages = require("../constants/messages");

beforeAll(async () => {
  // Clear users before running tests
  await User.destroy({ where: {} });
});

describe("User API", () => {
  const testUser = {
    name: "Ashish",
    email: "ashish@example.com",
    password: "password123",
  };

  let token;

  // ---- Register ----
  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send(testUser);
    console.log(res.body,"============>");

    expect(res.statusCode).toBe(201);
    // expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(messages.USER_REGISTERED);
    expect(res.body.id).toHaveProperty("id");
    expect(res.body.data.email).toBe(testUser.email);
  });

  it("should not allow duplicate registration", async () => {
    const res = await request(app).post("/api/users/register").send(testUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(messages.EMAIL_ALREADY_REGISTERED);
  });

  // ---- Login ----
  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(messages.LOGIN_SUCCESS);
    expect(res.body.data).toHaveProperty("token");

    token = res.body.data.token;
  });

  it("should not login with wrong password", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: "wrongPassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(messages.INVALID_CREDENTIALS);
  });

  it("should not login with unregistered email", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "unknown@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(messages.INVALID_CREDENTIALS);
  });
});
