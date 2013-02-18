var map;
var latlngs = [];
var markers = [];
var index = 0;
var follow_timer;

function initMap () {
    console.log("initMap");
    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/brianhouse.map-124z30te/{z}/{x}/{y}.png'),
        center: new L.LatLng(41.819900, -71.400500),
        zoomControl: true,
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: true,
        touchZoom: false,
        dragging: true,
        keyboard: false,
        zoom: 13,
        minZoom: 3,                    
        maxZoom: 17
    });     
    // map.panTo([42.352455, -71.048069]);
    // map.setZoom(17);    
}

function hsvToRgb (h, s, v) {
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r * 255, g * 255, b * 255];
}


function loadPoints (start_date, end_date) {
    console.log("loadPoints");
    $.getJSON("openpaths_house.json", function(data) {
        $.each(data, function(index, location_object) {
            var date = new Date(location_object['t'] * 1000);
            if (date >= start_date && date <= end_date) {
                var latlng = new L.LatLng(location_object['lat'], location_object['lon']);
                latlngs.push(latlng);
                var hue = date.getHours() / 23;
                var rgb = hsvToRgb(hue, 1.0, 1.0);                
                color = "#" + ("0" + rgb[0].toString(16)).slice(-2) + ("0" + rgb[1].toString(16)).slice(-2) + ("0" + rgb[2].toString(16)).slice(-2)
                var marker = L.circleMarker(latlng, {radius: 5, clickable: false, color: "#000", fillColor: color, fillOpacity: 0.6}).addTo(map);     
                markers.push(marker);
            }
        });
        L.polyline(latlngs, {color: "#0f0", weight: 2, opacity: 0.25}).addTo(map);    
        map.panTo(getCenter());
        startFollow();
    });    
}

function getCenter () {
    console.log("getCenter");
    var lats = 0;
    var lngs = 0;
    for (var i=0; i<markers.length; i++) {
        lats += markers[i].getLatLng().lat;
        lngs += markers[i].getLatLng().lng;
    }
    return new L.LatLng(lats / markers.length, lngs / markers.length);
}


function startFollow () {
    index = 0;
    follow_timer = setInterval(nextPoint, 1000);
}

function nextPoint () {
    map.panTo(latlngs[index]);
    index++;
    if (index == latlngs.length) {
        clearInterval(follow_timer);
    }
}

function getDate (str) {
  var d = str.match(/\d+/g); // extract date parts
  return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]); // build Date object
}

$(document).ready(function() {                   

    var start_date = getDate("2013-02-16 00:00:00");
    var end_date = getDate("2013-02-22 18:10:00");

    loadPoints(start_date, end_date);
    initMap();
    

    // recreate morning, evening, night views from openpaths data
    // need a scale

    // connect the points with a line
    // follow them                
    // this is wrong -- should follow with appropriate timing


});
