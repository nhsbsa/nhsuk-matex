// External dependencies
const express = require('express');
const router = express.Router();

// Add your routes here - above the module.exports line
router.post(/certificate-email-or-post/, function (req, res) {
  // creating a variable named contact - assigning the variable the value of the radio button selected
  var contact = req.session.data['contact']

  if (contact == "email"){
    res.redirect('/email')
  }
  else {
    res.redirect('/post')
  }
})
module.exports = router;

















