// External dependencies
const express = require('express');
const router = express.Router();


//
// DETECT CURRENT VERSION
//
router.use((req, res, next) => {

  // Versions
  const versions = ['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','old-version','pregnancy-loss'];

  // Clear current routes 
  router.stack = router.stack.filter( layer => layer.name !== 'router' );

  // Get the current version needed
  let version = '';
  versions.forEach( function( vers ){
    if( req.originalUrl.toLowerCase().indexOf( '/' + vers + '/' ) > -1 ){
      version = vers;
    }
  } );

  res.locals.version = version;

  // Load the required routes
  if( version ){
    router.use('/'+version, require('./views/'+version+'/_routes'));
  }

  next();


});


// Add your routes here - above the module.exports line
/*
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
  */


module.exports = router;




















