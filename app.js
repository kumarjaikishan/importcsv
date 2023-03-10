var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var csvModel = require('./models/csv');
var csv = require('csvtojson');
var bodyParser = require('body-parser');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var uploads = multer({ storage: storage });

//connect to db
mongoose.connect('mongodb+srv://jai:Jai%404880@cluster0.4ntduoo.mongodb.net/exp?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err))

//init app
var app = express();

//set the template engine
app.set('view engine', 'ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));

//static folder
app.use(express.static(path.resolve(__dirname, 'public')));

//default pageload
app.get('/', (req, res) => {
    csvModel.find({ userid: "63aa962f68dc4f69b0f23e5e" }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data != '') {
                res.render('demo', { data: data });
            } else {
                res.render('demo', { data: '' });
            }
        }
    });
});

var temp;

app.post('/', uploads.single('csv'), (req, res) => {
    //convert csvfile to jsonArray   
    try {
        csv().fromFile(req.file.path)
            .then((jsonObj) => {
                // console.log(jsonObj);
                // res.json(jsonObj);
                for (var x = 0; x < jsonObj; x++) {
                    temp = parseFloat(jsonObj[x].Amount)
                    jsonObj[x].Amount = temp;
                }
                csvModel.insertMany(jsonObj, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(201).send('sucessfully uploaded');
                    }
                });
            });
    } catch (error) {
        console.log("error ho gaya : " + error)
    }

});

//assign port
var port = process.env.PORT || 5000;
app.listen(port, () => console.log('server run at port ' + port));