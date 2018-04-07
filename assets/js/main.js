var openWindow = false;
//Initializ Map and init state
function initMap() {
    //Map options
    let options = {
    zoom: 4.6,
    center:{lat:38.8283,lng:-98.5795}
}
    //Displays the map
    let map = new
    google.maps.Map(document.getElementById('map'), options)

    //AJAX Call for NPS API
    let queryURL = "https://developer.nps.gov/api/v1/parks?fields=images&limit=100&q=National+Park&api_key=1w64xYKjzt6YExOPqZE6qtvVHCE3ZAOO7xrQgUAV";
    console.log(queryURL);
    $.ajax({ url: queryURL, method: "GET" })
    .then(function(response) {
        let results = response.data;
        let parkDataArray =  results.filter(function(cur,i){
            return cur.fullName.indexOf('National Park')>-1;
        })
        console.log('Filtered array: ', parkDataArray.length);
        markers(parkDataArray, map);
    });
    
    //Hide page elements until park is clicked. 
    $(".js-info").hide();
    $(".js-pics").hide();

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});;
    directionsDisplay.setMap(map);

    var onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
  }

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: document.getElementById('start').value,
      destination: document.getElementById('end').value,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

//Function to run markers
function markers(parkDataArray, map){
    for(var i = 0; i < parkDataArray.length;i++){
        let imagesUrlArr = [];
        if(parkDataArray[i].latLong){
            let latLong = parkDataArray[i].latLong.split(', ');
            let lat = +latLong[0].slice(4);
            let long = +latLong[1].slice(5);

            for(j = 0; j < parkDataArray[i].images.length; j++){
                console.log((parkDataArray[i].images[j].url));
                //console.log(imagesUrlArr);
                imagesUrlArr.push(parkDataArray[i].images[j].url)
            }

            let parkObj = {
                name: parkDataArray[i].fullName,
                description: parkDataArray[i].description,
                coords:{lat: lat,lng: long},
                directions: parkDataArray[i].directionsInfo,
                weather: parkDataArray[i].weatherInfo,
                lat: lat,
                long: long,
                url: parkDataArray[i].url,
                states: parkDataArray[i].states,
                images: parkDataArray[i].images[i],
                imagesURL: imagesUrlArr,
            }
            //console.log(parkObj.imagesURL);
            //console.log(parkObj.imagesURL);
            console.log(parkObj)
           // console.log(parkObj.imagesURL);
            addMarker(parkObj, map);
            directions(parkObj);
            }
        }
    }

function directions(parkObj){
    console.log('Console log: '+parkObj.lat+', '+parkObj.long);
    $('#start').append('<option value="'+parkObj.lat+', '+parkObj.long+'">'+parkObj.name+'</option>');
    $('#end').append('<option value="'+parkObj.lat+', '+parkObj.long+'">'+parkObj.name+'</option>');
}
    
//Add marker function
function addMarker(parkInfo, map) {
    let marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: parkInfo.coords,
        map: map,
        name: parkInfo.name,
        coords: parkInfo.coords,
        weather: parkInfo.weather,
        url: parkInfo.url,
        description: parkInfo.description,
        directions: parkInfo.directions,
        states: parkInfo.states,
        icon: './assets/images/Tree_Icon.svg',
        images: parkInfo.images,
        imagesURL: parkInfo.imagesURL,
    });

    //Info window click event
    let infoWindowContent = "<div class='infoWindow'>" + "<div class='infoName'>" + parkInfo.name + "</div>" + '<button id="moreInfo">'+'More Info'+'</button>' + "</div>";
    let infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
    });
    
    //To do: Make it so only one info window can be open at once. 
    //When marker is clicked open window. 
    marker.addListener('click', function(){
        
        //Centers to marker
        map.panTo(marker.getPosition());  
        if(openWindow){
            openWindow.close();
            $('#js-carousel-inner').empty();
        }

        openWindow = infoWindow;
        infoWindow.open(map, marker);

        //Hide page elements until park is clicked. 
        $(".js-info").show();
        $(".js-pics").show();

        //Displays info from JSON
        $("#fullName").text(marker.name);
        $("#description").text(marker.description);
        $("#directionsInfo").text(marker.directions);
        $("#weatherInfo").text(marker.weather);
        //$("#latLong").text(JSON.stringify(marker.coords));
        $('#url').html('<a target="_blank" href="' + this.url +  '">Link to park website.</a>');
        $("#states").text(marker.states);

        let firstDiv = $("<div>");
        firstDiv.attr("id", "js-carousel-item");
        firstDiv.addClass("carousel-item active");

        let carouselImg = $("<img>");
        carouselImg.attr("id", "js-image");
        carouselImg.addClass("d-block w-100");
        carouselImg.attr("src", this.imagesURL[0]);

        firstDiv.append(carouselImg);

        $("#js-carousel-inner").append(firstDiv);

        for (let i = 1; i < (this.imagesURL).length; i++) {

            console.log(this.imagesURL);
            let carouselDiv = $("<div>");
            carouselDiv.attr("id", "js-carousel-item");
            carouselDiv.addClass("carousel-item");

            let carouselImgs = $("<img>");
            carouselImgs.attr("id", "js-image");
            carouselImgs.addClass("d-block w-100");
            carouselImgs.attr("src", this.imagesURL[i]);

            carouselDiv.append(carouselImgs);

            $("#js-carousel-inner").append(carouselDiv);
        }   
    });   
}
    //More Info button click
    $(document).on('click', '#moreInfo', function(){
        $('html, body').animate({
            scrollTop: $(".js-info").offset().top
        }, 1000);
    })

$(".carousel").carousel();



