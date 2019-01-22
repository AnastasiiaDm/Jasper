
function notJson(){

    var invalidJSON = '"errors":{"base":"Oops! Unit not found."}}';

    if (typeof invalidJSON != 'string')
    invalidJSON = JSON.stringify(invalidJSON);
    try {
        JSON.parse(invalidJSON);
        console.log("\n", "\n", 'JSON true: ', invalidJSON, "\n", "\n")
        return true;
    } catch (e) {
        console.log("\n", "\n",'invalid JSON: ', invalidJSON, "\n", "\n")
        return false;
    }
}

isJson();
