module.exports = function(req, res, next) {

  // You can set any additional local variables here.
  // These will be made available to any views
  //
  // For example:
  //
  // req.locals.organisationName = 'NHS'

  res.locals.registerServiceName = 'Register to issue maternity exemption certificates';

  next()
}
