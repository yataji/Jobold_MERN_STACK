const https = require("https");
const fs = require("fs");
const app = require("./app");
require("dotenv").config();
//read the certificate and the private key for the https server options
const options = {
  cert: fs.readFileSync("./config/cert.crt"),
  key: fs.readFileSync("./config/cert.key"),
};
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

const server = https.createServer(options, app);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("HTTPS server Listening on " + bind);
});

server.listen(port);
