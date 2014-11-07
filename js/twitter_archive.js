var distanceWidget;
var map;
var geocodeTimer;
var geocoder;
var profileMarkers = [];
var interval = 5; //seconds

google.load('earth', '1');
var googleEarth;

function trace(message) 
{ 
	if (typeof console != 'undefined') 
	{
		console.log(message);
	}
}

//detect iphone/ipad
function isiPhone(){
    return (
        (navigator.platform.indexOf("iPhone") != -1) ||
        (navigator.platform.indexOf("iPod") != -1) ||
		(navigator.platform.indexOf("iPad") != -1) 
    );
}

function init() 
{
	var mapDiv = document.getElementById('map');
	var center =  new google.maps.LatLng(34.07559239398227, -118.44074428081512);
	map = new google.maps.Map(mapDiv, {
		center: center,
		zoom: 1,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.TERRAIN,google.maps.MapTypeId.HYBRID ]
		},
  		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	if (isiPhone() == false)
	{		
		//googleEarth = new GoogleEarth(map);
	}
	

	distanceWidget = new DistanceWidget({
		map: map,
		distance: 50, // Starting distance in km.
		maxDistance: 2500, // Twitter has a max distance of 2500km.
		color: '#6782c5',
		activeColor: '#5599bb',
		sizerIcon: new google.maps.MarkerImage('images/resize-off.png'),
		activeSizerIcon: new google.maps.MarkerImage('images/resize.png')
	});

	google.maps.event.addListener(distanceWidget, 'distance_changed', updateDistance);
	
	google.maps.event.addListener(distanceWidget, 'position_changed', updatePosition);
	
	map.fitBounds(distanceWidget.get('bounds'));
	
	updateDistance();
	//updatePosition();
	addActions();
	geocoder = new google.maps.Geocoder();
	createGeocoderControl();

	//allow search pressing "enter"
	$('#q').keypress(function(e) {
		if(e.which == 13) {
			start();
		}
	});


	//update the twitter timestamps every 60 seconds
	setInterval('$("abbr.timeago").timeago()',60000);
}

var timer;

function start()
{
	markercount = 0;
	clearInterval(timer);
	search();
	timer = setInterval('search()',interval*1000);	
}

function pause()
{
	clearInterval(timer);
	$('#status').html('Paused... <a href="javascript:void(0)" onclick="start()">restart</a>');
	
}

function cleardata()
{
	markercount = 0;
	clearMarkers();
	$('#results').html('');
}

function createGeocoderControl() 
{
	var control = document.createElement('input');
	control.style.fontSize = '10pt';
	control.style.margin = '5px';
	control.onkeyup = submitGeocode(control);
	control.style.color = "#808080";
	control.value = "Enter location...";
	control.onfocus = function() {
		control.style.color = "#000000";
		control.value = "";
	}
	control.onblur = function() {
		control.style.color = "#808080";
		control.value = "Enter location...";
	}
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(control);
}

function submitGeocode(control) {
	return function(e) 
	{
		var keyCode;
		
		if (window.event) 
		{
			keyCode = window.event.keyCode;
		} 
		else if (variable) 
		{
			keyCode = e.which;
		}
		
		if (keyCode == 13) 
		{
			geocoder.geocode( { address: control.value }, function(results, status) 
			{
				if (status == google.maps.GeocoderStatus.OK) 
				{
					map.panTo(results[0].geometry.location);
					marker.setPosition(results[0].geometry.location);
					start();
				} 
				else 
				{
					alert("The location entered could not be found");
				}
			})
		}
	}
}

function geocode(location) {
	if (location != undefined)
	{
		var address = location;
	}
	else
	{
		var address = document.getElementById("geocode").value;
	}
	geocoder.geocode( { address: address }, function(results, status) 
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			map.panTo(results[0].geometry.location);
			marker.setPosition(results[0].geometry.location);
			start();
			$('#about').fadeOut();
			$('#fullscreen').fadeOut();			
		} 
		else 
		{
			alert("The location \"" + address + "\" entered could not be found");
		}
	})
}

function updatePosition() 
{
	//start();
	pause();
	last_id = '';
	clearMarkers();
	$('#results').html('');
	if (geocodeTimer) 
	{
		window.clearTimeout(geocodeTimer);
	}

	// Throttle the geo query so we don't hit the limit
	geocodeTimer = window.setTimeout(function() 
	{
		reverseGeocodePosition();
	}, 200);
}

function reverseGeocodePosition() {
  var pos = distanceWidget.get('position');
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': pos}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        $('#of').html('of ' + results[1].formatted_address);
        return;
      }
    }

    $('#of').html('of somewhere');
  });
}

function updateDistance() {
	pause();
	last_id = '';
	var distance = distanceWidget.get('distance');
	$('#dist').html(distance.toFixed(2));
	clearMarkers();
	$('#results').html('');
	
	//search();
}

function addActions() 
{
	var s = $('#s').submit(search);
	
	$('#close').click(function() 
	{
		$('#cols').removeClass('has-cols');
		google.maps.event.trigger(map, 'resize');
		map.fitBounds(distanceWidget.get('bounds'));
		$('#results-wrapper').hide();
		
		return false;
	});
}

var last_id;
var last_p;
var pos_changed;
var last_d;
var dis_changed;
var count = 1;
var last_q;
var q_changed;

function search(e) 
{
	//alert('search' + $('#q').val());
	//e.preventDefault();
	var q = $('#q').val();
	/*
	if (q == '') {
		return false;
	}
	*/
	var d = distanceWidget.get('distance');
	var p = distanceWidget.get('position');
	
	//trace(last_id);
	var url = 'http://search.twitter.com/search.json?since_id='+last_id+'&dummy='+count+'&callback=addResults' +
	'&rpp=50&q=' + escape(q) + '&geocode=' + escape(p.lat() + ',' + p.lng() +
	',' + d + 'km');
	
	count ++;
	
	//check if search query changed
	if (q == last_q)
	{
		q_changed = false;
	}
	else
	{
		$('#results').html('');
		clearMarkers();
		last_id = '';
		last_q = q;
		q_changed = true;
	}
	
	//check if location changed
	if (p == last_p)
	{
		pos_changed = false;
	}
	else
	{
		last_p = p;
		pos_changed = true;
	}
	
	//check if distance changed
	if (d == last_d)
	{
		dis_changed = false;
	}
	else
	{
		last_d = d;
		dis_changed = true;
	}
	
	
	$.getScript(url);
	
}

function clearMarkers() {
  for (var i = 0, marker; marker = profileMarkers[i]; i++) {
    marker.setMap(null);
  }
  if (tweetmarker)
  {
	  for (i in tweetmarker)
	  {
		  tweetmarker[i].setMap(null);
	  }
  }
}

var tweetmarker = [];


function showMarker(i)
{
	if (tweetmarker[i])
	{
		tweetmarker[i].setAnimation(google.maps.Animation.BOUNCE);
		tweetmarker[i].setZIndex(11);
	}
}

function hideMarker(i)
{
	if (tweetmarker[i])
	{
		tweetmarker[i].setAnimation(null);
		tweetmarker[i].setZIndex(10);
	}
}

var markercount = 0;


function getTweetArchive()
{
	$.getJSON('http://maptwitter.org/scripts/tweet_query.php',function(data){addResults(data)});
}

function addResults(json) 
{

		//clearMarkers();

		//$('#results').html('Searching...');
		var cols = $('#cols');
		if (!cols.hasClass('has-cols')) 
		{
			$('#cols').addClass('has-cols');
			google.maps.event.trigger(map, 'resize');
			map.fitBounds(distanceWidget.get('bounds'));
		}

		var results = $('#results');
		//results.innerHTML = '';
		html = [];
		
		if (json.result && json.result.length) 
		{
			last_id = json.max_id_str;
			// update status text
			$('#status').html('Found '+ json.result.length + ' tweet' + ((json.result.length > 1) ? "s" : "") + ' in the last ' + interval + ' seconds... <a href="javascript:void(0)" onclick="pause()">pause</a> | <a href="javascript:void(0)" onclick="cleardata()">clear</a>' );
			
			for (var i = 0, tweet; tweet = json.result[i]; i++) 
			{
				console.log(tweet);
				var from = tweet.username;
				var profileImageUrl = tweet.profile_image_url;
				var loc = tweet.location;
				var tweeturl = 'http://twitter.com/#!/'+from+'/status/'+tweet.twitter_id;
				// Check if the location matches a latlng
				var point = loc.match(/-?\d+\.\d+/g);
				if (point && point.length == 2) 
				{
					var mappedtweeturl = 'http://twitter.com/#!/'+from+'/status/'+tweet.twitter_id;
					var image = new google.maps.MarkerImage(profileImageUrl,
					new google.maps.Size(48, 48),
					new google.maps.Point(0, 0),
					new google.maps.Point(24, 24),
					new google.maps.Size(24, 24));
					
					var pos = new google.maps.LatLng(parseFloat(point[0], 10),
					parseFloat(point[1], 10));
					
					tweetmarker[markercount] = new google.maps.Marker(
					{
						map: map,
						position: pos,
						icon: image,
						zIndex: 10,
						animation: google.maps.Animation.DROP
					});
					
					google.maps.event.addListener(tweetmarker[markercount], 'click', function() {
						//top.location.href = url;
						window.open(mappedtweeturl);
					});
	
					html.push('<div class="tweet" onMouseOver="showMarker('+markercount+')" onMouseOut="hideMarker('+markercount+')"><span class="thumb">');
				}
				else
				{		
					html.push('<div class="tweet"><span class="thumb">');
				}
				html.push('<a href="'+tweeturl+ '" target="_blank">');
				html.push('<img src="' + profileImageUrl + '"/></a></span>');
				html.push('<div class="body"<a href="http://twitter.com/' + from);
				html.push('"></a>');
				html.push('<abbr class="timeago" title="'+tweet.time+'">'+$.timeago(tweet.time)+'</abbr><br>');
				html.push(tweet.text);
				html.push('</div><div class="body location">From: ' + from);
				html.push(', near ' + loc);
				html.push('</div></div>');
					markercount ++;
			}
		} 
		else 
		{
			$('#status').html('Found 0 tweets in the last ' + interval + ' seconds.... <a href="javascript:void(0)" onclick="pause()">pause</a> | <a href="javascript:void(0)" onclick="cleardata()">clear</a>');

			//$('#results').html('');
			//html.push('<div class="no-tweets">No tweets found.</div>');
		}
		
		$(results).prepend($(html.join('')).hide().fadeIn('slow'));
		$('#results-wrapper').show();
		trace(markercount);
		
		//flush data
		if (markercount > 500)
		{
			alert('Are you still there? You have reached 500 tweets!  Click "OK" to start your search again...');
			cleardata();
		}
}

google.maps.event.addDomListener(window, 'load', init);
