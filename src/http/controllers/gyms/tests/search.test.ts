import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gyms by name", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Academia do Junior",
        description: "Academia do Junior",
        phone: "123456789",
        latitude: -8.0413385,
        longitude: -34.8973593,
    })

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Academia do Zé",
        description: "Academia do Zé",
        phone: "123456789",
        latitude: -8.0413385,
        longitude: -34.8973593,
      })

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "Academia do Junior",
        page: 1
      })
      .set("Authorization", `Bearer ${token}`)
      .send()
    
    
    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: "Academia do Junior"
      })
    ])
  })
})