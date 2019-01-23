
function notJson(){

        var body = '{"errors":{"base":"Oops! Unit not found."}';

    if (typeof body != 'string')
    body = JSON.stringify(body);
    try {
        JSON.parse(body)
        if (body == '{}'){
                console.log("\n", "\n", 'JSON is empty: ', body, "\n", "\n")}
                else
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

notJson();



