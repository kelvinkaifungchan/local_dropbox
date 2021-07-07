// Setting up express
const express = require("express")
const app = express()
const fileUpload = require("express-fileupload");
const fs = require("fs");

//Middleware
app.use(fileUpload())
app.use(express.static("public"));
app.use(express.static("files"));
app.use(express.json())

// Show home page
app.get("/", (req, res) => {
    fs.createReadStream(__dirname + "/public/index.html").pipe(res);
})

//Upload files
app.post("/upload", (req, res) => {
    let file = req.files.filesubmit;
    if (file instanceof Array) {
        console.log("Uploaded an array")
        for (i = 0; i < file.length; i++) {
            let filePath = __dirname + "/files/" + file[i].name;
            file[i].mv(filePath), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("file was uploaded")
                    // res.redirect("/");
                }
            }
        }
    } else {
        let filePath = __dirname + "/files/" + file.name;
        file.mv(filePath, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("file was uploaded")
                res.redirect("/");
            }
        });
    }
});

// Reading directory
function update() {
    console.log("Updating file list");
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname + "/files/", (err, files) => {
            if (err) {
                reject(err)
            }
            console.log(files);
            resolve(files);
        })
    })
}


// Send file names to front end
app.get("/upload", (req, res) => {
    update().then((files) => {
        console.log("Updated file list");
        res.send(files);
    })
});

// Download files
app.get("/files/:filename", (req, res) => {
    res.download(__dirname + '/files/' + req.params.filename, req.params.filename, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('download successful');
            res.redirect("/")
        }
    })
})

// Delete files
app.get("/delete/:filename", (req, res) => {
    fs.unlink(__dirname + '/files/' + req.params.filename, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('delete successful');
            res.redirect("/");
        }
    })
})


// Setting Up Server
app.listen(3000, function () {
    console.log("working on port 3000")
})