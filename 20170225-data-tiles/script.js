var supportedDataZoom = [0, 8, 9, 10];

// Map creation
var map = L.map('map', { fullscreenControl: true }).setView([48.850258, 2.351074], 11);
var markers = L.layerGroup().addTo(map);

L.tileLayer('//a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('movestart', mapMoveStart);
map.on('moveend', mapMoved);
mapMoved();
 





function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }


function processJSON(data) {
	for (var i = 0; i < data.length; i++) {
		L.marker([data[i].latitude, data[i].longitude]).addTo(markers)
	    .bindPopup(data[i].name);
	}
}


function mapMoveStart(e) {
	markers.clearLayers();
}

function mapMoved(e) {
	var zoom = map.getZoom();
	var bounds = map.getBounds();
	var west = bounds.getWest();
	var south = bounds.getSouth();
	var east = bounds.getEast();
	var north = bounds.getNorth();
	
	// Determine which set of data we are going to use
	var dataZoom = 0;
	for(i=0; i<supportedDataZoom.length; i++) {
		if(zoom > supportedDataZoom[i] + 2) {
			dataZoom = supportedDataZoom[i];
		}
	}
	
	//message
	document.getElementById("msg").innerHTML = 'We are displaying zoom ' + zoom + '. We are showing data from level ' + dataZoom;
	
	
	// Determine which tile we need
	var dataEast = long2tile(east, dataZoom);
	var dataWest = long2tile(west, dataZoom);
	var dataNorth = lat2tile(north, dataZoom);
	var dataSouth = lat2tile(south, dataZoom);
	
	var dataTiles = [];
	var width = (dataEast - dataWest + 1) * 128;
	document.getElementById("tiles-loaded").innerHTML ='';
	document.getElementById("tiles-loaded").style.lineHeight = '0px';
	document.getElementById("tiles-loaded").style.width = '' + width + 'px';
	for(y = dataNorth; y < dataSouth + 1; y++) {
		for(x = dataWest; x < dataEast + 1; x++) {
			$.ajax({
			    url: 'adm4/' + dataZoom + '/' + dataZoom + '-' + x + '-' + y + '.json',
			    jsonp: false,
			    dataType: "json"
			}).done(function(data){
				processJSON(data);
			});
			document.getElementById("tiles-loaded").innerHTML += '<img style="width:128px; height:128px; border-right:1px solid blue; border-bottom:1px solid blue;" src="//a.tile.openstreetmap.org/' + dataZoom + '/' + x + '/' + y + '.png" />';
		}		
	}
}
