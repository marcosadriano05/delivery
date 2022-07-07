import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";

export class SaveController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const body = req.body;
      await this.repository.save(body);
      return {
        statusCode: 201,
        body: { message: "Partner created." },
      };
    } catch (_error) {
      return {
        statusCode: 500,
        body: { message: "Error to create partner." },
      };
    }
  }
}
