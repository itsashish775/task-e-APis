const request = require("supertest");
const app = require("../index");

describe("Task API", () => {
  let token;
  let taskId;

  beforeAll(async () => {
    // Login to get JWT
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com", password: "password123" });

    token = res.body.token;
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My First Task", description: "Do something" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    taskId = res.body.id;
  });

  it("should get a task by id", async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "My First Task");
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Task Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Updated Task Title");
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
