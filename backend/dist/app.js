"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const contract_1 = require("./contract");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_2 = require("@ts-rest/express");
const morgan_1 = __importDefault(require("morgan"));
const swagger_config_1 = require("./config/swagger.config");
const module_1 = require("./module");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use("/dineflow-api", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.openApiDocument));
(0, express_2.createExpressEndpoints)(contract_1.contract, module_1.router, app);
exports.default = app;
