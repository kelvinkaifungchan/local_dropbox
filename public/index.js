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
    $.get("http://localhost:3000/upload", function (data) {
        for (i = 0; i < data.length; i++) {
            $("tbody").append(
                `<tr>
            <td class="filename" id="${data[i]}"><i>${data[i]}</i></td>
            <td><a href="http://localhost:3000/files/${data[i]}"><i class="fas fa-arrow-down"></i></a></td>
            <td><a href="http://localhost:3000/delete/${data[i]}"><i class="fas fa-times"></i></a></td>
            `
            )
        }
    })

    //Preview files
    $("body").on("click", '.filename', function () {
        let image = $(this).text();
        $("#preview").html(`<div>PREVIEW</div>`);
        if (image.slice(-3) === "jpg" || image.slice(-4) === "jpeg" || image.slice(-3) === "png") {
            $("#preview").append(`<img src="${image}">`)
        } if (image.slice(-3) === "pdf") {
            $("#preview").append(`<iframe src="${image}">`)
        } if (image.slice(-3) === "mp4") {
            $("#preview").append(`
            <video controls>
            <source src="${image}" type="video/mp4">
            </video>
            `)
        } 
    })
})