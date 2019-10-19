//VALIDATION - Additional data validation requirements to restrict unwanted input to our system
  //e.g. string length for email and password for register.
const Joi = require("@hapi/joi");

//Register Validation
const registerValidation = data => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(4)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
};

//Login Validation
const loginValidation = data => {
  const schema = {
    // name: Joi.string()
    //   .min(6)
    //   .required(),
    email: Joi.string()
      .min(3)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
