
$(function () {
    //var cont = 0
    $('#addfile').click(e => {
        e.preventDefault()
        //cont++
        //var ficheiro = $('<div></div>', { class: 'w3-cell-row', id: 'f' + cont })
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

    $('#hidePublicacaoForm').click( function() {
        $('#divPublicacaoForm').slideUp("slow");
        $('#showPublicacaoForm').removeClass('w3-hide');
        $('#hidePublicacaoForm').addClass('w3-hide');
    })

    $('#showPublicacaoForm').click( function() {
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
          $('#publicacoesLayout').show();
          $('#perfilLayout').hide();
          $('#tabGrupos').removeClass('active');
          $('#tabFeed').addClass('active');
          $('#tabPerfil').removeClass('active');
          data.forEach(function(item){
            var clone = $('#templatePublicacoes').clone(true);
            clone.attr("style", "");
            clone.find('#conteudoPub').text(item.conteudo);
            clone.find('#metadataPub').text(item.metadata);
            clone.appendTo("#publicacoesInsertZone");
          })
        });
      }

})