import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "../contract";

export const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "DineFlow API",
    version: "1.0.0",
  },
  baseUrl: "http://localhost:4000",
});
