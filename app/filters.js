module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  //
  // CONVERT DATE FILTER
  // Little helper to convert date objects from the date input into a nicer format
  //
  filters.convertDate = function( date ){

    let theDate = new Date();

    if( date && date.day && date.month && date.year ){
      theDate = new Date( parseInt( date.year ), parseInt( date.month ) - 1, parseInt( date.day ) );
    }

    return theDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
  };

  //
  // ALTER DATE BY NUMBER OF DAYS FILTER
  // Just increments a date by a number of days
  //
  filters.alterDateByNumberOfDays = function( daysOffset, day, month, year ){

    let today = new Date( parseInt(year), parseInt(month) - 1, parseInt(day) );
    if( Number.isNaN( today.getTime() ) ){
      today = new Date();
    }

    today.setDate(today.getDate() + daysOffset);

    // Manually format the date to avoid leading zeros (day, month, year)
    return today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  };

  //
  // GET MOTHER NAME FILTER
  //
filters.getMotherName = function(){

  const firstName = ( this.ctx.data.motherFirstName ) ? this.ctx.data.motherFirstName.trim() : 'Jane';
  const lastName = ( this.ctx.data.motherLastName ) ? this.ctx.data.motherLastName.trim() : 'Smith';

  return firstName + ' ' + lastName;

}

  //
  // GET MOTHER ADDRESS FILTER
  //
  filters.getMotherAddress = function(){

    let motherAddress = '4 Street Name, Townton, County, PO5T C0DE';

    if( this.ctx.data.addressLine1 ){

      // Result from manual entry
      motherAddress = [ this.ctx.data.addressLine1 ];

      if( this.ctx.data.addressLine2 ){
        motherAddress.push( this.ctx.data.addressLine2 )
      }
      if( this.ctx.data.addressTown ){
        motherAddress.push( this.ctx.data.addressTown )
      }
      if( this.ctx.data.addressCounty ){
        motherAddress.push( this.ctx.data.addressCounty )
      }
      if( this.ctx.data.addressPostcode ){
        motherAddress.push( this.ctx.data.addressPostcode )
      }
      
      motherAddress = motherAddress.join('<br />');

    } else if( this.ctx.data.addressSearchResult ){

      // Result from API search
      motherAddress = this.ctx.data.addressSearchResult.split(', ').join('<br />');

    }

    return motherAddress;

  }

  //
  // DWP ADDRESS PATTERN GET RESULTS STATUS FILTER
  // Generates a status based on the results coming back from the OS address search
  //
  filters.dwpAddressPatternGetResultsStatus = function( results, postcode, buildingNumberOrName ){

    let html = '';

    postcode = ( postcode ) ? postcode.trim() : '';
    buildingNumberOrName = ( buildingNumberOrName ) ? buildingNumberOrName.trim() : '';

    if( !Array.isArray(results) || results.length === 0  ){

      // No results
      if( postcode ){
        html = '<p class="nhsuk-body">We could not find an address that matches <strong>' + postcode + '</strong>';
        if( buildingNumberOrName ){
          html += ' and <strong>' + buildingNumberOrName + '</strong>';
        }
        html += '. You can search again or enter the address manually.</p>';
      } else {
        html = '<p class="nhsuk-body">We could not find an address that matches <strong>' + buildingNumberOrName + '</strong>. You can search again or enter the address manually.</p>';
      }      

    } else if( Array.isArray(results) && results.length > 0 ) {

      // More than one result
      const noOfResults = ( results.length === 1 ) ? '<strong>1</strong> result' : '<strong>'+results.length+'</strong> results';

      if( postcode ){
        html = '<p class="nhsuk-body">' + noOfResults + ' found for <strong>' + postcode + '</strong>';
        if( buildingNumberOrName ){
          html += ' and <strong>' + buildingNumberOrName + '</strong>';
        }
        html += '.</p>';
      } else {
        html = '<p class="nhsuk-body">' + noOfResults + ' found for <strong>' + buildingNumberOrName + '</strong></p>'
      } 

    }


    return html;

  };

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
