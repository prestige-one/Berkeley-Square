import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { bsqWebhookPayload } from "../lib/lead-webhook.mjs";
import { bsqValidateLead } from "../lib/validation.js";
let server,
  portal,
  base,
  captured,
  portalStatus = 200;
before(async () => {
  portal = http.createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    captured = { headers: req.headers, body: JSON.parse(body) };
    res.writeHead(portalStatus);
    res.end("{}");
  });
  portal.listen(0, "127.0.0.1");
  await once(portal, "listening");
  process.env.NODE_ENV = "test";
  process.env.BSQ_LEAD_WEBHOOK_URL = `http://127.0.0.1:${portal.address().port}/leads`;
  process.env.BSQ_LEAD_WEBHOOK_TOKEN = "test-only-token";
  process.env.BSQ_FORM_TOKEN_SECRET = "test-only-form-secret";
  const { bsqHandleRequest } = await import("../lib/lead-handler.mjs");
  server = http.createServer(bsqHandleRequest);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((done) => server.close(done));
  await new Promise((done) => portal.close(done));
});
const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  phone: "+971500000000",
  country: "ae",
  callingCode: "+971",
  consent: true,
  source: "modal",
  intent: "Brochure request",
  referrer: "https://example.com/?utm_source=test",
  message: "Please send the brochure.",
};
async function token() {
  return (await (await fetch(base + "/api/form-token")).json()).token;
}
async function submit(body) {
  return fetch(base + "/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
test("signed form token and authenticated portal delivery preserve Berkeley Square", async () => {
  const response = await submit({
    ...valid,
    project_interest: "Other",
    formToken: await token(),
  });
  assert.equal(response.status, 201);
  assert.equal(captured.body.project_interest, "Berkeley Square");
  assert.equal(captured.body.email, valid.email);
  assert.equal(captured.body.intent, "Brochure request");
  assert.equal(captured.headers.authorization, "Bearer test-only-token");
  assert(captured.headers["idempotency-key"]);
});
test("forged and replayed tokens are rejected", async () => {
  assert.equal((await submit({ ...valid, formToken: "forged" })).status, 403);
  const signed = await token();
  const body = { ...valid, email: "second@example.com", formToken: signed };
  assert.equal((await submit(body)).status, 201);
  assert.equal((await submit(body)).status, 403);
});
test("invalid fields, missing consent and cross-origin submissions fail", async () => {
  for (const changes of [
    { email: "bad" },
    { consent: false },
    { phone: "letters" },
  ])
    assert.equal(
      (await submit({ ...valid, ...changes, formToken: await token() })).status,
      400,
    );
  const r = await fetch(base + "/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://other.example",
    },
    body: JSON.stringify(valid),
  });
  assert.equal(r.status, 403);
});
test("portal failure is visible and cannot report successful delivery", async () => {
  portalStatus = 503;
  const response = await submit({
    ...valid,
    email: "failure@example.com",
    formToken: await token(),
  });
  assert.equal(response.status, 502);
  assert.equal((await response.json()).portalStatus, 503);
  portalStatus = 200;
});
test("server fixes the project name and shared validation rejects unsafe content", () => {
  assert.equal(
    bsqWebhookPayload({ project_interest: "Other" }).project_interest,
    "Berkeley Square",
  );
  assert(bsqValidateLead({ ...valid, message: "<script>alert(1)</script>" }));
  assert.equal(bsqValidateLead(valid), "");
});
