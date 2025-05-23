

function _loadPeople(){

  // Import the converter library
  const excelToJSON = require('convert-excel-to-json');

  // Load in the data
  let json = excelToJSON({
    sourceFile: 'app/data/dummy_data.xlsx'
  });

  // If we have the data, format it, otherwise, set an error message
  if( json ){
    json = _formatJSON( json );
  } else {
    json = 'Something went wrong!';
  }

  // Output the data
  return json;

};


function _formatJSON( json ){

  // Create a holder array for the people
  const people = [];

  // Check if the JSON exists, that Sheet1 is there, and that Sheet1 is an array
  if( json && json.Sheet1 && Array.isArray( json.Sheet1 ) ){

    // Loop through all the rows in the array
    json.Sheet1.forEach(function( row, i ){

      // The first row (0) contains all the column headers, so we only need row 1 and over
      if( i > 0 ){
        
        // Map out our data into a more easily understandable format
        const person = {};

        person.firstName = row.A;
        person.favouriteFruit = row.B;
        person.pet = row.C;

        // Add this person to our holder array
        people.push( person );

      }

    });
    

  }

  return people;

};


module.exports = {

    debug: 'false',
    loggedIn: 'false',

    people: _loadPeople()

}