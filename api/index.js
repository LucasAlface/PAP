let app;

function getApp() {
  if (!app) {
    app = require("../backend/app");
  }

  return app;
}

module.exports = (req, res) => {
  try {
    req.url = req.url.replace(/^\/api(?=\/|$)/, "") || "/";
    return getApp()(req, res);
  } catch (err) {
    console.error("API function crashed:", err);

    return res.status(500).json({
      error: "API function failed to start",
      message: err.message,
    });
  }
};
