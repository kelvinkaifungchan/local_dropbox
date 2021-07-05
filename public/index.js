$(document).ready(function () {

    // Show files selected for upload
    $("#filesubmit").on("change", function () {
        for (i = 0; i < $(this)[0].files.length; i++) {
            $("#fileselected").append(
                `<div>${$(this)[0].files[i].name}</div>`
            )
        }
    })

    // Show files in database in table
    $.get("http://localhost:3000/dataBase.json", function (data) {
        for (i = 0; i < data.length; i++) {
            $("tbody").append(
                `<tr>
            <td><i>${data[i]}</i></td>
            <td></td>
            <td><a href="http://localhost:3000/files/${data[i]}"><i class="fas fa-arrow-down"></i></a></td>
            <td><a href="http://localhost:3000/delete/${data[i]}"><i class="fas fa-times"></i></a></td>
            `
            )
        }
    })

})