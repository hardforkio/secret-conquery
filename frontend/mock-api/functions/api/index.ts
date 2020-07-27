import * as serverless from "serverless-http";
import * as createApi from "../../index";
import * as express from "express";
const app = createApi();
const wrapper = express();

module.exports.handler = serverless(
  wrapper.use("/.netlify/functions/api", app)
);
