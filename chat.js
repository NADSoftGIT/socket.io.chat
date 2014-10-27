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

      socket.on('JOIN', function(data){
        $(".usersList").append('<a href="javascript:void(0);" id="'+data.nickname+'InList" class="list-group-item">'+data.nickname+'</a>');
      });
      socket.on('PART', function(data){
        $(".usersList #" + data.nickname + "InList").remove();
      });
      socket.on('CHNMSG',function(data){
        //alert(data.channel);
        if(data.from == nickname)
        $("#" +data.channel+"Channel").append('<p><span class="time">11:17</span> <strong><a href="#">'+data.from+': </a>'+data.MSG+'</strong></p>');
          else
        $("#" +data.channel+"Channel").append('<p><span class="time">11:17</span> <strong><a href="#">'+data.from+': </a></strong>'+data.MSG+'</p>');
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
          $(".usersList").append('<a href="javascript:void(0);" id="'+element+'InList" class="list-group-item">'+element+'</a>');
        });        
      }
function closeEditorWarning(){
    return 'في حال قمت بذلك سوف تخرج تلقائياً من الدردشة - هل انت متاكد ؟'
}

window.onbeforeunload = closeEditorWarning