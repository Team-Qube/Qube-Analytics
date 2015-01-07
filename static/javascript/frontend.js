$(document).on('ready', function(){
	var socket = io(document.URL);

	socket.on('init', function(data){
		var content="";
		for(var i = 0; i<data.data.length; i++){
			var time =moment(new Date(data.data[i].lastLogin));
			content+="<tr id='"+data.data[i].id+"'><td id='userID'> ID: "+data.data[i].id+"</td><td id='lastLogin'>"+time.fromNow()+"</td><td id='loginCount'>Count: "+data.data[i].loginCount+"</td></tr>";
		}
		$('table').append(content);
	});

	socket.on('update', function(data){
		console.log('updating...');
		var time = moment(new Date(data.lastLogin));
		$('#'+data.id + ' td#lastLogin').text(time);
		$('#'+data.id + ' td#loginCount').text(data.loginCount);
	});
});