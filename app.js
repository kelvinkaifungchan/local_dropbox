// Setting up express
const express = require("express")
const app = express()
const fileUpload = require("express-fileupload");
const fs = require("fs");
const cors = require('cors')

//Middleware
app.use(fileUpload())
app.use(express.static("public"));
app.use(express.static("files"));
app.use(express.json())
app.use(cors())

// Creating Cache
let cache = {};
const infoArr = []

// Show home page
app.get("/", (req, res) => {
    checkDir()
    fs.createReadStream(__dirname + "/public/index.html").pipe(res);
})

//Upload files
app.post("/upload", (req, res) => {
    let file = req.files.filesubmit;
    let filePath = __dirname + "/files/" + file.name;
    file.mv(filePath, (err) => {
        if (err) {
            console.log(err);
        } else {
            checkDir()
            checkInfo();
            res.redirect("/");
        }
    });
});

// Get file names on database
function checkDir() {
    fs.readdir(__dirname + "/files/", (err, files) => {
        if (err) {
            res.status(404);
            console.log("Directory not found");
        }
        let filesubmit = files
        let data = JSON.stringify(files);
        fs.writeFile(__dirname + "/dataBase.json", data, 'utf8', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("file was saved");
            }
        })
    })
}

function checkInfo() {
    fs.readdir(__dirname + "/files/", (err, files) => {
        if (err) {
            res.status(404);
            console.log("Directory not found");
        }
        const filesubmit = files;
        for (i=0; i < files.length; i++) {
            fs.stat(__dirname + "/files/" + files[i], (err, stats) => {
                infoArr.push(stats.size);
            })
        }
        console.log(infoArr);
    })
}

// const infoArr = []
//                 for (i = 0; i < files.length; i++) {
//                     fs.stat(__dirname + "/files/" + files[i], (err, stats) => {
//                         infoArr.push(stats.size);
//                         fs.writeFile(__dirname + "/infoBase.json", JSON.stringify(infoArr), 'utf8', (err) => {
//                             if (err) {
//                                 console.log(err);
//                             }
//                             console.log("file info was saved")
//                         })
//                     })
//                 }

// Access json files for database
app.get("/dataBase.json", (req, res) => {
    res.sendFile(__dirname + "/dataBase.json")
})

// Setting up points to download files
app.get("/files/:filename", (req, res) => {
    res.download(__dirname + '/files/' + req.params.filename, req.params.filename, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.writeHead(200);
            console.log('download successful');
            res.redirect("/")
            res.end();
        }
    })
})

// Delete files
app.get("/delete/:filename", (req, res) => {
    fs.unlink(__dirname + '/files/' + req.params.filename, (err) => {
        if (err) {
            console.log(err);
        } else {
            checkDir();
            res.redirect("/");
            console.log('delete successful');
            res.end();
        }
    })
})


// Setting Up Server
app.listen(3000, function () {
    console.log("working on port 3000")
})