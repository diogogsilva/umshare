
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
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.opacity = "0";
            setTimeout(function () { div.style.display = "none"; }, 600);
        }
    }

    setTimeout(function () { document.getElementById('divAlertSuccess').style.opacity = 0; }, 3000);

    //$('#publicacaoForm').append('<input type="text" name="user" value="' + req.user.email + '" />');
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