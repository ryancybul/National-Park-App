//Variables
let parkObject = [];

//
function initMap() {
    //Map options
    let options = {
        zoom: 4.3,
        center:{lat:39.8283,lng:-98.5795}
    }
    //Displays the map
    let map = new
    google.maps.Map(document.getElementById('map'), options);

    //AJAX Call for NPS API
    let queryURL = "https://developer.nps.gov/api/v1/parks?limit=504&q=&api_key=1w64xYKjzt6YExOPqZE6qtvVHCE3ZAOO7xrQgUAV";
    console.log(queryURL);
    $.ajax({ url: queryURL, method: "GET" })
    .then(function(response) {
        let results = response.data;
    let parkDataArray =  results.filter(function(cur,i){
            return cur.fullName.indexOf('National Park')>-1;
        })
        console.log('Filtered array: ', parkDataArray.length);
        markers(parkDataArray);
    });

    //Function to run markers
    function markers(parkDataArray){
    for(var i = 0; i < parkDataArray.length;i++){
        if(parkDataArray[i].latLong){
            let latLong = parkDataArray[i].latLong.split(', ');
            let lat = +latLong[0].slice(4);
            let long = +latLong[1].slice(5);

            let parkObj = {
                name: parkDataArray[i].fullName,
                description: parkDataArray[i].description,
                coords:{lat: lat,lng: long},
                directions: parkDataArray[i].directionsInfo,
                weather: parkDataArray[i].weatherInfo,
                url: parkDataArray[i].url,
            }
            console.log(parkObj);
            addMarker(parkObj);
            parkObject.push(parkObj);
            }
        }
        console.log(parkObject);
    }



    //Add marker function
    function addMarker(parkInfo) {
        let marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: parkInfo.coords,
            map: map,
            name: parkInfo.name,
            description: parkInfo.description,
            directions: parkInfo.directions,
            icon: './assets/images/Tree_Icon.svg'
        });

        //Info window click event
        let infoWindowContent = "<div >" + parkInfo.name + "</div>" + "<div>" + parkInfo.description + "</div>" + '<button>'+'More Info'+'</button>';
        let infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        });
        
        //To do: Make it so only one info window can be open at once. 
        //When marker is clicked open window. 
        marker.addListener('click', function(){
        infoWindow.open(map, marker);
        });    
    }
}





