// External dependencies
const express = require('express');
const axios = require('axios');
const router = express.Router();


//
// HANDLE EMPTY DATE FIELDS
// Updates empty fields in a date object with missing values, or today's date
//
_handleEmptyDateFields = function( dateObj, day, month, year ){

    let today = new Date();

    day = ( day ) ? day : String(today.getDate());
    month = ( month ) ? month : String(today.getMonth() + 1);
    year = ( year ) ? year : String(today.getFullYear());

    dateObj = ( dateObj ) ? dateObj : { day : '', month: '', year: '' };

    if( !dateObj.day.trim() ){
        dateObj.day = day;
    }
    if( !dateObj.month.trim() ){
        dateObj.month = month;
    }
    if( !dateObj.year.trim() ){
        dateObj.year = year;
    }

    return dateObj;

}

//
// UPDATE EMPTY VALUES FUNCTION
//
_updateEmptyValues = function( data ){

    if( data.motherPresent === 'no' ){
        data.dateLastMetMother = _handleEmptyDateFields( data.dateLastMetMother );
    } else {
        data.motherPresent = 'yes';
        data.dateLastMetMother = { day: '', month: '', year: '' };
    }

    data.motherFirstName = ( data.motherFirstName ) ? data.motherFirstName : 'Jane';
    data.motherLastName = ( data.motherLastName ) ? data.motherLastName : 'Smith';

    data.motherDateOfBirth = _handleEmptyDateFields( data.motherDateOfBirth, '20', '3', '1992' );

    data.motherPostcode = ( data.motherPostcode ) ? data.motherPostcode : 'W4 5HW';
    data.motherNHSNumber = ( data.motherNHSNumber ) ? data.motherNHSNumber : '234 253 6384';

    data.babyDateOfBirth = _handleEmptyDateFields( data.babyDateOfBirth );

    data.certificateByEmailOrPost = ( data.certificateByEmailOrPost ) ? data.certificateByEmailOrPost : 'email';

    if( data.certificateByEmailOrPost === 'email' ){

        // Email
        data.motherEmail = ( data.motherEmail ) ? data.motherEmail : 'mother.email@outlook.com';
        
        delete data.addressSearchPostcode;
        delete data.addressSearchBuildingNumberOrName;

        delete data.addressLine1;
        delete data.addressLine2;
        delete data.addressTown;
        delete data.adddressCounty;
        delete data.addressPostcode;

    } else {

        // Post
        if( data.addressMethod === 'radios' ){
          
          data.addressSearchPostcode = ( data.addressSearchPostcode ) ? data.addressSearchPostcode : 'W4 5HW';
          data.addressSearchResult = ( data.addressSearchResult ) ? data.addressSearchResult : '141, Acton Lane, London, W4 5HW';
          
          delete data.addressLine1;
          delete data.addressLine2;
          delete data.addressTown;
          delete data.adddressCounty;
          delete data.addressPostcode;

        } else {

          delete data.addressSearchResult;
          delete data.addressSearchPostcode;

        }

        delete data.motherEmail;
    }

    data.returnToCYA = 'true';

};

//
// UPDATE EMPTY REGISTER VALUES FUNCTION
//
_updateEmptyRegisterValues = function( data ){

    data.registerLastName = ( data.registerLastName ) ? data.registerLastName : 'Smith';
    data.registerEmail = ( data.registerEmail ) ? data.registerEmail : 'jane.smith@nhs.net';
    data.registerPIN = ( data.registerPIN ) ? data.registerPIN : '99A9999A';
    data.registerDateOfBirth = _handleEmptyDateFields( data.registerDateOfBirth, '20', '3', '1992' );

    data.returnToCYA = 'true';
};

/* 

REGISTER 

*/

router.post(/register\/start/,  function (req, res) {
    req.session.data = {};
    res.redirect('email');
});

router.post(/register\/email/,  function (req, res) {
  let redirect = ( req.session.data.returnToCYA === 'true' ) ? 'check-your-answers' : 'your-details';
    res.redirect(redirect);
});

router.post(/register\/your-details/,  function (req, res) {
    res.redirect('check-your-answers');
});

router.post(/register\/check-your-answers/,  function (req, res) {
    res.redirect('confirmation');
});

router.use( function(req, res, next) {
    if( req.path === '/register/check-your-answers' && req.session.data.returnToCYA !== 'true' ){
        _updateEmptyRegisterValues( req.session.data );
        res.redirect('check-your-answers');
    } else if(req.path === '/register/not-verified' && req.session.data.returnToCYA !== 'true'){
        _updateEmptyRegisterValues( req.session.data );
        res.redirect('not-verified');
    } else {
        next();
    }
});



/* 

APPLY 

*/

router.post(/start/,  function (req, res) {
    req.session.data = {};
    res.redirect('microsoft-login');
});

router.post(/nhs-login/,  function (req, res) {
    req.session.data.loggedIn = 'true';
    res.redirect('mother-present');
});

router.post(/mother-present/,  function (req, res) {
    let redirect = ( req.session.data.returnToCYA === 'true' ) ? 'check-your-answers' : 'application-details';
    res.redirect(redirect);
});

router.post(/application-details/,  function (req, res) {
    let redirect = ( req.session.data.returnToCYA === 'true' ) ? 'check-your-answers' : 'certificate-by-email-or-post';
    res.redirect(redirect);
});

router.post(/certificate-by-email-or-post/,  function (req, res) {
    let addressRedirect = ( req.session.data.addressMethod === 'manual' ) ? 'manual-address' : 'postcode';
    let redirect = ( req.session.data.certificateByEmailOrPost === 'post' ) ? addressRedirect : 'email';
    res.redirect( redirect );
});

router.post(/email/,  function (req, res) {
    _updateEmptyValues( req.session.data );
    res.redirect( 'check-your-answers' );
});

router.get(/postcode-search/, function (req, res) {

    if( !req.session.data.addressSearchPostcode && !req.session.data.addressSearchBuildingNumberOrName ){
        res.redirect('postcode?showErrors=true');
    } else {
        req.session.data.showErrors = 'false';
    }

    // Prep the variables
    let addressSearchPostcode = req.session.data.addressSearchPostcode.split(' ').join('').toUpperCase();
    const addressSearchBuildingNumberOrName = req.session.data.addressSearchBuildingNumberOrName || '';
    const apiKey = process.env.POSTCODEAPIKEY;
    const regex = RegExp('^([A-PR-UWYZa-pr-uwyz](([0-9](([0-9]|[A-HJKSTUW])?)?)|([A-HK-Ya-hk-y][0-9]([0-9]|[ABEHMNPRVWXY])?)) ?[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2})$', 'i');
    addressSearchPostcode = ( regex.test(addressSearchPostcode) ) ? addressSearchPostcode : '';

    const updateResults = ( arr ) => {
      req.session.data.addressSearchResults = arr;
    };

    const toTitleCase = ( str ) => {
      return str.replace( /\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); } );
    }

    const formatAddress = ( address ) => {

      const formattedAddress = [];
      const addressParts = address.split(', ');
      addressParts.forEach( ( part, i ) => {
        if( i !== (addressParts.length - 1) ){
          formattedAddress.push( toTitleCase( part ) );
        } else {
          formattedAddress.push( part );
        }
      });

      return formattedAddress.join(', ');

    };

    let baseURL = '';

    if( addressSearchBuildingNumberOrName ){
      baseURL = 'https://api.os.uk/search/places/v1/find?query=' + encodeURI(addressSearchBuildingNumberOrName);
    }

    if( addressSearchPostcode ){
      baseURL = 'https://api.os.uk/search/places/v1/postcode?postcode=' + encodeURI(addressSearchPostcode);
    }

    // Make the call
    if( baseURL && apiKey ){

      let url = baseURL + '&key=' + apiKey;

      axios.get( url ).then( response => {

        let filteredResults = [];

        if( Array.isArray( response.data.results ) ){

          response.data.results.forEach(function(result){

            let resultPostcode = result.DPA.POSTCODE.split(' ').join('').toUpperCase();

            let obj = { 
              'text' : formatAddress( result.DPA.ADDRESS ),
              'value' : formatAddress( result.DPA.ADDRESS )
            };

            if( addressSearchPostcode ){

              if( addressSearchPostcode.indexOf(resultPostcode) === 0 ){

                let bnon = addressSearchBuildingNumberOrName.trim().toUpperCase();
                if( bnon ){

                  // WE HAVE A POSTCODE AND A BUILDING NAME/NUMBER, TRY TO NARROW THE RESULTS DOWN...

                  if( result.DPA.BUILDING_NAME ){

                    if( result.DPA.SUB_BUILDING_NAME ){
                      // We can check the SUB_BUILDING_NAME field as well...
                      if( result.DPA.SUB_BUILDING_NAME.indexOf(bnon) > -1 || result.DPA.BUILDING_NAME.indexOf(bnon) > -1 ){
                        filteredResults.push(obj);
                      }
                    } else {
                      // We can only check the BUILDING_NAME field...
                      if( result.DPA.BUILDING_NAME.indexOf(bnon) > -1 ){
                        filteredResults.push(obj);
                      }
                    }
            
                  } else if( result.DPA.BUILDING_NUMBER ) {
          
                      if( result.DPA.BUILDING_NUMBER === String(bnon) ){
                        filteredResults.push(obj);
                      }

                  }
                } else {

                  // WE HAVE A POSTCODE, BUT NO BUILDING NAME/NUMBER, ALLOW EVERYTHING...
                  filteredResults.push(obj);
                }
              
              }

            } else {

              // WE DON'T HAVE A POSTCODE, ALLOW ANYTHING 
              filteredResults.push(obj);

           }

          });

        }

        updateResults( filteredResults );
        res.redirect('postcode-results');


      }).catch( (error) => { console.log( error ); });
    

  } else {

    updateResults([]);
    res.redirect('postcode-results');

  }

});

router.post(/postcode-results/,  function (req, res) {
    res.redirect( 'postcode-confirm' );
});

router.post(/postcode-confirm/,  function (req, res) {
  req.session.data.addressMethod = 'radios';
    res.redirect( 'check-your-answers' );
});

router.post(/manual-address/,  function (req, res) {
  req.session.data.addressMethod = 'manual';
  res.redirect( 'check-your-answers' );
});

router.post(/check-your-answers/,  function (req, res) {
    res.redirect( 'confirmation' );
});

router.use( function(req, res, next) {
    if( req.path === '/check-your-answers' && req.session.data.returnToCYA !== 'true' ){
        _updateEmptyValues( req.session.data );
        res.redirect('check-your-answers');
    } else {
        next();
    }
});

router.post(/confirmation/,  function (req, res) {
    req.session.data = {};
    req.session.data.loggedIn = 'true';
    res.redirect( 'mother-present' );
});

module.exports = router;