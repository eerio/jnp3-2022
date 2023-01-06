const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    // "/api/auth/signup",
    "/api/register",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post(
    //"/api/auth/signin",
    "/api/login",
    controller.signin);

  app.post(
    // "/api/auth/signout",
    "/api/logout",
    controller.signout);

  app.get('/api/user_id/',(req, res) => {
      console.log('got hit user_id');
      res.json({userId: Number(req.get('Authorization'))});
  });
};
