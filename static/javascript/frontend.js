$(document).on('ready', function(){
	var socket = io(document.URL);

	socket.on('init', function(data){
		var content="";
		for(var i = 0; i<data.data.length; i++){
			var time =moment(new Date(data.data[i].lastLogin));
			content+="<tr id='"+data.data[i].id+"'><td ='userID'> ID: "+data.data[i].id+"</td><td class='lastLogin' id="+data.data[i].lastLogin+">"+time.fromNow()+"</td><td id='loginCount'>"+data.data[i].loginCount+"</td></tr>";
		}
		$('table').append(content);
	});

	socket.on('update', function(data){
		console.log('updating...');
		var time = moment(new Date(data.data.lastLogin));
		$('#'+data.data.id + ' td.lastLogin').text(time.fromNow());
		$('#'+data.data.id + ' td.lastLogin').attr('id', data.data.lastLogin);
		$('#'+data.data.id + ' td#loginCount').text(data.data.loginCount);
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