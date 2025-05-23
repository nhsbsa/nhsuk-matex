//
// GET TRANSLATIONS FUNCTION
//
function _getValidEmails(){

  // File from below, converted to an Excel file
  // https://digital.nhs.uk/services/nhs.net-connect/the-secure-email-standard#list-of-accredited-organisations


  const excelToJSON = require('convert-excel-to-json');
  const json = excelToJSON({
    sourceFile: 'app/data/dcb1596_accredited_domains.xlsx'
  });

  const emails = [];

  if( json ){

    Object.keys(json).forEach(function(key){

      const arr = json[key];

      if( arr && Array.isArray(arr) ){
        arr.forEach(function( row, i ){

          if( i > 0 ){
            if( row.C && row.C.trim() !== '' ){
              emails.push( row.C );
            }
          }

        });
      }

    });

  }

  return emails;

}

module.exports = {

    debug: 'false',
    loggedIn: 'false',

    addressMethod: 'radios',
    validEmails: _getValidEmails()

}