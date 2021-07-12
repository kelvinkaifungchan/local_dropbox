// Setting up express
const {
    response
} = require("express");
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const fs = require("fs");
const cookieParser = require("cookie-parser");

//Middleware
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.static("files"));
app.use(express.json());
app.use(cookieParser());

//Setup Cach
let cache = {}

// Show home page
app.get("/", (req, res) => {
    fs.createReadStream(__dirname + "/public/index.html").pipe(res);
})

//Write function
const writeFile = (name, body) => {
    console.log("writing file");
    return new Promise((resolve, reject) => {
            fs.writeFile(__dirname + "/files/" + name, body, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(name);
            })
        })
        .then(readFile);
}

//Read function
const readFile = (name) => {
    console.log("reading file");
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + "/files/" + name, (err, body) => {
            if (err) {
                return reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

//Upload files with cache, write and read
app.post("/upload", (req, res) => {
    let files = req.files.filesubmit
    console.log(req.files);
    console.log(cache);

    //Uploading multiple files
    if (files instanceof Array) {
        console.log("uploading multiple files");
        for (let i = 0; i < files.length; i++) {
            console.log(files[i]);
            let fileName = files[i].name;
            let fileData = files[i].data;
            cache[fileName] = writeFile(fileName, fileData);
            cache[fileName].then(() => {
                    console.log("File Name: ", fileName);
                    console.log("File Data: ", cache[fileName]);
                    res.cookie(fileName, cache[fileName]);
                    console.log("Saved multiple files");
                    res.redirect("/")
                })
                .catch((err) => {
                    console.log("Error: ", err);
                })
        }
    }
    //Uploading single file
    else {
        console.log("uploading single file");
        console.log(files)
        let fileName = files.name;
        let fileData = files.data;
        cache[fileName] = writeFile(fileName, fileData);
        cache[fileName].then(() => {
                console.log("File Name: ", fileName);
                console.log("File Data: ", cache[fileName]);
                res.cookie(fileName, cache[fileName]);
                console.log("Save single file");
                res.redirect("/");
            })
            .catch((err) => {
                console.log("Error: ", err);
            })
    }
})

// //Upload files with file.mv
// app.post("/upload", (req, res) => {
//     let file = req.files.filesubmit;
//     if (file instanceof Array) {
//         console.log("Uploaded an array")
//         for (i = 0; i < file.length; i++) {
//             let filePath = __dirname + "/files/" + file[i].name;
//             file[i].mv(filePath), (err) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("file was uploaded")
//                     // res.redirect("/");
//                 }
//             }
//         }
//     } else {
//         let filePath = __dirname + "/files/" + file.name;
//         file.mv(filePath, (err) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log("file was uploaded")
//                 res.redirect("/");
//             }
//         });
//     }
// });

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

// Download files with cache
app.get("/files/:filename", (req, res) => {
    //check if file exists on cache
    if (cache[req.params.filename] == null) {
        console.log("reading from file");
        cache[req.params.filename] = readFile(req.params.filename)
    }
    //download from cache
    cache[req.params.filename].then((body) => {
        console.log(body);
        res.send(body);
        console.log("Download completed")
    })
    .catch((err) => {
        console.log("Error: ", err);
    })
})

// // Download files with res.download
// app.get("/files/:filename", (req, res) => {
//     res.download(__dirname + '/files/' + req.params.filename, req.params.filename, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('download successful');
//             res.redirect("/")
//         }
//     })
// })

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