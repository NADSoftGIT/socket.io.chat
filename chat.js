jQuery.fn.exists = function(){return this.length>0;}

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

      socket.on('PRVMSG', function(data){
          if ($("#"+data.from+"Chat").exists() == false)  openPrivateChat(data.from,0);
          $("#"+data.from+"Chat").append('<p><span class="time">11:17</span> <strong><a href="#">'+data.from+': </a></strong>'+data.MSG+'</p>');

          if ($("#"+data.from+"Tab").parent().hasClass("active") == false) $("#"+data.from+"Tab").fadeTo('slow', 0.5).fadeTo('slow', 1.0).fadeTo('slow', 0.5).fadeTo('slow', 1.0).fadeTo('slow', 0.5).fadeTo('slow', 1.0);

      });

      socket.on('JOIN', function(data){
        $(".usersList").append('<a href="javascript:void(0);" id="'+data.nickname+'InList" class="list-group-item">'+data.nickname+'</a>');
      });
      socket.on('PART', function(data){
        $(".usersList #" + data.nickname + "InList").remove();
      });
      socket.on('CHNMSG',function(data){
        if(data.from == nickname)
        $("#ChannelRoom").append('<p><span class="time">11:17</span> <strong><a href="#">'+data.from+': </a>'+data.MSG+'</strong></p>');
          else
        $("#ChannelRoom").append('<p><span class="time">11:17</span> <strong><a href="#">'+data.from+': </a></strong>'+data.MSG+'</p>');

        if ($("#ChannelRoomTab").parent().hasClass("active") == false) $("#ChannelRoomTab").fadeTo('slow', 0.5).fadeTo('slow', 1.0).fadeTo('slow', 0.5).fadeTo('slow', 1.0).fadeTo('slow', 0.5).fadeTo('slow', 1.0);

      });
      socket.on('USEROFFLINE',function(nickname) {
        $('#messages').append($('<li>').text(nickname + ' is Offline'));
      });

      $('#loginButton').click(function() {
        nickname = $('#nickname').val();
        connectToChat(nickname);
      });

      $('#sendMSG').click(function() {
        var reciever = $(".tab-pane.active").attr('reciever');
        var MSG = $('#MSGBox').val();

        if($(".tab-pane.active").attr('panelType')=="room") action = "CHNMSG"; else action = "PRVMSG";
        socket.emit(action, {'from':nickname,'to':reciever,'MSG':MSG} );
        
        if (action == "PRVMSG")
          $(".tab-pane.active").append('<p><span class="time">11:17</span> <strong><a href="#">'+nickname+': </a>'+MSG+'</strong></p>');

        $("#MSGBox").val('');

      });

      $("#MSGBox").keypress(function(e) {
        if(e.which == 13) {
          $( "#sendMSG" ).trigger( "click" );
        }
      });
      function connectToChat(nickname) {
      socket.emit('register', nickname);
      socket.emit('getOnlineUsers','list');
      }

      function fillUserList(users) {
                  $(".usersList").html('');
        users.forEach(function(element,index,array){
          $(".usersList").append('<a href="javascript:void(0);" onclick="javascript:openPrivateChat(\''+element+'\',1);" id="'+element+'InList" class="list-group-item">'+element+'</a>');
        });        
      }

      function openPrivateChat(nickname,active) {
        $("#chatPanels").append('<li><a href="#'+nickname+'Chat" id="'+nickname+'Tab" role="tab" data-toggle="tab">'+nickname+'</a></li>');
        $("#chatContent").append('<div class="tab-pane" id="'+nickname+'Chat" panelType="private" reciever="'+nickname+'"></div>');
        if (active == 1) {
          $(".tab-pane.active").removeClass("active");
          $("#chatPanels li.active").removeClass("active");

          $("#" + nickname + "Tab").trigger('click');
        }
      }
function closeEditorWarning(){
    return 'في حال قمت بذلك سوف تخرج تلقائياً من الدردشة - هل انت متاكد ؟'
}

window.onbeforeunload = closeEditorWarning