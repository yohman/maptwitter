google.load('visualization', '1', {'packages':['annotatedtimeline']});
google.setOnLoadCallback(drawChart);

function drawChart() {
  
  
  $.getJSON('http://maptwitter.org/scripts/tweet_query_count.php', function(data)
  {
	  var datearray = [];
	  $.each(data.result, function(key,val)
	  {
		 datearray.push([new Date(val.year, val.month, val.day, val.hour),parseInt(val.count)]);
	  });

	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	data.addColumn('number', 'Number of tweets');
	data.addRows(datearray);

	var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
	chart.draw(data, 
	{
		displayAnnotations: true,
		displayZoomButtons: false,
		dateFormat: 'HH:mm MMMM dd, yyyy',
		fill: 50
	
	});

	google.visualization.events.addListener(chart, 'rangechange', function(data){console.log(data)});

  });
  
  
}
