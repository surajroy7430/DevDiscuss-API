const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("username").notEmpty().withMessage("Name is required"),
  body("email").notEmpty().isEmail().withMessage("Valid email is required"),
];

const loginValidation = [
  body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const runValidtion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  next();
};

module.exports = { registerValidation, loginValidation, runValidtion };
