var map;
var pos;
var mc = 'person.png';
var marker;
var closest = {d: '-1', stat: '0'};
var curr_info = new google.maps.InfoWindow();
var mkr = new Array;
var main_line = new Array;
var branch_line = new Array;
var dist = 0;
var station_list = "";
var route = new Array;
//store all station locations
var alewife =  {lat:42.395428 , lng:   -71.142483};
var davis  =  {lat:42.39674, lng: -71.121815};
var porter = {lat: 42.3884, lng: -71.11914899999999};
var harvard = {lat: 42.373362, lng: -71.118956};  
var central = {lat: 42.365486 , lng:  -71.103802};
var kendall =  {lat:42.36249079 , lng:  -71.08617653};
var charles =  {lat: 42.361166 , lng:-71.070628};
var park = {lat:42.35639457,lng: -71.0624242};
var d_crossing =   {lat:42.355518 , lng: -71.060225};
var south = {lat: 42.352271, lng: -71.05524200000001};
var broadway = {lat: 42.342622, lng:-71.056967};
var andrew = {lat:42.330154, lng: -71.057655}
var JFK= { lat: 42.320685, lng:-71.052391};
var savin ={lat:42.31129, lng:-71.053331};
var n_quincy = {lat: 42.275275, lng: -71.029583};
var shawmut =  {lat: 42.29312583, lng: -71.06573796000001};
var quincy_center =  {lat: 42.251809 , lng:-71.005409};
var quincy_adams =   {lat:  42.233391 , lng: -71.007153};
var ashmont =   {lat: 42.284652 , lng: -71.06448899999999};
var wollaston = {lat: 42.2665139 , lng: -71.0203369};
var fields_c =  {lat:  42.300093 , lng:    -71.061667};
var braintree =   {lat: 42.2078543 , lng: -71.0011385};

//create an array of all station locations
stations = [alewife, davis, porter, harvard, central, kendall, charles, park, d_crossing,
south, broadway, andrew, JFK, n_quincy, wollaston, quincy_center, quincy_adams, braintree,savin, fields_c, shawmut, ashmont];

//parallel array to access names of stations
station_names  = ['Alewife', 'Davis', 'Porter Square', 'Harvard Square', 'Central Square', 'Kendall/MIT', 'Charles/MGH', 'Park Street', 'Downtown Crossing',
'South Station', 'Broadway', 'Andrew', 'JFK', 'North Quincy', 'Wollaston', 'Quincy Center', 'Quincy Adams', 'Braintree', 'Savin Hill', 'Fields Corner', 'Shawmut', 'Ashmont'];

//initMap() is called when page is loaded, loads map and calls helper functions
//to set up markers & data
function initMap() {
  //initiates map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.352271, lng: -71.05524200000001},
    zoom: 10
  });

  //loads train info 
  getJSON();
  //sets markers on the map for stations
  markMap();
  //gets geolocation
  getLoc();
}

//sets markers for each station and calls function to draw polyline 
function markMap(){
  marker = 'tsign.png';
  stations.forEach(mark);
  mkr.forEach(set_marker);
  line();
}

//forEach function to place a mark on each station
//stores marker in array mkr
function mark(item, index){
  mkr[index] = new google.maps.Marker({
    position: item,
    map: map,
    icon:marker
  });
}


//draws polylines
function line(){
  //builds a path for the red line
  stations.forEach(fp);

  //draws line for the line going from Alewife to Braintree
  var mainPath = new google.maps.Polyline({
    path: main_line,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  //draws line from JFK to Ashmont 
   var branchPath = new google.maps.Polyline({
    path: branch_line,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  //puts paths on map
  mainPath.setMap(map);
  branchPath.setMap(map);
}

//for each station, loads path arrays with lat/lng information in correct order
function fp(item, index){
  if (index <= 17){
    main_line.push(item);
  }
  if (index == 12){
    branch_line.push(item);
  }
  if (index > 17){
    branch_line.push(item);
  }
}

//stores current location using geolocation
function getLoc(){
  //if client allows location access
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        //stores lat and long in variable pos
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      map.setCenter(pos);
      //calls mark_curr to mark the current location
      mark_curr(pos);
      //find_closest searches for the closest station
      find_closest();
      });
  }
  //geolocation is not allowed
  else {
    alert("Sorry! Geolocation is not supported by your browser!");
  } 
}
 
 //places a person marker at the current location 
function mark_curr(cl){
   var curr_mark = new google.maps.Marker({
    position: cl,
    map: map,
    icon: mc
  });
   //each time mark is clicked, a window with closest station & distance appears
   curr_mark.addListener('click', function(){
    curr_info.setContent("<p>Closest station: " + station_names[closest.stat]+"</p>" +
      "Distance: " + Math.round(closest.d*1000)/1000 + " miles away");
    curr_info.open(map,curr_mark);
   });
}

//calls calcDist for each station -- finds the closest station
function find_closest(){
  stations.forEach(calcDist);
  curr_line();
}

//uses the Haversine formula to calculate shortest distance to a station
function calcDist(item,index){
  Number.prototype.toRad = function() {
   return this * Math.PI / 180;
  }


  var lat2 = item.lat; 
  var lon2 = item.lng; 
  var lat1 = pos.lat; 
  var lon1 = pos.lng; 

  var R = 6371; // km 
  //has a problem with the .toRad() method below.
  var x1 = lat2-lat1;
  var dLat = x1.toRad();  
  var x2 = lon2-lon1;
  var dLon = x2.toRad();  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);  
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 

  if (closest.d == -1){
    closest.d = d;
    closest.stat = index;
  }
  if (closest.d != '-1' && closest.d > d){
    closest.d = d;
    closest.stat = index;
  }
}

//draws the polyline from current location to closest station
function curr_line(){
  //creates a path from pos (current location) to closest station
  route.push(pos);
  route.push(stations[closest.stat]);
  var to_stop = new google.maps.Polyline({
    path: route,
    geodesic: true,
    strokeColor: '#0000FF',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  to_stop.setMap(map);

}




//gets JSON from remote server 
function getJSON(){
  //creates XMLHTTP reqeuest
  request = new XMLHttpRequest();

  request.open("GET", 'https://rocky-taiga-26352.herokuapp.com/redline.json', true);
  // Step 3: Create handler function to do something with data in response
  
  request.onreadystatechange = function(){
    //if the request is successful
    if (request.readyState == 4 && request.status == 200) {
      // gets response text
      theData = request.responseText;
      //parses the JSON, stores it in schedule
      schedule = JSON.parse(theData);
    }
    //404 error, for instance
    else if(request.readyState == 4 && request.status != 200) {
          alert("We can't seem to load train data. Please refresh your browser");
    }
    //still waiting for status 
    else {
          console.log("In progress...");
    }
  }
  request.send();
}
var count = 1;
//adds event listener to collect a list of upcoming trains when an icon is clicked
function set_marker(item,index){
  //adds listener for every marker to display upcoming trains when clicked
  item.addListener('click', function(){
    station_list = "";
    count = 1; 
    for (var i = 0; i < schedule.TripList.Trips.length; i++){
      for (var j = 0; j < schedule.TripList.Trips[i].Predictions.length; j++){
        if (station_names[index] == schedule.TripList.Trips[i].Predictions[j].Stop){
          station_list += "<p>" + count + ". " + schedule.TripList.Trips[i].Destination + "</p>";
          count++;
        }
      }
    }
    
    curr_info.setContent("<p>Upcoming Trains at " + station_names[index] + ": <p>" + station_list );
    curr_info.open(map,item);
  });
}





