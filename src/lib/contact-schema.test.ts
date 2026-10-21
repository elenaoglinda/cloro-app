import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { contactSchema, contactPayload, transactionalPayload } from "./contact-schema";

const input = {
  name: "Prueba Cloro", email: "contact-test@example.com", company: "Empresa de prueba",
  message: "Mensaje de prueba de contacto", website: "", submissionId: "ad03a75f-b72b-48cb-86b6-b4364b094450",
};

describe("Contact delivery rules", () => {
  test("sends the chosen template to Elena", () => {
    const payload = transactionalPayload(contactSchema.parse(input));
    assert.equal(payload.email, "elena@tertie.co");
    assert.equal(payload.transactionalId, "cmvgrblm2027j0j1wvksob5f5");
  });
  test("replies go to the sender", () => {
    assert.equal(transactionalPayload(contactSchema.parse(input)).replyTo, input.email);
  });
  test("passes the four requested template variables", () => {
    assert.deepEqual(transactionalPayload(contactSchema.parse(input)).dataVariables, {
      name: input.name, email: input.email, company: input.company, message: input.message,
    });
  });
  test("sets contact source without marketing opt-in", () => {
    assert.deepEqual(contactPayload(contactSchema.parse(input)), {
      email: input.email, firstName: input.name, source: "contact-form", subscribed: false,
    });
  });
  test("retains honeypot input for server rejection", () => {
    assert.equal(contactSchema.parse({ ...input, website: "spam.example" }).website, "spam.example");
  });
  test("rejects invalid sender addresses", () => {
    assert.equal(contactSchema.safeParse({ ...input, email: "not-an-email" }).success, false);
  });
});