
$(function () {

    $("#tabFeed").on("click", function () {
      if(!$('#tabFeed').hasClass('active')){
        showTabFeed();
      }
    });

    $('#addfile').click(e => {
        e.preventDefault()
        var ficheiroInput = $('<input/>', { class: 'w3-input w3-cell', type: 'file', name: "ficheiro" })

        $('#f1').append(ficheiroInput);
    })

    var close = document.getElementsByClassName("closebtn");
    var i;

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.opacity = "0";
            setTimeout(function () { div.style.display = "none"; }, 600);
        }
    }

    $("#formRegisto").submit(function (e) {

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
                    setTimeout(function () {
                        window.location.href = "/login";
                    }, 3000);

                }
            }
        });
    });

    $("#formLogin").submit(function (e) {
        e.preventDefault();

        var form = $(this);
        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            complete: function (xhr, textStatus) {
                if (xhr.status != 200) {
                    $('.alert').css({ display: 'none' });
                    $('#msgWarning').html("Credenciais inválidas!");
                    $('#divAlertWarning').css({ opacity: 1 });
                    document.getElementById('divAlertWarning').style.display = 'block';
                    setTimeout(function () { document.getElementById('divAlertWarning').style.opacity = 0; }, 3000);
                } else {
                    window.location.href = '/';
                }
            }
        });

    })

    $('#publicacaoForm').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            url: this.action,
            type: this.method,
            data: new FormData(this),
            processData: false,
            contentType: false,
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
                    document.getElementById("publicacaoForm").reset();
                    showTabFeed();
                }
            }
        });
    });

    $('#hidePublicacaoForm').click(function () {
        $('#divPublicacaoForm').slideUp("slow");
        $('#showPublicacaoForm').removeClass('w3-hide');
        $('#hidePublicacaoForm').addClass('w3-hide');
    })

    $('#showPublicacaoForm').click(function () {
        $('#divPublicacaoForm').slideDown("slow");
        $('#showPublicacaoForm').addClass('w3-hide');
        $('#hidePublicacaoForm').removeClass('w3-hide');
    })

    function showTabFeed() {
        $('#publicacoesInsertZone').empty();
        $.ajax({
            url: "/feed"
        })
        .done(function( data ) {
            $('#gruposLayout').hide();
            $('#grupoLayout').hide();
            $('#publicacoesLayout').show();
            $('#perfilLayout').hide();
            $('#mensagensLayout').hide();
            $('#tabGrupos').removeClass('active');
            $('#tabFeed').addClass('active');
            $('#tabPerfil').removeClass('active');
            $('#tabMensagens').removeClass('active');
            data.forEach(function(item){
                var Clone = $('#templatePublicacoes #idk #t').clone(true);
                var pubClone = $('#pub').clone(true);
                Clone.attr("style", "");
                pubClone.attr("style", "");
                if(item.conteudo == '') {
                    pubClone.find('#conteudoPub').text("Publicação sem mensagem");
                } else {
                    pubClone.find('#conteudoPub').text(item.conteudo);
                }
                if (item.metadata == '') {
                    pubClone.find('#metadataPub').text("Publicação sem tags");
                } else {
                    pubClone.find('#metadataPub').text("Tags: "+ item.metadata);
                }
                var userInSession = $('#utilizador').val();
                if(item.utilizador != userInSession) {
                    pubClone.find('#removePublicacaoBtn').remove();
                }
                pubClone.find('#dataPub').text(item.data);
                pubClone.find('#idPub').text(item._id);

                pubClone.appendTo(Clone)

                var comentzone = Clone.find('#comentZone')
                comentzone.empty();

                if(item.comentarios.length > 0) {
                    $("#titComentarios").attr("style", "")
                    $("#titComentarios").appendTo(comentzone)
                    item.comentarios.forEach(function(itemc){
                        var comClone = $('#templateComentarios').clone(true);
                        comClone.attr("style", "");
                        comClone.find('#conteudoCom').text(itemc.conteudo);
                        comClone.find('#utilizadorCom').text("Comentado por: " + itemc.utilizador + " Buscar o nome?");
                        comClone.find('#dataCom').text(itemc.data);
                        comClone.find('#idCom').text(itemc._id);
                        comClone.find('#idPub').text(item._id);
                        comClone.appendTo(comentzone);
                    });
                }
                var formComentClone = $('#divComentarioForm').clone(true);
                formComentClone.attr("style", "");
                formComentClone.find('#pubidForm').val(item._id);
                formComentClone.appendTo(comentzone);
                var hideButtons = $('#divHideButton').clone(true);
                hideButtons.attr("style", "");
                hideButtons.appendTo(Clone);
                Clone.appendTo("#publicacoesInsertZone");
            })
        });
    }

    showTabFeed();

    $("#comentarioForm").submit(function (e) {
        e.preventDefault();

        var form = $(this);
        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            complete: function (xhr, textStatus) {
                if (xhr.status != 200) {
                    $('.alert').css({ display: 'none' });
                    $('#msgWarning').html("Erro na inserção!");
                    $('#divAlertWarning').css({ opacity: 1 });
                    document.getElementById('divAlertWarning').style.display = 'block';
                    setTimeout(function () { document.getElementById('divAlertWarning').style.opacity = 0; }, 3000);
                } else {
                    $('.alert').css({ display: 'none' });
                    $('#msgSuccess').html("Comentário inserido!");
                    $('#divAlertSuccess').css({ opacity: 1 });
                    document.getElementById('divAlertSuccess').style.display = 'block';
                    setTimeout(function () { document.getElementById('divAlertSuccess').style.opacity = 0; }, 1000);
                    showTabFeed();
                }
            }
        });

    })

    $("#apagaComentarioBtn").click(function (e) {


        var data = "comid=" + $(this).closest("#templateComentarios").find("#idCom").text() + "&pubid=" + $(this).closest("#templateComentarios").find("#idPub").text();

        $.ajax({
            type: "POST",
            url: "/removerComentario",
            data: data,
            complete: function (xhr, textStatus) {
                if (xhr.status != 200) {
                    $('.alert').css({ display: 'none' });
                    $('#msgWarning').html("Falha na remoção");
                    $('#divAlertWarning').css({ opacity: 1 });
                    document.getElementById('divAlertWarning').style.display = 'block';
                    setTimeout(function () { document.getElementById('divAlertWarning').style.opacity = 0; }, 3000);
                } else {
                    $('.alert').css({ display: 'none' });
                    $('#msgSuccess').html("Comentario removido");
                    $('#divAlertSuccess').css({ opacity: 1 });
                    document.getElementById('divAlertSuccess').style.display = 'block';
                    setTimeout(function () { document.getElementById('divAlertSuccess').style.opacity = 0; }, 1000);
                    showTabFeed();
                }
            }
        });
    })

    $('#hideComentarioForm').click(function () {
        $(this).parent().parent().find('#comentZone').slideUp("slow");
        $(this).parent().find('#showComentarioForm').removeClass('w3-hide');
        $(this).addClass('w3-hide');
    })

    $('#showComentarioForm').click(function () {
        $(this).parent().parent().find('#comentZone').slideDown("slow");
        $(this).parent().find('#hideComentarioForm').removeClass('w3-hide');
        $(this).addClass('w3-hide');
    })

    $("#removePublicacaoBtn").click(function (e) {


        var data = "pubid=" + $(this).closest("#pub").find("#idPub").text();

        $.ajax({
            type: "POST",
            url: "/removerPublicacao",
            data: data,
            complete: function (xhr, textStatus) {
                if (xhr.status != 200) {
                    $('.alert').css({ display: 'none' });
                    $('#msgWarning').html("Falha na remoção");
                    $('#divAlertWarning').css({ opacity: 1 });
                    document.getElementById('divAlertWarning').style.display = 'block';
                    setTimeout(function () { document.getElementById('divAlertWarning').style.opacity = 0; }, 3000);
                } else {
                    $('.alert').css({ display: 'none' });
                    $('#msgSuccess').html("Publicacao Removida");
                    $('#divAlertSuccess').css({ opacity: 1 });
                    document.getElementById('divAlertSuccess').style.display = 'block';
                    setTimeout(function () { document.getElementById('divAlertSuccess').style.opacity = 0; }, 1000);
                    showTabFeed();
                }
            }
        });
    })

})