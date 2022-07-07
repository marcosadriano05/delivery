export interface HttpRequest {
  body?: any;
  params?: any;
  headers?: any;
}

export interface HttpResponse {
  statusCode: number;
  headers?: Header[];
  body?: any;
}

interface Header {
  name: string;
  value: string;
}

export interface Controller {
  handle: (req: HttpRequest) => Promise<HttpResponse>;
}
