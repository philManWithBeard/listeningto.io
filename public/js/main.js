'use strict'

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

const params = getHashParams()
const accessToken = params.access_token
const error = params.error
const searchURL = 'https://api.spotify.com/v1/me/top/artists'

const imgURL = 'https://hcti.io/v1/image'
const imgApiId = "7dd8b6b9-cd53-474e-85ff-2cecfe88b7f0"


if (accessToken) {
  getSpotifyTopSix()
} else {
  // render initial screen
  $('#login').show()
  $('#loggedin').hide()
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getSpotifyTopSix() {
  const parameters = {
    time_range: 'short_term',
    limit: 6
  };
  const queryString = formatQueryParams(parameters)
  const url = searchURL + '?' + queryString;
  const header = {
    'Authorization': 'Bearer ' + accessToken
  }
  const requestOptions = {
    method: 'GET',
    headers: header,
    redirect: 'follow'
  };

  fetch(url, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayMostListened(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

let songsHtml = ""

function displayMostListened(result) {
  $('#login').hide()
  $('#loggedin').show()
  let albumArtwork = result.items.reduce((result, item, index) => {
    result += `<div class="albumArtwork"> <img src="${item.images[1].url}"alt="">
            <h4>${item.name}</h4>
            </div>`
    return result
  }, '');
  songsHtml = `<div class="songs">` + albumArtwork + `</div>`
  $(".songs").html(albumArtwork)
  $(".download").html(`<a href="./">Download and share</a>`)
}

function renderMostListened(html) {
  let urlEncoded = new URLSearchParams();
  urlEncoded.append("html", html);
  urlEncoded.append("css", `

        .songs {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          width: 500px;
        }

        .albumArtwork {
          width: 150px;
          height: 200px;
          border-style: solid;
          border-width: thin;
          margin: 10px;
          padding: 10px;
          font-family: 'Permanent Marker', cursive;
        }

        .albumArtwork img {
          float: left;
          background-size: cover;
          width: 150px;
          height: 150px;
        }

        .albumArtwork h4 {
          height: 70px;
          margin: auto;
          text-align: center;
        }

        .playlists label {
          display: block;
          border-style: solid;
          border-width: thin;
          margin: 10px 0px;
          padding: 10px;
        }

        .playlists input[type="radio"] {
          opacity: 0;
          position: fixed;
          width: 0;
        }

        .playlists input[type="radio"]:checked+label {
          background-color: #bfb;
        }

        .playlists input[type="radio"]:focus+label {
          background-color: #dfd;
        }

        .playlists label:hover, #quizForm label:checked {
          background-color: #dfd;
        }

        .playlists label:active {
          background-color: #dfd;
        }`)
  urlEncoded.append("google_fonts", "Permanent Marker")


  const imgRequestOptions = {
    method: 'POST',
    timeout: 0,
    headers: {
      "Authorization": "Basic N2RkOGI2YjktY2Q1My00NzRlLTg1ZmYtMmNlY2ZlODhiN2YwOmQwY2FjN2Y0LTIyZmEtNDM3ZC1iMzc1LTI3ZmQ3ZDZiZDAxYw==",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: urlEncoded,
    redirect: 'follow'
  }

  fetch(imgURL, imgRequestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(imgResponse => displayImage(imgResponse))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function sharingType() {
  if (navigator.share) {
    console.log("web share is here")
  } else {
    console.log("web share is not here")
  }
}

function watchForm() {
  $("#target").submit(function(event) {
    event.preventDefault()
    let selectedState
    $('#locality-dropdown option:selected').each(function(i) {
      selectedState += ',' + $(this).val();
    });
    let selectedResultNo = $('#number-of-results option:selected').val()
    formQuery(selectedState, selectedResultNo)
  });
}

function displayImage(imgResponse) {
  $(".songs").html(`<img id="artworkImg" src="${imgResponse.url}" width="500"/>`)
  $(".download").html(`<a download="listeningto" href="${imgResponse.url}">Download and share</a>`)
}
