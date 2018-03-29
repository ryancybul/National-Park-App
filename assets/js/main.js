$(document).ready(function() {

//Google Maps Api Info
async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoeXJw_A8kRRjm5VsqzpWvLvqC2vGtXB0&callback=initMap"

//National Park API Info

//Variables


//Functions
function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('.js-container'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  }

//Events


});