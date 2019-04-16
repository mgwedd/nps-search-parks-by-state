'use strict';

const searchURL = 'https://developer.nps.gov/api/v1/parks?';
const apiKey = 'JVeSBRlmeioOK5HNO6ev6IpsIwcPWH1dXgpk2SxN';

function watchForm() {
  let searchInput;
  let maxResults;
  $('form').submit(event => {
    event.preventDefault();
    try {
      let rawInput = $('#js-search-parks').val();
      // Input must be at least two contiguous letters. Only commas and spaces allowed as seperators.
      if (!/^(\s*[a-zA-Z]{2}\s*,?)+$/.test(rawInput)) {
        throw Error('Whoops, invalid state code(s). Enter state code(s) in the format "NY, MA, NH" or "NY MA NH" etc.');
      } else {
        searchInput = rawInput.replace(/\s/g, '');
        maxResults = $('#js-max-results').val();
        getParks(searchInput, maxResults);
      } 
    } catch(error) {
      alert(error.message);
    }
  });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getParks(searchInput, maxResults) {
  const params = {
    'stateCode': searchInput,
    limit: parseInt(maxResults),
    api_key: apiKey
  };
  const formattedQuery = formatQueryParams(params);
  const url = searchURL + formattedQuery;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Uh ho... We couldn't complete your request because: ${error.message}`);
    });
}

function displayResults(responseObj, maxResults) {
    console.log(responseObj);
    $('#results-list').empty();
    
    for (let i = 0; i < responseObj.data.length; i++) {
      $('#results-list').append(
        `<li><h3><a href="${responseObj.data[i].url}">${responseObj.data[i].fullName}</a></h3>
        <p><strong>State(s):</strong> ${responseObj.data[i].states}</p>
        <p><strong>Description:</strong> ${responseObj.data[i].description}</p>
        <p><strong>Designation:</strong> ${responseObj.data[i].designation}</p>
        <p><strong>Park Directions:</strong> ${responseObj.data[i].directionsInfo}</p>
        </li>`
      )};
    $('#results').removeClass('hidden');
}

$(watchForm);