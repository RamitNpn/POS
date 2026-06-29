"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiDocument = void 0;
const open_api_1 = require("@ts-rest/open-api");
const contract_1 = require("../contract");
exports.openApiDocument = (0, open_api_1.generateOpenApi)(contract_1.contract, {
    info: {
        title: "Local Vibes API",
        version: "1.0.0",
    },
    baseUrl: "https://pos-backend-q4r0.onrender.com",
});
