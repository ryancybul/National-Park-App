//Loads map on page load
function initMap() {
    //Map options
    let options = {
        zoom: 4.3,
        center:{lat:39.8283,lng:-98.5795}
    }

    //Displays the map
    let map = new
    google.maps.Map(document.getElementById('map'), options);

        //AJAX right hurr.
    
        let queryURL = "https://developer.nps.gov/api/v1/parks?limit=504&q=" + parkName + "&api_key=1w64xYKjzt6YExOPqZE6qtvVHCE3ZAOO7xrQgUAV";
        console.log(queryURL);
        $.ajax({ url: queryURL, method: "GET" })
        .then(function(response) {
          let results = response.data;
          console.log(results);
          for (var i = 0; i < results.length; i++) {
            console.log(results[i].fullName);
          }
        });

        //function markers(parkDataArray){
        var markers = [
        {
            coords:{lat:41.896798,lng:-87.618804},
            content:'<h1>Oh hai!</h1>'
        },
        {
            coords:{lat:37.8651,lng:-119.5383},
            content:'<h1>Hello!</h1>'
        },
        ]

        //Loop through markers
        for(var i = 0; i < markers.length;i++){
            addMarker(markers[i]);
        }
        
        //Add marker function
        function addMarker(props) {
            let marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: props.coords,
                map: map,
                icon: './assets/images/Tree_Icon.svg'
            });

            if(props.content){
                let infoWindow = new google.maps.InfoWindow({
                content:props.content
            });
            //To do: Make it so only one info window can be open at once. 
            //When marker is clicked open window. 
            marker.addListener('click', function(){
                infoWindow.open(map, marker);
            });
            }
        }
    }



