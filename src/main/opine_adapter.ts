import {
  OpineRequest,
  OpineResponse,
  ParamsDictionary,
} from "../../deps/opine.ts";
import { Controller, HttpRequest } from "../controllers/controller.ts";

function opineAdapter(controller: Controller) {
  return async (
    req: OpineRequest<ParamsDictionary, any, any>,
    res: OpineResponse<any>,
  ) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
    };
    const httpResponse = await controller.handle(httpRequest);
    httpResponse.headers?.forEach((header) => {
      res.setHeader(
        header.name,
        header.value,
      );
    });

    return res.setStatus(httpResponse.statusCode).json(httpResponse.body);
  };
}

export { opineAdapter };
