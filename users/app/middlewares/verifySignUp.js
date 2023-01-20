const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  console.log('Verifying email:', req.body);
    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        console.log('Error detected unknown');
        res.status(500).json({ err: [err] });
        return;
      }

      if (user) {
        console.log('Error detected user');
        res.status(400).json({ err: ["Failed! Email is already in use!"] });
        return;
      }

      next();
    });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        console.log('Error detected role');
        res.status(400).json({
          err: [`Failed! Role ${req.body.roles[i]} does not exist!`]
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
