import { HttpResponse } from "./controller.ts";
import { ValidationError } from "./validation_error.ts";
import { FindPartnerError } from "../domain/find_nearest_partner.ts";
import { badRequest, notFound, serverError } from "./responses.ts";

export function responseFromError(error: Error): HttpResponse {
  if (error instanceof ValidationError) {
    return badRequest(error.message);
  }
  if (error instanceof FindPartnerError) {
    return notFound(error.message);
  }
  return serverError(error);
}
