$(function () {

    $("#tabGrupos").on("click", function () {
        if(!$('#tabGrupos').hasClass('active')){
            reloadGrupos();
        }
      });

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
            data.publicacoes.forEach(pubicacao => {
                var clone = $('#templateGrupoPub').clone(true);
                clone.attr("style", "");
                clone.find('#conteudoPub').text(pubicacao.conteudo);
                clone.find('#metadataPub').text(pubicacao.metadata);
                clone.appendTo("#grupoInsertZone");
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

    $('#showGrupoForm').click( function() {
        $('#divGrupoForm').slideDown("slow");
        $('#showGrupoForm').addClass('w3-hide');
        $('#hideGrupoForm').removeClass('w3-hide');
    })
});