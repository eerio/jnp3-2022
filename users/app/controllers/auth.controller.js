const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log('got hit: SIGNUP', req.body);
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).json({ err: [err] });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).json({ err: [err] });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).json({ err: [err] });
              return;
            }

            res.status(200).json({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).json({ err: [err] });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).json({err: [err] });
            return;
          }

          res.status(200).json({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  console.log('got hit: SIGNIN', req.body);
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ err: [err] });
        return;
      }

      if (!user) {
        return res.status(400).json({ err: ["User Not found."] });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(400).json({ err: ["Invalid Password!"] });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;
      res.status(200).json({
        token: token,
        id: user._id,
        email: user.email,
        roles: authorities,
      });
    });
};

exports.signout = async (req, res) => {
  console.log('got hit: SIGNOUT', req.body);
  try {
    req.session = null;
    return res.status(200).json({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.getUserId = async (req, res) => {
  console.log('got hit: getUserId', req.get('Authorization'))
  try {
    const decoded = jwt.verify(req.get('Authorization'), config.secret);
    const userId = decoded.id;
    console.log('Verification ok; user id: ', userId);
    return res.status(200).json({ userId: userId });
  } catch (err) {
    console.log('Verification failed:', err);
    return res.status(400).json({ err: ["Unable to verify."] });
  }
};
