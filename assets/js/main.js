$(document).ready(function() {

//Google Maps Api Info

//National Park API Info

//Variables

//Functions
function initMap() {
    let options = {
        zoom: 5,
        center:{lat:41.896798,lng:-87.618804}
    }
    let map = new
    google.maps.Map(document.getElementById('map'), options);
}


//Sets the correct language for Google Maps and adds API script.

//Events
//initMap();


});