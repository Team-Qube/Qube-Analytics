$(document).on('ready', function(){
	var socket = io(document.URL);

	socket.on('init', function(data){
		var content="";
		for(var i = 0; i<data.data.length; i++){
			var time =moment(new Date(data.data[i].lastLogin));
			content+="<tr id='"+data.data[i]._id+"'><td id='userID'> ID: "+data.data[i]._id+"</td><td class='lastLogin' id="+data.data[i].lastLogin+">"+time.fromNow()+"</td><td class='loginCount'>"+data.data[i].loginCount+"</td></tr>";
		}
		$('table').append(content);
	});

	socket.on('update', function(data){
		console.log('updating...');
		var time = moment(new Date(data.data.lastLogin));
		$('#'+data.data.id + ' td.lastLogin').text(time.fromNow());
		$('#'+data.data.id + ' td.lastLogin').attr('id', data.data.lastLogin);
		$('#'+data.data.id + ' td.loginCount').text(data.data.loginCount);
	});

	socket.on('viewCount', function(data){
		$('#viewCount').text('Page view count: '+data.data[0].totalCount);
	});

	socket.on('dates', function(data){
		var chartData = [{
			values:[],
			key: 'Page Views'
		}];
		for(var i=0; i<data.data.length; i++){
			chartData[0].values.push({
				x: new Date(data.data[i].x),
				y: data.data[i].y
			})
		}
		nv.addGraph(function() {  

		var chart = nv.models.lineChart()
					.margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
		        .transitionDuration(350)  //how fast do you want the lines to transition?
		        .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
		        .showYAxis(true)        //Show the y-axis
		        .showXAxis(true)        //Show the x-axis;

		chart.xAxis
		   .axisLabel('Date')
		   .rotateLabels(-45)
		   .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); });


		chart.yAxis
		   .axisLabel('Page Views')
		   .tickFormat(d3.format('d'));

		d3.select('#chart svg')
		   .datum(chartData)
		 	.transition().duration(500)
		    .call(chart);

		nv.utils.windowResize(function() { d3.select('#chart svg').call(chart) });

	       return chart;
	     });
	});

	socket.on('playlistCount', function(data){
		$('#playlistCount').text('Playlist count: '+data.data[0].count);
	});

	setInterval(function(){
		$('td.lastLogin').map(function(){
			var time = moment(new Date($(this).attr('id'))).fromNow();
			if ($(this).text() !== time){
				$(this).text(time);
			}
		});
	},5000);
});