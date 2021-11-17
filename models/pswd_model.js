const passValidator = require("password-validator");

const passSchema = new passValidator();

// declaration du shema du mot de passe

passSchema
  .is()
  .min(6)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();
// export du shema

module.exports = passSchema;
