'use strict';

const searchURL = 'https://developer.nps.gov/api/v1/parks?';
const apiKey = 'JVeSBRlmeioOK5HNO6ev6IpsIwcPWH1dXgpk2SxN';

function watchForm() {
  let searchInput;
  let maxResults;
  $('form').submit(event => {
    event.preventDefault();
    searchInput = $('#js-search-parks').val();
    maxResults = $('#js-max-results').val();
    getParks(searchInput, maxResults);
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