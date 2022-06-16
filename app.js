const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

//environmental variables
require("dotenv").config()
const list_id = process.env.LIST_ID;
const api_key = process.env.API_KEY;


app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//The home route 
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});


// The home oute post request for getting values from the form in sign up html file
app.post("/", (req, res) => {

    //getting the values from the htm tables
    const firstName = req.body.fname 
    const lastName = req.body.lname
    const email = req.body.email
    
    //creating a json object that will be posted via the api provided
    const data = {

        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    
    const jsonData = JSON.stringify(data);
    
    //making the api post request
    const url = "https://us14.api.mailchimp.com/3.0/lists/" + list_id; 
    const options = {
        method: "POST",
        auth: "loveday:" + api_key
    }

    const request = https.request(url, options, (response) => {
         
        //control statement for handling success and error incase if any occurs
        if (response.statusCode === 200) {
			res.status(200).sendFile(__dirname + "/success.html");
        } else {
            res.status(422).sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data))
        });
    });
    
    //shutting down resources after writingn the api
    request.write(jsonData);
    request.end();
});

//for redirecting a user after a failed request
app.post("/failure", (req, res) => {
    res.redirect("/");
})



//launching server
app.listen(3000, () => {
    console.log("Server started at port 3000");
    console.log("Press CTR + C to exit server");
});


