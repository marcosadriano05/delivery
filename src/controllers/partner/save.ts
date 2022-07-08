import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { badRequest, created, serverError } from "../responses.ts";

export class SaveController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const body = req.body;
      const requiredParamsString = ["tradingName", "ownerName", "document"];
      const requiredParamsObject = ["address", "coverageArea"];
      if (req.body === undefined || Object.keys(req.body).length === 0) {
        return badRequest(
          "Body params required: tradingName, ownerName, document, address, coverageArea.",
        );
      }
      for (const param of requiredParamsString) {
        if (req.body[param] === undefined) {
          return badRequest(
            "Body params required: tradingName, ownerName, document, address, coverageArea.",
          );
        }
        if (typeof req.body[param] !== "string") {
          return badRequest(
            "Body params should be strings: tradingName, ownerName, document.",
          );
        }
      }
      for (const param of requiredParamsObject) {
        if (
          req.body[param] === undefined ||
          Object.keys(req.body[param]).length === 0
        ) {
          return badRequest(
            `Body params required to ${param}: type, coordinates.`,
          );
        }
      }
      for (const param of requiredParamsObject) {
        if (
          req.body[param].type === undefined ||
          typeof req.body[param].type !== "string"
        ) {
          return badRequest(
            `Body params type to ${param} should be string.`,
          );
        }
      }
      if (!checkIfAddressCoordinatesIsValid(req.body.address.coordinates)) {
        return badRequest(
          "Body param address.coordinates must be empty array or an array of numbers.",
        );
      }
      if (
        !checkIfCoverageAreaCoordinatesIsValid(
          req.body.coverageArea.coordinates,
        )
      ) {
        return badRequest(
          "Body param coverageArea.coordinates must be empty array or an number[][][][].",
        );
      }
      await this.repository.save(body);
      return created("Partner created.");
    } catch (error) {
      return serverError(error);
    }
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
