// External dependencies
const express = require('express');
const router = express.Router();

// versioned routes files
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




















