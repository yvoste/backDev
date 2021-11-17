
const validateName = function(name) {
  var re = /^\w+$/;
  return re.test(name);
};

module.exports = (req, res, next) => {
  console.log(JSON.parse(req.body.sauce));
  const check = JSON.parse(req.body.sauce);
  let valid = true;
  console.log(typeof(check))
  valid = validateName(check.name);
  /*valid = validateName(check.manufacturer);
  valid = validateName(check.description);
  valid = validateName(check.mainPepper);*/
  console.log(valid)
  if (!valid) {
    req.body.error = 1;    
  }
  next();
};
