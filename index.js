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
    	onlineUsers[data.to]['socket'].emit('PRVMSG', {'from':data.from,'to':data.to,'MSG':data.MSG});
    }else{ socket.emit('USEROFFLINE',data.to);}
  });

  socket.on('register',function(data){
  //	console.log(data);
if (typeof onlineUsers[data] !== 'undefined'){
       socket.emit('EXIST',data);

}else{

  	 onlineUsers[data] = [];
     onlineUsers[data]['socket'] = socket;
     joinChannel(data,"lobby");
     socket.emit('JOIN',"lobby");
     talkToUsersOfChannel("lobby","JOIN",{'nickname':data,'channel':'lobby'});
     socket.emit('REGISTERED',channels['lobby']);
   }
  }); 

  socket.on('joinChannel',function(channel) {
    var userNickname = getUserBySocketID(socket.id);
     partChannel(userNickname,onlineUsers[userNickname]['channel']);
     joinChannel(userNickname,channel);
     talkToUsersOfChannel(channel,"JOIN",{'nickname':userNickname,'channel':channel});     
     socket.emit('REGISTERED',channels[channel]);
  });

  socket.on('disconnect', function () {
    if (userNickname = getUserBySocketID(socket.id)) {
    partChannel(userNickname,onlineUsers[userNickname]['channel']);
    delete onlineUsers[userNickname];
    console.log(onlineUsers);
    io.sockets.emit('PART');
  }
  });

  socket.on('CHNMSG',function(data) {
     talkToUsersOfChannel(data.to,"CHNMSG",{'from':data.from,'channel':data.to,'MSG':data.MSG});    
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

function partChannel(user,channel) {
  var userIndex = channels[channel].indexOf(user);
  channels[channel].splice(userIndex, 1);
  talkToUsersOfChannel(channel,"PART",{'nickname':user,'channel':channel});
}

function talkToUsersOfChannel(channel,type,data) {
  for (element in onlineUsers) {
    if (onlineUsers[element]['channel'] == channel) onlineUsers[element]['socket'].emit(type,data);
  }
}

function getUserBySocketID(socketid) {
for (element in onlineUsers) {
  if(onlineUsers[element].socket.id == socketid) return(element);
}
return(false);
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});