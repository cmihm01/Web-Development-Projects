var map;
//var request = new XMLHttpRequest();
//var me = new google.maps.LatLng(myLat, myLong);
var pos;
var mc = 'person.png';
//var infowindow = new google.maps.InfoWindow();
var marker;
var closest = {d: 'NULL', stat: 'NULL'};
 var curr_info = new google.maps.InfoWindow({
  content: "hi"
 })
var alewife =  {"alewife", {lat:42.395428 , lng:   -71.142483}};
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


function initMap() {
  //initiates map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.352271, lng: -71.05524200000001},
    zoom: 8
  });

  //marks each station
  markMap();
  getLoc();
}
function markMap(){
  marker = 'star.png';
  stations.forEach(mark);
  branch.forEach(mark);
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

function mark(item, index){
  var mkr = new google.maps.Marker({
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
    find_closest();
    curr_info.setContent("closest:" + closest.d + "station: " + stations[closest.stat]);
    curr_info.open(map,curr_mark);
   });
}

function find_closest(){
  stations.forEach(calcDist);
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

if (closest.d == 'NULL'){
  closest.d = d;
  closest.stat = index;
}
if (closest.d != 'NULL' && closest.d > d){
  closest.d = d;
  closest.stat = index;
}
console.log(d);
}

