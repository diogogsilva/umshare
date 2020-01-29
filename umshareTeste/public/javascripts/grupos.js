$(function () {

    $("#tabGrupos").on("click", function () {
        if(!$('#tabGrupos').hasClass('active')){
            reloadGrupos();
        }
    });

    $('#addfileGrupo').click(e => {
        e.preventDefault();

        var val = $("#publicacaoGrupoForm").find("#f1 #ficheiro").filter(":hidden").length

        if (val == 1) {
            $("#publicacaoGrupoForm").find("#f1 #ficheiro:first").show()
        } else {
            var ficheiroInput = $('<input/>', { class: 'w3-input w3-cell', type: 'file', name: "ficheiro", id: "ficheiro" })
            $("#publicacaoGrupoForm").find('#f1').append(ficheiroInput);
        }
    })

    $("#removefileGrupo").click(e => {
        e.preventDefault()
        var val = $("#publicacaoGrupoForm").find("#f1 #ficheiro").length
        var fInput = $("#publicacaoGrupoForm").find("#f1 #ficheiro:last")
        if (val == 1) {
            fInput.hide()
            fInput.val('')
        } else {
            fInput.remove()
        }
    })

    function reloadGrupos() {
        $('#gruposInsertZone').empty();
        $('#gruposInsertZone2').empty();
        $.ajax({
            url: "/grupos"
        })
        .done(function( data ) {
        $('#publicacoesLayout').hide();
        $('#gruposLayout').show();
        $('#grupoLayout').hide();
        $('#perfilLayout').hide();
        $('#mensagensLayout').hide();
        $('#tabFeed').removeClass('active');
        $('#tabGrupos').addClass('active');
        $('#tabPerfil').removeClass('active');
        $('#tabMensagens').removeClass('active');
        data.forEach(function(item){
            var clone = $('#templateGrupos').clone(true);
            clone.attr("style", "");
            clone.find(".w3-grupo").attr('id', item._id);
            clone.find('#nomeGrupo').text(item.nome);
            clone.find('#descricaoGrupo').text('Descrição: ' + item.descricao);
            clone.find('#adminGrupo').text('Admin: ' + item.admin);
            clone.find('#membrosGrupo').text('Nº de membros: ' + item.membros.length);
            var pertenceAoGrupo = false;
            var userInSession = $('#admin').val();
            item.membros.forEach(function(item){
                if(item == userInSession) {
                    pertenceAoGrupo = true;
                }
            })
            if(pertenceAoGrupo) {
                clone.find('#'+ item._id).addClass('grupo-container');
                clone.appendTo("#gruposInsertZone");
                $('#headerGruposInsertZone').show();
            } else {
                clone.find('#'+ item._id).removeClass('grupo-container');
                clone.appendTo("#gruposInsertZone2");
                $('#headerGruposInsertZone2').show();
            }
        })
        eventContainer();
        });
    }

    function reloadGrupo(id) {
        $('#grupoInsertZone').empty();
        $.ajax({
            url: "/grupo/" + id
        })
        .done(function(data) {
            $('#gruposLayout').hide();
            $('#grupoLayout').find('.gid').val(data.grupo._id);
            $('#grupoLayout').find('#nomeGrupo').text(data.grupo.nome);
            $('#grupoLayout').find('#descricaoGrupo').text("Descrição: " + data.grupo.descricao);
            $('#grupoLayout').find('#adminGrupo').text("Admin: " + data.admin.nome + ' (' + data.admin.email + ')');
            if(data.isAdmin == 1) {
                $('#adminTools').show();
            }
            $('#listaMembrosGrupo').empty();
            data.membros.forEach(membro => {
                var membroP = $('<p>' + membro.nome + ' (' + membro.email + ')</p>');
                $('#listaMembrosGrupo').append(membroP);
            })
            data.publicacoes.forEach(publicacao => {
                var Clone = $('#templateGrupoPublicacoes #idk #t').clone(true);
                var pubClone = $('#pubGrupo').clone(true);
                Clone.attr("style", "");
                pubClone.attr("style", "");
                pubClone.find("#publicadorPub").text("Publicado por: " + publicacao.utilizador)
                if(publicacao.conteudo == '') {
                    pubClone.find('#conteudoPub').text("Publicação sem mensagem");
                } else {
                    pubClone.find('#conteudoPub').text(publicacao.conteudo);
                }
                if (publicacao.metadata == '') {
                    pubClone.find('#metadataPub').text("Publicação sem tags");
                } else {
                    pubClone.find('#metadataPub').text("Tags: "+ publicacao.metadata);
                }
                pubClone.find('#dataPub').text(publicacao.data);
                pubClone.find('#idPub').text(publicacao._id);
                var userInSession = $('#utilizador').val();
                if(publicacao.utilizador != userInSession) {
                    pubClone.find('#removePublicacaoGrupoBtn').hide();
                } else {
                    pubClone.find('#removePublicacaoGrupoBtn').show();
                }

                if (publicacao.ficheiros.length > 0) {
                    fileZone = pubClone.find('#fileZone')
                    fileZone.empty();
                    fileZone.attr("style", "")
                    fileZone.append('<h4 style="font-weight:bold">Ficheiros partilhados</h4>')

                    publicacao.ficheiros.forEach(function (itemf) {
                        var pubFileClone = $('#fileNamePub').clone(true)
                        pubFileClone.attr("style", "")
                        pubFileClone.click({ pubid: publicacao._id, fileName: itemf.designacao, size: itemf.size, mimetype: itemf.mimetype }, showFileInfo);
                        pubFileClone.find("#fileNamePubp").text(itemf.designacao)
                        pubFileClone.appendTo(fileZone)
                    })
                } else {
                    fileZone = pubClone.find('#fileZone')
                    fileZone.empty();
                    fileZone.attr("style", "display:none")
                }

                pubClone.appendTo(Clone)

                var comentzone = Clone.find('#comentZone')
                comentzone.empty();
                if(publicacao.comentarios.length > 0) {
                    comentzone.append('<h4 style="font-weight:bold">Comentários</h4>')
                    publicacao.comentarios.forEach(function(itemc){
                        var comClone = $('#templateComentariosGrupo').clone(true);
                        comClone.attr("style", "");
                        comClone.find('#conteudoCom').text(itemc.conteudo);
                        comClone.find('#utilizadorCom').text("Comentado por: " + itemc.nome_user);
                        comClone.find('#dataCom').text(itemc.data);
                        comClone.find('#idCom').text(itemc._id);
                        comClone.find('#idPub').text(publicacao._id);
                        comClone.appendTo(comentzone);
                    });
                }
                var formComentClone = $('#divComentarioGrupoForm').clone(true);
                formComentClone.attr("style", "");
                formComentClone.find('#pubidForm').val(publicacao._id);
                formComentClone.appendTo(comentzone);
                var hideButtons = $('#divHideButtonGrupo').clone(true);
                hideButtons.attr("style", "");
                hideButtons.appendTo(Clone);
                Clone.appendTo("#grupoInsertZone");
            });
            $('#grupoLayout').show();
        });
    }

    $('#backToGruposList').click(event => {
        event.preventDefault();
        reloadGrupos();
    })

    function eventContainer() {
        $('.grupo-container').click(event => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            var id = $(event.currentTarget).attr('id');
            reloadGrupo(id);
        })
    }

    $('#publicacaoGrupoForm').submit(function (e) {
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
                    document.getElementById("publicacaoGrupoForm").reset();
                    reloadGrupo($('#grupoLayout').find('.gid').val());
                }
            }
        });
    })

    $('#grupoForm').submit(function (e) {
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
                    document.getElementById("grupoForm").reset();
                    reloadGrupos();
                }
            }
        });
    })

    $("#formAddMembro").submit(function (e) {
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
                    document.getElementById("formAddMembro").reset();
                    reloadGrupo($('#grupoLayout').find('.gid').val());
                }
            }
        });
    })

    $("#formRemoveMembro").submit(function (e) {
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
                    document.getElementById("formRemoveMembro").reset();
                    reloadGrupo($('#grupoLayout').find('.gid').val());
                }
            }
        });
    })

    $('#hideGrupoForm').click( function() {
        $('#divGrupoForm').slideUp("slow");
        $('#showGrupoForm').removeClass('w3-hide');
        $('#hideGrupoForm').addClass('w3-hide');
    })

    $('#hidePublicacaoGrupoForm').click(function () {
        $('#divPublicacaoGrupoForm').slideUp("slow");
        $('#showPublicacaoGrupoForm').removeClass('w3-hide');
        $('#hidePublicacaoGrupoForm').addClass('w3-hide');
    })

    $('#showPublicacaoGrupoForm').click(function () {
        $('#divPublicacaoGrupoForm').slideDown("slow");
        $('#showPublicacaoGrupoForm').addClass('w3-hide');
        $('#hidePublicacaoGrupoForm').removeClass('w3-hide');
    })

    $('#showGrupoForm').click( function() {
        $('#divGrupoForm').slideDown("slow");
        $('#showGrupoForm').addClass('w3-hide');
        $('#hideGrupoForm').removeClass('w3-hide');
    })

    $("#comentarioGrupoForm").submit(function (e) {
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
                    reloadGrupo($('#grupoLayout').find('.gid').val());
                }
            }
        });

    })

    $("#apagaComentarioGrupoBtn").click(function (e) {


        var data = "comid=" + $(this).closest("#templateComentariosGrupo").find("#idCom").text() + "&pubid=" + $(this).closest("#templateComentariosGrupo").find("#idPub").text();

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
                    reloadGrupo($('#grupoLayout').find('.gid').val());
                }
            }
        });
    })

    $('#hideComentarioGrupoForm').click(function () {
        $(this).parent().parent().find('#comentZone').slideUp("slow");
        $(this).parent().find('#showComentarioGrupoForm').removeClass('w3-hide');
        $(this).addClass('w3-hide');
    })

    $('#showComentarioGrupoForm').click(function () {
        $(this).parent().parent().find('#comentZone').slideDown("slow");
        $(this).parent().find('#hideComentarioGrupoForm').removeClass('w3-hide');
        $(this).addClass('w3-hide');
    })

    $("#removePublicacaoGrupoBtn").click(function (e) {
        var data = "pubid=" + $(this).closest("#pubGrupo").find("#idPub").text();

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
                    reloadGrupo($('#grupoLayout').find('.gid').val());
                }
            }
        });
    })

    function showFileInfo(event) {
        console.log(event.data.mimetype)
        var url = "http://localhost:5003/publicacoes/getFicheiro"

        var fileName = $('<h5>' + event.data.fileName + '</h5>')
        var fileSize = $('<h5> Tamanho: ' + event.data.size + ' Bytes' + '</h5>')

        var data = "pubid=" + event.data.pubid + "&fileName=" + event.data.fileName
        console.log(data)



        //if (event.data.mimetype == 'image/png' || event.data.mimetype == 'image/jpeg') {
        //  var ficheiro = $('<img src="' + response.path + '"width="40%"/>')
        //} else {
        //var ficheiro = $('<p>' + JSON.stringify(event.data) + '</p>')
        //}
        var download = $('<div><a href="http://localhost:5003/publicacoes/getFicheiro?pubid=' + event.data.pubid + '&fileName=' + event.data.fileName + '">Download</a></div>')

        console.log(download)
        //var ficheiro = $('<p>' + JSON.stringify(f) + '</p>')
        //var download = $('<div><a href="/download/' + f.name + '">Download</a></div>')
        $("#display").empty()
        $('#display').append(fileName, fileSize, download)
        $('#display').modal()
    }
});