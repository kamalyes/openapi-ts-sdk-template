export interface ConfigurationParameters {
  basePath?: string;
  headers?: object;
}

export class Configuration {
  readonly basePath: string;
  readonly headers: object;

  constructor(parameters: ConfigurationParameters = {}) {
    this.basePath = parameters.basePath ?? '';
    this.headers = parameters.headers ?? {};
  }
}
