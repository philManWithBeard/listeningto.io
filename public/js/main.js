'use strict';

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer BQCKIot0oX7uM6om60VaqZ_y6ZB0OjceefCVoMDwk-rrMW35rSF-HVlDKtY5qGXdbSguYEz6Gp7awmw4lwPnLvAI_RbELGPJdZq_MduEaW-hOPSE6Tanw28F16wdPGXWWXzBJegLBLK_0XU2_aJjNP4nh_49G5UCirY");
myHeaders.append("Cookie", "_ga=GA1.2.2069325888.1588705949; _gid=GA1.2.226590076.1588705949; sp_dc=AQC33Fnch_VAQIbv6AgSmbQ_Vn88IdPL5aoDFLIuMEes5gZmUPKbarklt00QrTsFR_XUa_rwnISxbK05M9arkCVo1DNeyfZtWF23gIfMKG0; sp_key=80052a29-945f-4333-ba13-2e55e2f0af52");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};



function fetchMostListened() {
  fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=6", requestOptions)
    .then(response => response.json())
    .then(result => displayMostListened(result))
    .catch(error => console.log('error', error));
}

function displayMostListened(result) {
  console.log(result);
  let answerThing = result.items.reduce((result, item, index) => {
    result += `<div class="albumArtwork"> <img src="${item.images[1].url}"alt="">
    <h4>${item.name}</h4>
    </div>`;
    return result;
  }, '');;
  $(".songs").html(answerThing);
    $('.playlists').attr('hidden', '');
}

function fetchSpotifyPlaylists() {
  fetch("https://api.spotify.com/v1/me/playlists", requestOptions)
    .then(response => response.json())
    .then(result => displaySpotifyPlaylists(result))
    .catch(error => console.log('error', error));
}

function displaySpotifyPlaylists(result) {
  let answerThing = result.items.reduce((result, item, index) => {
    result += `<input type="radio" id="${index}" name="answer" value="${item.id}">
    <label for="${index}">${item.name}</label>`;
    return result;
  }, '');;
  $(".playlists").html(answerThing);
  handleButton();
}

function handleButton() {
  $('.playlists').on('click', 'input', function(event) {
    let answer = $(this).val();
    $('.playlists').attr('hidden', '');
    $('.playlistSongs').removeAttr('hidden');
    fetchPlaylistSongs(answer);

  });
}

function fetchPlaylistSongs(playlistID) {
  fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?market=ES&fields=items&limit=10&offset=5`, requestOptions)
    .then(response => response.json())
    .then(result => displayPlaylistSongs(result))
    .catch(error => console.log('error', error));
}

function displayPlaylistSongs(result) {
  console.log(result);
  let answerThing = result.items.reduce((result, item, index) => {
    result += `<div class="albumArtwork"> <img src="${item.track.album.images[1].url}"alt="">
    <h4>${item.track.artists[0].name}</h4>
    </div>`;
    return result;
  }, '');;
  $(".songs").html(answerThing);
}

$(fetchMostListened());
