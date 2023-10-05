// External dependencies
const express = require('express');
const router = express.Router();


// Add your routes here - above the module.exports line
router.post(/certificate-email-or-post/,  function (req, res) {
  // creating a variable named contact - assigning the variable the value of the radio button selected
  var contactGroup = req.session.data['contact-group']

  if (contactGroup == "email"){
    res.redirect('email')
  }
  else {
    res.redirect('postcode')
  }
})



module.exports = router;
