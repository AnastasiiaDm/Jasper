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

function getUnitsByID(id, timeInMs, callback){
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
            ensureDirectoryExistence('C:/Users/user/Downloads/JSON('+timeInMs+')/test.json', JSON.stringify(body));
            callback(body);
        }
        else{
            console.log("unit data error", error);
            ensureDirectoryExistence('C:/Users/user/Downloads/JSON('+timeInMs+')/test.json', JSON.stringify(error));
        } 
    });
}

function ensureDirectoryExistence(filePath, body) {

    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        console.log(dirname)
      return true;
    }
    ensureDirectoryExistence(dirname,null);
    console.log(dirname)

    fs.mkdirSync(dirname);
    fs.writeFileSync(filePath, body);
  }

function isJson(body){
    if (typeof body != 'string')
    body = JSON.stringify(body);
    try {
        JSON.parse(body)
        if(body != '{"errors":{"base":"Oops! Unit not found."}}'){
            console.log("\n", "\n", 'JSON true: ', body, "\n", "\n")
            return true;
        }
        else{
            console.log('Invalid Unit ID, error message: ', body)
        }
    } catch (e) {
        console.log("\n", "\n",'invalid JSON: ', body, "\n", "\n")
        return false;
    }
}


function getJson(){
    console.log('start');
    request({
        url: "https://jasper-staging.herokuapp.com/api/v1/accounts/login",
        method: "POST",
        json: true,   // <--Very important!!!
        body: authData
    }, function (error, response, body){
        if (error != null || response.statusCode == 201 || response.statusCode == 200) {
            console.log(body);
            jwt = body.jwt;
            console.log("token:", jwt);

            getUnitsByID(1, timeStamp(), function (body) {
                isJson(body);
            });
        }
        else{
            console.log("auth failed", error);
        }
    });
}

getJson();
