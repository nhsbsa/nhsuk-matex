// External dependencies
const express = require('express');
const router = express.Router();

// Add your routes here - above the module.exports line

router.post('/certificate-email-or-post', function (req, res) {
  var contact = req.session.data['contact-group']

  if (contact == "email"){
    res.redirect('/email')
  }
  else {
    res.redirect('/post')
  }
})

module.exports = router;