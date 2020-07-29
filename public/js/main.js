'use strict'


/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  const hashParams = {}
  let e
  const r = /([^&;=]+)=?([^&;]*)/g
  const q = window.location.hash.substring(1)
  while (e === r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2])
  }
  return hashParams
}
console.log(getHashParams())
const params = getHashParams()

const accessToken = params.access_token
const error = params.error
const searchURL = 'https://api.spotify.com/v1/me/top/artists';

if (accessToken) {
  console.log("access token")
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
  const params = {
    time_range: 'short_term',
    limit: 6
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  const header = {
    'Authorization': 'Bearer ' + access_token
  }
      console.log(url)
  fetch(url, header)
    .then(response => {
      if (response.ok) {
        console.log(response)
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => console.log(JSON.stringify(responseJson)))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

  function displayMostListened(result) {
    $('#login').hide()
    $('#loggedin').show()
    let albumArtwork = result.items.reduce((result, item, index) => {
      result += `<div class="albumArtwork"> <img src="${item.images[1].url}"alt="">
            <h4>${item.name}</h4>
            </div>`
      return result
    }, '');
    let songsHtml = `<div class="songs">` + albumArtwork + `</div>`
    renderMostListened(songsHtml)
    $(".songs").html(albumArtwork)
  }

  function renderMostListened(html) {
    const API_ID = "7dd8b6b9-cd53-474e-85ff-2cecfe88b7f0"
    let settings = {
      "url": "https://hcti.io/v1/image",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": "Basic N2RkOGI2YjktY2Q1My00NzRlLTg1ZmYtMmNlY2ZlODhiN2YwOmQwY2FjN2Y0LTIyZmEtNDM3ZC1iMzc1LTI3ZmQ3ZDZiZDAxYw==",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "data": {
        "html": html,
        "css": `

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
            }`,
        "google_fonts": "Permanent Marker"
      }
    }
    $.ajax(settings).done(function(response) {
      console.log(response)
      $(".songs").html(`<img id="artworkImg" src="${response.url}" width="500"/>`)
      $(".download").html(`<a download="listeningto" href="${response.url}">Download and share</a>`)
    })
  }
