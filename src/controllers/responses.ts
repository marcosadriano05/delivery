import { HttpResponse } from "./controller.ts";

export const badRequest = (message: string): HttpResponse => ({
  statusCode: 400,
  body: { message },
});

export const serverError = (message: string): HttpResponse => ({
  statusCode: 400,
  body: { message },
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
