import { describe, expect, test } from "bun:test";
import { contactSchema, contactPayload, transactionalPayload } from "./contact-schema";

const input = {
  name: "Prueba Cloro", email: "contact-test@example.com", company: "Empresa de prueba",
  message: "Mensaje de prueba de contacto", website: "", submissionId: "ad03a75f-b72b-48cb-86b6-b4364b094450",
};

describe("Contact delivery rules", () => {
  test("sends the chosen template to Elena", () => {
    expect(transactionalPayload(contactSchema.parse(input))).toMatchObject({
      email: "elena@tertie.co", transactionalId: "cmvgrblm2027j0j1wvksob5f5",
    });
  });
  test("replies go to the sender", () => {
    expect(transactionalPayload(contactSchema.parse(input)).replyTo).toBe(input.email);
  });
  test("passes the four requested template variables", () => {
    expect(transactionalPayload(contactSchema.parse(input)).dataVariables).toEqual({
      name: input.name, email: input.email, company: input.company, message: input.message,
    });
  });
  test("sets contact source without marketing opt-in", () => {
    expect(contactPayload(contactSchema.parse(input))).toEqual({
      email: input.email, firstName: input.name, source: "contact-form", subscribed: false,
    });
  });
  test("retains honeypot input for server rejection", () => {
    expect(contactSchema.parse({ ...input, website: "spam.example" }).website).toBe("spam.example");
  });
  test("rejects invalid sender addresses", () => {
    expect(contactSchema.safeParse({ ...input, email: "not-an-email" }).success).toBe(false);
  });
});