var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var onlineUsers = [];
var channels = [];

app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendfile('index.html');
});



io.on('connection', function(socket){

  socket.emit('connected','Done');



  socket.on('PRVMSG', function(data){
  	if (isUserOnline(data.to)==true){
    	onlineUsers[data.to]['socket'].emit('PRVMSG', data.MSG);
    }else{ socket.emit('USEROFFLINE',data.to);}
  });

  socket.on('register',function(data){
  //	console.log(data);
  	 onlineUsers[data] = [];
     onlineUsers[data]['socket'] = socket;
     joinChannel(data,"lobby");
     socket.emit('JOIN',"lobby");
     socket.emit('REGISTERED',channels['lobby']);
  }); 

  socket.on('disconnect', function () {
    var userIndex = onlineUsers.indexOf(socket);
    console.log(userIndex);
    io.sockets.emit('PART');
  });

});


function isUserOnline(nickname) {
	if (onlineUsers[nickname]) return true;
	return false;
}

function joinChannel(user,channel) {
  onlineUsers[user]['channel'] = channel;
  if (typeof channels[channel] !== 'undefined'){
    channels[channel].push(user);
  }else {
    channels[channel] = [];
    channels[channel].push(user);
  }


}

http.listen(3000, function(){
  console.log('listening on *:3000');
});