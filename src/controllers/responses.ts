import { HttpResponse } from "./controller.ts";

export const badRequest = (message: string): HttpResponse => ({
  statusCode: 400,
  body: { message },
});

export const notFound = (message: string): HttpResponse => ({
  statusCode: 404,
  body: { message },
});

export const serverError = (_error?: Error): HttpResponse => ({
  statusCode: 500,
  body: { message: "Server error." },
});

// deno-lint-ignore no-explicit-any
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (message: string): HttpResponse => ({
  statusCode: 201,
  body: { message },
});
