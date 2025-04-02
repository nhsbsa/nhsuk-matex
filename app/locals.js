module.exports = config => (req, res, next) => {

  res.locals.serviceName = config.serviceName;
  res.locals.registerServiceName = 'Register to issue maternity exemption certificates';

  next();
}
