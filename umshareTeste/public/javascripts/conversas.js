$(function () {

    $("#tabMensagens").on("click", function () {
        if(!$('#tabMensagens').hasClass('active')){
            reloadConversas();
        }
    });

    function reloadConversas(){
        $('#mensagensInsertZone').empty();
        $.ajax({
            url: "/conversas"
        })
        .done(function( data ) {
        $('#publicacoesLayout').hide();
        $('#gruposLayout').hide();
        $('#grupoLayout').hide();
        $('#perfilLayout').hide();
        $('#mensagensLayout').show();
        $('#tabFeed').removeClass('active');
        $('#tabGrupos').removeClass('active');
        $('#tabPerfil').removeClass('active');
        $('#tabMensagens').addClass('active');
        var clone = $('#templateMensagens').clone(true);
        clone.attr("style", "");
        clone.appendTo("#mensagensInsertZone");
        data.forEach(function(item){
            item.membros.forEach(function(nome, index){
                if(nome == userInSession){
                    item.membros.splice(index,1);
                }
            })
            var x = item.membros.join(", ");
            var clone = $('#btnConversa').clone(true);
            clone.attr("style", "");
            clone.attr("id", item._id);
            clone.html(x);
            clone.appendTo("#navBar");
    })
    });
}


$("#addConversaForm").submit(function (e) {
    e.preventDefault();

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function (response) {
            if (response.status == 'erro') {
                $('.alert').css({ display: 'none' });
                $('#msgWarning').html(response.msg);
                $('#divAlertWarning').css({ opacity: 1 });
                document.getElementById('divAlertWarning').style.display = 'block';
                setTimeout(function () { document.getElementById('divAlertWarning').style.opacity = 0; }, 3000);
            } else {
                $('.alert').css({ display: 'none' });
                $('#msgSuccess').html(response.msg);
                $('#divAlertSuccess').css({ opacity: 1 });
                document.getElementById('divAlertSuccess').style.display = 'block';
                setTimeout(function () { document.getElementById('divAlertSuccess').style.opacity = 0; }, 3000);
                document.getElementById("addConversaForm").reset();
                reloadConversas()
            }
        }
    });
})


function dataAtual(){
	var dataAtual = new Date();
	var dia = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
	var mes = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
	var ano = dataAtual.getFullYear();
	var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
	var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
	var segundo = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();

	var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
	return dataFormatada;
}


$("#enviarMensagem").submit(function (e) {
    e.preventDefault();

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function (response) {
            console.log(response)
            var username = userInSession; 
            socket.emit('join', { username: username });
            /*socket.on('user joined', function (data) {
                $(".js-userjoined").html(data.username + ' Joined chat room');
                console.log(data.users);
                 $.each(data.users, function(index, user) { 
                      console.log(user);
                     $(".js-usersinchat").append('<span id ='+user+'>&nbsp;&nbsp;<strong>'+user+'</strong></span>');
                 });
             });
             */
             socket.on('user disconnected', function (data) {
                $("#"+data.username).remove();
             });
             
            //an event emitted from server
            socket.on('chat message', function (data) {
             var string = '<div class="row message-bubble"><p class="text-muted"><b>Por: ' + data.username +'</b> - Em: ' + dataAtual() + '</p><p>'+ data.message +'</p></div>';
              $('#messages').append(string);
            });
           /* $(function () {
                var timeout;
        
                function timeoutFunction() {
                    typing = false;
                    socket.emit("typing", { message: '', username: '' });
                }*/
        
               /*$('#txtmessage').keyup(function () {
                   console.log('happening');
                   typing = true;
                   socket.emit('typing', { message: 'typing...', username: username});
                   clearTimeout(timeout);
                   timeout = setTimeout(timeoutFunction, 2000);
               });*/
          
        
           /* socket.on('typing', function (data) {
                if (data.username && data.message) {
                    $('.typing').html("User: " + data.username + ' ' + data.message);
                } else {
                    $('.typing').html("");
                }
            });
        });*/
           /* var typing = false;
            var timeout = undefined;
            function timeoutFunction(){
            typing = false;
            socket.emit(noLongerTypingMessage);
            }*/
        
            $("#sendmessage").on('click',function (e) {
                e.preventDefault();
                var message = $("#txtmessage").val();
                $("#txtmessage").val('');
                $('.typing').html("");
                socket.emit('new_message', { message: message, username: username });    

                })

        }
    });
})


$('.btnConversas').click(event => {
    $.ajax({
        url: "/mensagem/" + event.currentTarget.id
    })
    .done(function( data ) {
        $('#enviarMensagem').find('[name="cid"]').val(event.currentTarget.id);
        $('#messages').empty();
        data.mensagens.forEach(item => {
            if(item != undefined) {
                var string = '<div class="row message-bubble"><p class="text-muted"><b>Por: ' + item.utilizadorRemetente +'</b> - Em: ' + item.data + '</p><p>'+ item.texto +'</p></div>';
                $('#messages').append(string);
            }
        });
    })
});

/*$('#addAluno').click(e => {
    e.preventDefault()

    var val = $("#addConversaForm").find("#f2 #membros").filter(":hidden").length

    if(val == 1){
        $("#addConversaForm").find("#f2 #membros:first").show()
    } else {
        var ficheiroInput = '<input class="w3-input w3-cell w3-border" type="text" name="membros" placeholder="aluno (Exemplo: exemplo@exemplo.pt)" required/>'
        $("#addConversaForm").find('#f2').append(ficheiroInput);
    }

    //$('<input/>', { class: 'w3-input w3-cell', type: 'text', name: "membros", placeholder: "aluno (Exemplo: exemplo@exemplo.pt)", required })

    //$('#f2').append(ficheiroInput);
})

$("#removeAluno").click(e => {
    e.preventDefault()
    var val = $("#addConversaForm").find("#f2 #membros").length
    var fInput = $("#addConversaForm").find("#f2 #membros:last")
    if (val == 1) {
        fInput.hide()
        fInput.val('')
    } else {
        fInput.remove()
    }
})*/


$('#txtmessage').click(e => {
    var username = userInSession; 
    socket.emit('join', { username: username });
    socket.on('user joined', function (data) {
        $(".js-userjoined").html(data.username + ' Joined chat room');
        console.log(data.users);
         /*$.each(data.users, function(index, user) { 
              console.log(user);
             $(".js-usersinchat").append('<span id ='+user+'>&nbsp;&nbsp;<strong>'+user+'</strong></span>');
         });*/
     });
     
     socket.on('user disconnected', function (data) {
        $("#"+data.username).remove();
     });
     
    $(function () {
        var timeout;

        function timeoutFunction() {
            typing = false;
            socket.emit("typing", { message: '', username: '' });
        }

       $('#txtmessage').keyup(function () {
           console.log('happening');
           typing = true;
           socket.emit('typing', { message: 'typing...', username: username});
           clearTimeout(timeout);
           timeout = setTimeout(timeoutFunction, 2000);
       });
  

    socket.on('typing', function (data) {
        if (data.username && data.message) {
            $('.typing').html("User: " + data.username + ' ' + data.message);
        } else {
            $('.typing').html("");
        }
    });
});
    var typing = false;
    var timeout = undefined;
    function timeoutFunction(){
    typing = false;
    socket.emit(noLongerTypingMessage);
    }

})


$('#hideConversaForm').click( function() {
    $('#div').slideUp("slow");
    $('#showConversaForm').removeClass('w3-hide');
    $('#hideConversaForm').addClass('w3-hide');
})

$('#showConversaForm').click( function() {
    $('#div').slideDown("slow");
    $('#showConversaForm').addClass('w3-hide');
    $('#hideConversaForm').removeClass('w3-hide');
})

var userInSession = $('#admin').val();

var socket = io.connect('http://localhost:2222');

/*function carregarMensagensAntigas(){
    var username = userInSession; 
    socket.emit('join', { username: username });
    for (i=0; i<arrayMensagens.length; i++){
        var string = '<div class="row message-bubble"><p class="text-muted">' + username +'</p><p>'+arrayMensagens[i] +'</p></div>';
        $('#messages').append(string);
    }
    socket.on('user joined', function (data) {
        $(".js-userjoined").html(data.username + ' Joined chat room');
        console.log(data.users);
         $.each(data.users, function(index, user) { 
              console.log(user);
             $(".js-usersinchat").append('<span id ='+user+'>&nbsp;&nbsp;<strong>'+user+'</strong></span>');
         });
     });
     
     socket.on('user disconnected', function (data) {
        $("#"+data.username).remove();
     });
     
    //an event emitted from server
    socket.on('chat message', function (data) {
        var string = '<div class="row message-bubble"><p class="text-muted">' + data.username+'</p><p>'+data.message+'</p></div>';
      $('#messages').append(string);
    });
    $(function () {
        var timeout;

        function timeoutFunction() {
            typing = false;
            socket.emit("typing", { message: '', username: '' });
        }

       $('#txtmessage').keyup(function () {
           console.log('happening');
           typing = true;
           socket.emit('typing', { message: 'typing...', username: username});
           clearTimeout(timeout);
           timeout = setTimeout(timeoutFunction, 2000);
       });
  

    socket.on('typing', function (data) {
        if (data.username && data.message) {
            $('.typing').html("User: " + data.username + ' ' + data.message);
        } else {
            $('.typing').html("");
        }
    });
});
    var typing = false;
    var timeout = undefined;
    function timeoutFunction(){
    typing = false;
    socket.emit(noLongerTypingMessage);
    }

    $("#sendmessage").on('click',function (e) {
        console.log("Entrou aqui no send message");
        e.preventDefault();
        var message = $("#txtmessage").val();
        $("#txtmessage").val('');
        $('.typing').html("");
        socket.emit('new_message', { message: message, username: username });
        arrayMensagens.push(message);

        })

    }*/
    
});