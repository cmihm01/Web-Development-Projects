var map;
//var request = new XMLHttpRequest();
//var me = new google.maps.LatLng(myLat, myLong);
var pos;
var mc = 'person.png';
//var infowindow = new google.maps.InfoWindow();
var marker;
var closest = {d: '-1', stat: '0'};
 var curr_info = new google.maps.InfoWindow({
  content: "hi"
 })
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

stations = [alewife, davis, porter, harvard, central, kendall, charles, park, d_crossing,
south, broadway, andrew, JFK, n_quincy, wollaston, quincy_center, quincy_adams, braintree];

branch = [JFK,savin, fields_c, shawmut, ashmont];


station_names  = ['Alewife', 'Davis', 'Porter', 'Harvard', 'Central', 'Kendall/MIT', 'Charles/MGH', 'Park Street', 'Downtown Crossing',
'South', 'Broadway', 'Andrew', 'JFK', 'North Quincy', 'Wollaston', 'Quincy Center', 'Quincy Adams', 'Braintree'];

function initMap() {
  //initiates map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.352271, lng: -71.05524200000001},
    zoom: 8
  });

  //marks each station
  getJSON();
  markMap();
  getLoc();
}
function markMap(){
  marker = 'star.png';
  stations.forEach(mark);
  branch.forEach(mark);
  mkr.forEach(set_marker);
  line();
}
var infoWindow = new google.maps.InfoWindow({map:map});

function getLoc(){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    console.log(pos);
    console.log("hi");
    map.setCenter(pos);
    mark_curr(pos);
    find_closest();
    });
  } 
}
    

  


  //draws polylines
function line(){
  flight_path = new Array;
  branch_fp = new Array;
  stations.forEach(fp);
  branch.forEach(bfp)
  branch.forEach
  console.log("in line");
   var flightPath = new google.maps.Polyline({
            path: flight_path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
   var branchPath = new google.maps.Polyline({
     path: branch_fp,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
  });
  flightPath.setMap(map);
  branchPath.setMap(map);
}


function fp(item, index){
  flight_path.push(item);
}
function bfp(item, index){
  branch_fp.push(item);
}
var mkr = new Array;

function mark(item, index){
  mkr[index] = new google.maps.Marker({
    position: item,
    map: map,
    icon:marker
  });
}


function mark_curr(cl){
  console.log("mc");
   var curr_mark = new google.maps.Marker({
    position: cl,
    map: map,
    icon: mc
  });
   curr_mark.addListener('click', function(){
    curr_info.setContent("<p>Closest station: " + station_names[closest.stat]+"</p>" +
      "Distance:" + closest.d);
    curr_info.open(map,curr_mark);

   });

}

var route = new Array;

function curr_line(){
  console.log("in curr line");
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

function find_closest(){
  stations.forEach(calcDist);
  console.log('curr_line');
   curr_line();
}

function calcDist(item,index){
  console.log('cd');
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
  console.log(d);
}


// Step 1: create an instance of XMLHttpRequest
request = new XMLHttpRequest();
// Step 2: Make request to remote resource
// NOTE: https://messagehub.herokuapp.com has cross-origin resource sharing enabled
function getJSON(){
  request.open("GET", 'https://rocky-taiga-26352.herokuapp.com/redline.json', true);
  // Step 3: Create handler function to do something with data in response
  
  request.onreadystatechange = function(){
     if (request.readyState == 4 && request.status == 200) {
    console.log("in rs");
   // Step 5A: get the response text
    theData = request.responseText;
    console.log("the data:" + theData);
   // Step 5B: parse the text into JSON
    schedule = JSON.parse(theData);
  }

    else if(request.readyState == 4 && request.status != 200) {
          console.log("Not good");
    }

    else {
          console.log("In progress...");
    }
  }
  request.send();
  
}

function set_marker(item,index){
  console.log("in set_marker");
  item.addListener('click', function(){
    curr_info.setContent("<p>Closest station: <p>");
    curr_info.open(map,item);

   });

}



