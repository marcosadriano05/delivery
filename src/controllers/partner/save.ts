import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { created } from "../responses.ts";
import { ValidationError } from "../validation_error.ts";
import { responseFromError } from "../error_handle.ts";

export class SaveController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      validateParams(req.body);
      await this.repository.save(req.body);
      return created("Partner created.");
    } catch (error) {
      return responseFromError(error);
    }
  }
}

function validateParams(body: any): void {
  const requiredParamsString = ["tradingName", "ownerName", "document"];
  const requiredParamsObject = ["address", "coverageArea"];
  if (body === undefined || Object.keys(body).length === 0) {
    throw new ValidationError(
      "Body params required: tradingName, ownerName, document, address, coverageArea.",
    );
  }
  for (const param of requiredParamsString) {
    if (body[param] === undefined) {
      throw new ValidationError(
        "Body params required: tradingName, ownerName, document, address, coverageArea.",
      );
    }
    if (typeof body[param] !== "string") {
      throw new ValidationError(
        "Body params should be strings: tradingName, ownerName, document.",
      );
    }
  }
  for (const param of requiredParamsObject) {
    if (
      body[param] === undefined ||
      Object.keys(body[param]).length === 0
    ) {
      throw new ValidationError(
        `Body params required to ${param}: type, coordinates.`,
      );
    }
  }
  for (const param of requiredParamsObject) {
    if (
      body[param].type === undefined ||
      typeof body[param].type !== "string"
    ) {
      throw new ValidationError(
        `Body params type to ${param} should be string.`,
      );
    }
  }
  if (!checkIfAddressCoordinatesIsValid(body.address.coordinates)) {
    throw new ValidationError(
      "Body param address.coordinates must be empty array or an array of numbers.",
    );
  }
  if (
    !checkIfCoverageAreaCoordinatesIsValid(
      body.coverageArea.coordinates,
    )
  ) {
    throw new ValidationError(
      "Body param coverageArea.coordinates must be empty array or an number[][][][].",
    );
  }
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
