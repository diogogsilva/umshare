
$(function () {

    $("#tabFeed").on("click", function () {
        if (!$('#tabFeed').hasClass('active')) {
            showTabFeed();
        }
    });

    $('#addfile').click(e => {
        e.preventDefault()

        var val = $("#publicacaoForm").find("#f1 #ficheiro").filter(":hidden").length

        if (val == 1) {
            $("#publicacaoForm").find("#f1 #ficheiro:first").show()
        } else {
            var ficheiroInput = $('<input/>', { class: 'w3-input w3-cell', type: 'file', name: "ficheiro", id: "ficheiro" })
            $('.f1').append(ficheiroInput);
        }
    })

    $("#removefile").click(e => {
        e.preventDefault()
        var val = $("#publicacaoForm").find("#f1 #ficheiro").length
        var fInput = $("#publicacaoForm").find("#f1 #ficheiro:last")
        if (val == 1) {
            fInput.hide()
            fInput.val('')
        } else {
            fInput.remove()
        }
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

    function showTabFeed(tag, tagr) {
        if (tag == "Sem tag") {
            var url = "/pubsComTag?metadata=semmd"
        } else if (tagr == "Mostrar tudo") {
            var url = "/feed"
        } else if (tag != undefined) {
            var url = "/pubsComTag?metadata=" + tag
        } else {
            var url = "/feed"
        }
        $('#publicacoesInsertZone').empty();
        $.ajax({
            url: url
        })
            .done(function (data) {
                $('#gruposLayout').hide();
                $('#grupoLayout').hide();
                $('#publicacoesLayout').show();
                $('#perfilLayout').hide();
                $('#tabGrupos').removeClass('active');
                $('#tabFeed').addClass('active');
                $('#tabPerfil').removeClass('active');
                data.forEach(function (item) {
                    var Clone = $('#templatePublicacoes #idk #t').clone(true);
                    var pubClone = $('#pub').clone(true);
                    Clone.attr("style", "");
                    pubClone.attr("style", "");
                    pubClone.find("#publicadorPub").text("Publicado por: " + item.utilizador)
                    if (item.conteudo == '') {
                        pubClone.find('#conteudoPub').text("Publicação sem mensagem");
                    } else {
                        pubClone.find('#conteudoPub').text(item.conteudo);
                    }
                    if (item.metadata == '') {
                        pubClone.find('#metadataPub').text("Publicação sem tags");
                    } else {
                        pubClone.find('#metadataPub').text("Tags: " + item.metadata);
                    }
                    pubClone.find('#dataPub').text(item.data);//dataAtual(item.data));
                    pubClone.find('#idPub').text(item._id);
                    var item_utilizador = item.utilizador.substring(
                        item.utilizador.lastIndexOf("( ") + 1, 
                        item.utilizador.lastIndexOf(" )")
                    );
                    item_utilizador = item_utilizador.replace(/ /g,'');
                    var userInSession = $('#utilizador').val();
                    if (item_utilizador != userInSession) {
                        pubClone.find('#removePublicacaoBtn').hide();
                    } else {
                        pubClone.find('#removePublicacaoBtn').show()
                    }

                    if (item.ficheiros.length > 0) {
                        fileZone = pubClone.find('#fileZone')
                        fileZone.empty();
                        fileZone.attr("style", "")
                        fileZone.append('<h5>Ficheiros partilhados:</h5>')

                        item.ficheiros.forEach(function (itemf) {
                            var pubFileClone = $('#fileNamePub').clone(true)
                            pubFileClone.attr("style", "")
                            //pubFileClone.attr("onclick", showFileInfo())
                            pubFileClone.click({ pubid: item._id, fileName: itemf.designacao, size: itemf.size, mimetype: itemf.mimetype }, showFileInfo);
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

                    if (item.comentarios.length > 0) {
                        comentzone.append('<h4 style="font-weight:bold">Comentários</h4')
                        item.comentarios.forEach(function (itemc) {
                            var comClone = $('#templateComentarios').clone(true);
                            comClone.attr("style", "");
                            comClone.find('#conteudoCom').text(itemc.conteudo);
                            comClone.find('#utilizadorCom').text("Comentado por: " + itemc.nome_user);
                            comClone.find('#dataCom').text(itemc.data);//dataAtual(itemc.data));
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

        $("#searchZone").empty()
        $.ajax({
            url: "/tagsPubsUser"
        })
            .done(function (data) {
                $("#searchZone").append("<h3>Tags</h3>")
                var tagSpanClone = $('#tagSpan').clone(true);
                tagSpanClone.attr("style", "")
                tagSpanClone.text("Mostrar tudo")
                tagSpanClone.appendTo("#searchZone")

                data.forEach(function (item) {
                    var tagSpanClone = $('#tagSpan').clone(true);
                    tagSpanClone.attr("style", "")
                    if (item._id == "") {
                        tagSpanClone.text("Sem tag (" + item.count + ")")
                    } else {
                        tagSpanClone.text(item._id + " (" + item.count + ")")
                    }

                    tagSpanClone.appendTo("#searchZone")
                })
            })

        if (tag == undefined) {
            $('#tagSpan:contains("Mostrar tudo")').removeClass('w3-light-grey')
            $('#tagSpan:contains("Mostrar tudo")').addClass('w3-black')
            $('#tagSpan:contains("Mostrar tudo")').attr('style', "color:blue")
        } else {
            $('#tagSpan:contains("' + tagr + '")').removeClass('w3-light-grey')
            $('#tagSpan:contains("' + tagr + '")').addClass('w3-black')
            $('#tagSpan:contains("' + tagr + '")').attr('style', "color:blue")
        }

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

    function showFileInfo(event) {
        var url = "http://localhost:5003/publicacoes/getFicheiro"

        var fileName = $('<h5>' + event.data.fileName + '</h5>')
        var fileSize = $('<h5> Tamanho: ' + event.data.size + ' Bytes' + '</h5>')

        var data = "pubid=" + event.data.pubid + "&fileName=" + event.data.fileName



        //if (event.data.mimetype == 'image/png' || event.data.mimetype == 'image/jpeg') {
        //  var ficheiro = $('<img src="' + response.path + '"width="40%"/>')
        //} else {
        //var ficheiro = $('<p>' + JSON.stringify(event.data) + '</p>')
        //}
        var download = $('<div><a href="http://localhost:5003/publicacoes/getFicheiro?pubid=' + event.data.pubid + '&fileName=' + event.data.fileName + '">Download</a></div>')

        //var ficheiro = $('<p>' + JSON.stringify(f) + '</p>')
        //var download = $('<div><a href="/download/' + f.name + '">Download</a></div>')
        $("#display").empty()
        $('#display').append(fileName, fileSize, download)
        $('#display').modal()
    }


    $("#tagSpan").click(function (e) {
        var tag = $(this).text()
        var tagr = tag
        tag = tag.substring(0, tag.indexOf('('));
        tag = tag.substring(0, tag.length - 1);
        showTabFeed(tag, tagr)
    })

    /*function dataAtual(data){
        var dataAtual = new Date(data);
        var dia = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
        var mes = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
        var ano = dataAtual.getFullYear();
        var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
        var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
        var segundo = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();
    
        var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
        return dataFormatada;
    }*/

})