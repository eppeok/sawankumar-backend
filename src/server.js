const config = require("./config/index.js");
const server = require("./app.js");

const PORT = config.port || 5000;

server.listen(PORT, () => {
  console.log(`
      ################################################
      🛡️  Server listening on port: ${PORT} 🛡️
      ################################################`);
});
