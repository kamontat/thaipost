import * as Express from "express";
import routes from "./routes";

const express = Express();
const PORT = 8080;

routes.routes.forEach(route => express.get(route.path, route.controller));

express.listen(PORT, () => {
  console.log(`Start server at ${PORT}`);
});
