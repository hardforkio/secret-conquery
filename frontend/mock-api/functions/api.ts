import * as serverless from "serverless-http";
import * as createApi from "../index";
const app = createApi();

module.exports.handler = serverless(app);
