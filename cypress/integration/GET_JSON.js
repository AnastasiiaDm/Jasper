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
            ensureDirectoryExistence('C:/Users/user/Downloads/JSON('+timeInMs+')/ID_'+id+'.json', JSON.stringify(body));
            callback(body);

            
        }
        else{
            console.log("unit data error", error);
            ensureDirectoryExistence('C:/Users/user/Downloads/JSON('+timeInMs+')/ID_'+id+'.json', JSON.stringify(error));
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
        if (body == '{}'){
                console.log("\n", "\n", 'JSON is empty: ', body, "\n", "\n")}
                else
        if(body != '{"errors":{"base":"Oops! Unit not found."}}'){
            console.log("\n", "\n", 'JSON true: ', body, "\n", "\n")
            return true;
        }
        else{
            console.log( "\n",'Invalid Unit ID, error message: ', "\n", body, "\n")
        }
    } catch (e) {
        console.log("\n", "\n",'invalid JSON: ', body, "\n", "\n")
        return false;
    }
}

function sceneInitialTrue(body){
// обращение к объекту , проверка по всем его топиксам 
    if(body.topics.length){
        // перебор топиков
        body.topics.forEach(function(topic){
            // объявляется переменная, первоначально равная 0, необходима для подсчета количества айтемов в чаптере
            var chapterCount = 0;
            // если в топиках существуют чаптеры
            if(topic.chapters.length){
                //  в переменную chapterCount добаляет количеством чаптеров  
                chapterCount += topic.chapters.length;
                // перебор чаптеров
                topic.chapters.forEach(function(chapter){
                    // если в чаптерах есть сцены
                    if(chapter.scenes.length){
                        // каунтер для сцен с параметром initial : true
                        var init = 0;
                        // перебор сцен
                        chapter.scenes.forEach(function(scene){
                            // если значение initial true
                            if(scene.initial == true){
                                // инкрементиркем init если initial : true
                                init++;
                            }   
                        });
                        // если сцен с initial  true равно 1
                        if(init == 1){
                            // выводим в консоль все ок
                            console.log('scene initial : true: ', init);
                        }
                        else{
                            // вывод в консоль количество фолсов 
                            console.log('scene initial : false', init);
                        }
                        // if(scenes.interactions.length){
                        //     var inter = 0;
                        //     scenes.interactions.forEach(function(interaction){
                        //         if(interaction.initial == true){
                        //             inter++;
                        //         }
                        //     });
                        //     if(inter == 1){
                        //         console.log('interactions initial:true', inter);
                        //     }
                        //     else{
                        //         console.log('interactions initial:false', inter);
                        //     }
                        // }
                    }

                });

            }
            // количество элементов в каждом чаптере
            console.log("chapters:", chapterCount);
        });
    }
}

function interactionsInitialTrue(body){
    if(body.topics.length){
        body.topics.forEach(function(topic){
            if(topic.chapters.length){
                topic.chapters.forEach(function(chapter){
                    var sceneCount = 0;
                    if(chapter.scenes.length){
                        sceneCount += chapter.scenes.length;
                        chapter.scenes.forEach(function(scene){
                            if(scene.interactions.length){
                                var init = 0;
                                scene.interactions.forEach(function(interaction){
                                    if(interaction.initial == true){
                                        init++;
                                    }
                                });
                                if(init == 1){
                                    console.log('interactions initial: true', init);
                                }
                                else{
                                    console.log('interactions initial: false', init);
                                }
                            }
                        });
                        console.log('sceneCount:', sceneCount)
                    }
                })
            }
        }) 
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

            getUnitsByID(1, timeStamp(), 
            function (body) {
                isJson(body);
                sceneInitialTrue(body);
                interactionsInitialTrue(body);
            });
        }
        else{
            console.log("auth failed", error);
        }
    });
}

getJson();
