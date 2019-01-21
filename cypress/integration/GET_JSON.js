var request = require('request');

var path = require('path'),
    fs = require('fs');

    var dateFormat = require('dateformat');

var authData = {
  "auth": {
    "email": "student@jasper.com",
    "password": "Jasper@123"
  }
};

var jwt;

function timeStamp() {

       
    var day=dateFormat(new Date(), "yyyy-mm-dd h..MM..ss");  
    console.log(day)       
      return day;
          
      }

function getUnitsByID(id, timeInMs){
    request({
        url: "https://jasper-staging.herokuapp.com/api/v1/units/"+id,
        method: "GET",
        json: true,   // <--Very important!!!
        headers: {
            'Authorization': jwt
        }
    }, function (error, response, body){
        if (!error && response.statusCode == 201||200) {
            console.log("unit data:", "\n", body)
            ensureDirectoryExistence('C:/Users/user/Downloads/JSON('+timeInMs+')/test.txt', JSON.stringify(body));

        }
        else{
            console.log("unit data error", error);
            ensureDirectoryExistence('C:/Users/user/Downloads/JSON/test.txt', JSON.stringify(error));
        } 
    });
}

function ensureDirectoryExistence(filePath, body) {

    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        console.log(dirname)
      return true;
    }
    ensureDirectoryExistence(dirname,);
    console.log(dirname)

    fs.mkdirSync(dirname);

    fs.writeFileSync(filePath, body, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
  }




function getJson(){
    request({
        url: "https://jasper-staging.herokuapp.com/api/v1/accounts/login",
        method: "POST",
        json: true,   // <--Very important!!!
        body: authData
    }, function (error, response, body){
        if (!error && response.statusCode == 201||200) {
            console.log(body);
            jwt = body.jwt;
            console.log("token:", jwt);

            getUnitsByID(1, timeStamp());

        }
        else{
            console.log("auth failed", error);
        }
    });
}

getJson();


