import RestProxy from "sp-rest-proxy";

const settings = {
  configPath: "./sharePointConfig/private.json",
  port: 8085, // Fixed port
  hostname: "127.0.0.1", // Fixed host
  staticRoot: "node_modules/sp-rest-proxy/static",
};

const restProxy = new RestProxy(settings);
restProxy.serve();
