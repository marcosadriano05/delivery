import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { badRequest, created, serverError } from "../responses.ts";

export class SaveController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const validationErrorResponse = validateParams(req.body);
      if (validationErrorResponse) {
        return validationErrorResponse;
      }
      await this.repository.save(req.body);
      return created("Partner created.");
    } catch (error) {
      return serverError(error);
    }
  }
}

function validateParams(body: any): HttpResponse | null {
  const requiredParamsString = ["tradingName", "ownerName", "document"];
  const requiredParamsObject = ["address", "coverageArea"];
  if (body === undefined || Object.keys(body).length === 0) {
    return badRequest(
      "Body params required: tradingName, ownerName, document, address, coverageArea.",
    );
  }
  for (const param of requiredParamsString) {
    if (body[param] === undefined) {
      return badRequest(
        "Body params required: tradingName, ownerName, document, address, coverageArea.",
      );
    }
    if (typeof body[param] !== "string") {
      return badRequest(
        "Body params should be strings: tradingName, ownerName, document.",
      );
    }
  }
  for (const param of requiredParamsObject) {
    if (
      body[param] === undefined ||
      Object.keys(body[param]).length === 0
    ) {
      return badRequest(
        `Body params required to ${param}: type, coordinates.`,
      );
    }
  }
  for (const param of requiredParamsObject) {
    if (
      body[param].type === undefined ||
      typeof body[param].type !== "string"
    ) {
      return badRequest(
        `Body params type to ${param} should be string.`,
      );
    }
  }
  if (!checkIfAddressCoordinatesIsValid(body.address.coordinates)) {
    return badRequest(
      "Body param address.coordinates must be empty array or an array of numbers.",
    );
  }
  if (
    !checkIfCoverageAreaCoordinatesIsValid(
      body.coverageArea.coordinates,
    )
  ) {
    return badRequest(
      "Body param coverageArea.coordinates must be empty array or an number[][][][].",
    );
  }
  return null;
}

function checkIfAddressCoordinatesIsValid(coordinates: any): boolean {
  if (Array.isArray(coordinates)) {
    if (
      coordinates.length === 0 ||
      coordinates.every((value) => typeof value === "number")
    ) {
      return true;
    }
  }
  return false;
}

function checkIfCoverageAreaCoordinatesIsValid(coordinates: any): boolean {
  if (Array.isArray(coordinates)) {
    return coordinates.every((value2) => {
      return Array.isArray(value2) &&
        value2.every((value3: any[]) => {
          return Array.isArray(value3) &&
            value3.every((value4: any[]) => {
              return Array.isArray(value4) &&
                value4.every((item: any) => typeof item === "number");
            });
        });
    });
  }
  return false;
}
