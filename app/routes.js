// External dependencies
const express = require('express');
const router = express.Router();

//
// DETECT CURRENT VERSION
//
router.use((req, res, next) => {

  // Versions
  const versions = ['v1','v2','v3','v4','v5','v6','v7','v7-nunjucks','v8','v9','v10','v11','old-version','pregnancy-loss'];

  // Clear current routes 
  router.stack = router.stack.filter( layer => layer.name !== 'router' );

  // Get the current version needed
  let version = '';
  versions.forEach( function( vers ){
    if( req.originalUrl.toLowerCase().indexOf( '/' + vers + '/' ) > -1 ){
      version = vers;
    }
  } );

  res.locals.prototypeVersion = version;
  res.locals.originalUrl = req.originalUrl;

  // Load the required routes
  if( version ){
    console.log( '----------------------' );
    console.log( req.originalUrl );
    console.log( 'Loading routes for ' + version );
    router.use('/'+version, require('./views/'+version+'/_routes'));
  }

  next();


});

router.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({ message: 'No special config' });
})

router.get('/v7/confirmation-email', function (req, res) {
  res.render('v7/confirmation-email');
});

router.get('/v7/confirmation-post', function (req, res) {
  res.render('v7/confirmation-post');
});

router.post('/v7/certificate-email-or-post', function (req, res) {

  if (req.body['contact-group'] === 'email') {
    return res.redirect('/v7/confirmation-email');
  }

  if (req.body['contact-group'] === 'post') {
    return res.redirect('/v7/confirmation-post');
  }

  return res.redirect('/v7/certificate-email-or-post');
});

module.exports = router;




















