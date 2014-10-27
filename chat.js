      var socket = io();
      var nickname;

      socket.on('connected', function(result){
      $('#loginBox').show();
      });     

      socket.on('REGISTERED', function(result){

        fillUserList(result);
        $('#loginBox').hide();
        $('#chatApp').show();
      });


      $('form').submit(function(){
        socket.emit('PRVMSG', {'from':nickname,'to':'Ibrahiem','MSG':$('#m').val()} );
        $('#messages').append($('<li>').text($('#m').val()));
        $('#m').val('');
        return false;
      });

      socket.on('PRVMSG', function(msg){
        $('#messages').append($('<li>').text(msg));
      });

      socket.on('JOIN', function(channel){
        $('#messages').append($('<li>').text('You have joined ' + channel));
      });

      socket.on('USEROFFLINE',function(nickname) {
        $('#messages').append($('<li>').text(nickname + ' is Offline'));
      });

      $('#loginButton').click(function() {
        nickname = $('#nickname').val();
        connectToChat(nickname);
      });

      function connectToChat(nickname) {
      socket.emit('register', nickname);
      socket.emit('getOnlineUsers','list');
      }

      function fillUserList(users) {
                  $(".usersList").html('');
        users.forEach(function(element,index,array){
          $(".usersList").append('<a href="javascript:void(0);" class="list-group-item">'+element+'</a>');
        });        
      }
