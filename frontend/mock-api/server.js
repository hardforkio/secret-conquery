// -----------
// EXPRESS SETUP
// -----------
const path = require("path");
const createApi = require(".");

const isDeveloping = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 8001;

const app = createApi()

if (!isDeveloping) {
  app.use("/app/static", express.static(__dirname + "/build"));
  app.get("/app/static/*", function response(req, res) {
    const lang = req.acceptsLanguages("de", "en") || "en";

    res.sendFile(path.join(__dirname, `build/index.${lang}.html`));
  });
}

app.listen(port, "0.0.0.0", function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info("==> 🌎 Listening on port %s.", port);
});
