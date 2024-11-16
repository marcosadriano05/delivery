// deno-lint-ignore-file no-explicit-any
import { RouteParams, RouterContext } from "../../deps/oak.ts";
import { Controller, HttpRequest } from "../controllers/controller.ts";

function oakAdapter(controller: Controller) {
  return async (
    ctx: RouterContext<string, RouteParams<string>, Record<string, any>>,
  ) => {
    const httpRequest: HttpRequest = {
      body: ctx.request.hasBody ? await ctx.request.body.json() : undefined,
      params: ctx.params,
    };
    const httpResponse = await controller.handle(httpRequest);
    const response = ctx.response;
    httpResponse.headers?.forEach((header) => {
      response.headers.set(
        header.name,
        header.value,
      );
    });

    response.status = httpResponse.statusCode;
    response.body = httpResponse.body;
    response.type = "json";
    return;
  };
}

export { oakAdapter };
