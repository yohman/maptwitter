var tl;
 
function onLoad() {
	 
  	var eventSource = new Timeline.DefaultEventSource(0);
	var theme = Timeline.ClassicTheme.create();
	theme.event.instant.icon = "no-image-40.png";
	theme.event.instant.iconWidth = 0;  // These are for the default stand-alone icon
	theme.event.instant.iconHeight = 0;
	
	var d = "Thu, 24 Feb 2011 08:00:04 GMT";
	
	var bandInfos = [
		Timeline.createBandInfo({
			width:          "93%", 
			intervalUnit:   Timeline.DateTime.MINUTE, 
			intervalPixels: 280,
			eventSource:    eventSource,
			date:           d,
			theme:          theme,
			eventPainter:   Timeline.CompactEventPainter,
			eventPainterParams: {
				iconLabelGap:     5,
				labelRightMargin: 20,
				
				iconWidth:        0, // These are for per-event custom icons
				iconHeight:       0,
				
				stackConcurrentPreciseInstantEvents: {
					limit: 5,
					moreMessageTemplate:    "%0 More Events",
					icon:                   "no-image-80.png", // default icon in stacks
					iconWidth:              0,
					iconHeight:             0
				}
			},
			zoomIndex:      2,
			zoomSteps:      new Array(
				{pixelsPerInterval: 560,  unit: Timeline.DateTime.MINUTE},
				{pixelsPerInterval: 280,  unit: Timeline.DateTime.MINUTE},// DEFAULT zoomIndex
				{pixelsPerInterval: 140,  unit: Timeline.DateTime.MINUTE},
				{pixelsPerInterval:  70,  unit: Timeline.DateTime.MINUTE},
				{pixelsPerInterval:  35,  unit: Timeline.DateTime.MINUTE},
				{pixelsPerInterval: 280,  unit: Timeline.DateTime.HOUR},
				{pixelsPerInterval: 140,  unit: Timeline.DateTime.HOUR},
				{pixelsPerInterval:  70,  unit: Timeline.DateTime.HOUR},
				{pixelsPerInterval:  35,  unit: Timeline.DateTime.HOUR},
				{pixelsPerInterval: 400,  unit: Timeline.DateTime.DAY},
				{pixelsPerInterval: 200,  unit: Timeline.DateTime.DAY},
				{pixelsPerInterval: 100,  unit: Timeline.DateTime.DAY},
				{pixelsPerInterval:  50,  unit: Timeline.DateTime.DAY},
				{pixelsPerInterval: 400,  unit: Timeline.DateTime.MONTH},
				{pixelsPerInterval: 200,  unit: Timeline.DateTime.MONTH},
				{pixelsPerInterval: 100,  unit: Timeline.DateTime.MONTH} 
			)
		})
	];
   
	tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
	//tl.loadJSON("simile.php?start=2011-02-24T00:00:04", function(json, url) { eventSource.loadJSON(json, url); });
}

var resizeTimerID = null;
function onResize() {
	if (resizeTimerID == null) {
		resizeTimerID = window.setTimeout(function() {
			resizeTimerID = null;
			tl.layout();
		}, 500);
	}
}

function centerTimeline(time) {
	tl.getBand(0).scrollToCenter(Timeline.DateTime.parseGregorianDateTime('2011-02-24'));
}

function addEvent() {
	// this doesn't work, need help!
	var evt = new Timeline.DefaultEventSource.Event({"id":"10139","icon":"http://a0.twimg.com/profile_images/1131006455/avatar_100x1002_normal.jpg","start":"2011-02-25T00:01:23"});

	var es = tl.getBand(0).getEventSource(); 
	es.add(evt);    //Your already created event 
	tl.layout(); 
}
