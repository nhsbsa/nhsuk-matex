// External dependencies
const express = require('express');
const router = express.Router();

//
// DETECT CURRENT VERSION
//
router.use((req, res, next) => {

  const versions = ['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','old-version','pregnancy-loss'];
  let version = '';
  versions.forEach( function( vers ){
    if( req.originalUrl.toUpperCase().indexOf( '/' + vers.toUpperCase() + '/' ) > -1 ){
      version = vers;
    }
  } );

  res.locals.version = version;
  next();

});

// versioned routes files
router.use('/v11', require('./views/v11/_routes'))
router.use('/v10', require('./views/v10/_routes'))
router.use('/v9', require('./views/v9/_routes'))
router.use('/v8', require('./views/v8/_routes'))
router.use('/v7', require('./views/v7/_routes'))
router.use('/v6', require('./views/v6/_routes'))
router.use('/v5', require('./views/v5/_routes'))
router.use('/v4', require('./views/v4/_routes'))
router.use('/v3', require('./views/v3/_routes'))
router.use('/v2', require('./views/v2/_routes'))
router.use('/v1', require('./views/v1/_routes'))
router.use('/old-version', require('./views/old-version/_routes'))

// Add your routes here - above the module.exports line
router.post(/certificate-email-or-post/, function (req, res) {
  // creating a variable named contact - assigning the variable the value of the radio button selected
  var contact = req.session.data['contact']
  if (contact == "email") {
    res.redirect('/email')
  }
  else {
    res.redirect('/postcode')
  }
})


module.exports = router;




















