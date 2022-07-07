import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";

export class FindAllController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const partners = await this.repository.getAll();
      return {
        statusCode: 200,
        body: partners,
      };
    } catch (_error) {
      return { statusCode: 500, body: { message: "Server error." } };
    }
  }
}
