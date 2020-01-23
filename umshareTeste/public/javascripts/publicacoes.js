
$(function () {
    //var cont = 0
    $('#addfile').click(e => {
        e.preventDefault()
        //cont++
        //var ficheiro = $('<div></div>', { class: 'w3-cell-row', id: 'f' + cont })
        var ficheiroInput = $('<input/>', { class: 'w3-input w3-cell', type: 'file', name: "ficheiro" })

        $('#f1').append(ficheiroInput)
    })

    var close = document.getElementsByClassName("closebtn");
    var i;

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function(){
            var div = this.parentElement;
            div.style.opacity = "0";
            setTimeout(function(){ div.style.display = "none"; }, 600);
        }
    }

    $("#formRegisto").submit(function(e) {

        e.preventDefault();
    
        var form = $(this);
        var url = form.attr('action');
    
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function(response) {
                if(response.status == 'erro') {
                    $('.alert').css({display: 'none'});
                    $('#msgWarning').html(response.msg);
                    $('#divAlertWarning').css({ opacity: 1 });
                    document.getElementById('divAlertWarning').style.display = 'block';
                    setTimeout(function(){ document.getElementById('divAlertWarning').style.opacity = 0; }, 3000);
                } else {
                    $('.alert').css({display: 'none'});
                    $('#msgSuccess').html(response.msg);
                    $('#divAlertSuccess').css({ opacity: 1 });
                    document.getElementById('divAlertSuccess').style.display = 'block';
                    setTimeout(function(){ document.getElementById('divAlertSuccess').style.opacity = 0; }, 3000);
                    setTimeout(function () {
                        window.location.href = "/login";
                    }, 3000);
                    
                }
            }
        });
    
    
    });

    $("#formLogin").submit(function(e) {
        e.preventDefault();

        var form = $(this);
        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            complete: function(xhr, textStatus) {
                if(xhr.status != 200) {
                    $('.alert').css({display: 'none'});
                    $('#msgWarning').html("Credenciais inválidas!");
                    $('#divAlertWarning').css({ opacity: 1 });
                    document.getElementById('divAlertWarning').style.display = 'block';
                    setTimeout(function(){ document.getElementById('divAlertWarning').style.opacity = 0; }, 3000);
                } else {
                    window.location.href = '/';
                }
            } 
        });

    })

    /*
        $.ajax({
            url: e.currentTarget.action,
            type: 'post',
            dataType: 'application/json',
            data: $("#publicacaoForm").serialize(),
            success: function (data) {
                window.location.href = 'http://localhost:2222/feed'
            }
        });
    
        */
})