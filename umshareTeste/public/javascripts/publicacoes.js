
$(function () {
    //var cont = 0
    $('#addfile').click(e => {
        e.preventDefault()
        //cont++
        //var ficheiro = $('<div></div>', { class: 'w3-cell-row', id: 'f' + cont })
        var ficheiroInput = $('<input/>', { class: 'w3-input w3-cell', type: 'file', name: "ficheiro" })

        $('#f1').append(ficheiroInput)
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