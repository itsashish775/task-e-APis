const request = require("supertest");
const app = require("../index"); // adjust if app is in another file
const { Task } = require("../models");

let token; // mock JWT token
let createdTaskId;

beforeAll(async () => {
  // Mock user auth -> You can replace with real JWT if auth middleware validates it
  token = "mocked-jwt-token";
});

// Mock req.user injection
jest.mock("../middlewares/auth", () => (req, res, next) => {
  req.user = { id: 1 }; // fake user
  next();
});

describe("Task APIs", () => {
  // CREATE
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Task description",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.task).toHaveProperty("id");
    expect(res.body.message).toBe("Task created successfully"); // from messages.TASK_CREATED
    createdTaskId = res.body.data.task.id;
  });

  // LIST (with pagination)
  it("should list tasks with pagination", async () => {
    const res = await request(app)
      .get("/api/tasks?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("data");
    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  // LIST (with search)
  it("should search tasks by title/description", async () => {
    const res = await request(app)
      .get("/api/tasks?search=Test")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.data.length).toBeGreaterThan(0);
  });

  // GET BY ID
  it("should get a task by ID", async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.id).toBe(createdTaskId);
  });

  // UPDATE
  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.title).toBe("Updated Task");
  });

  // DELETE
  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  // GET after delete -> should fail
  it("should return 404 for deleted task", async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  // Cleanup test data (optional)
  await Task.destroy({ where: { user_id: 1 } });
});
