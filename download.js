var http = require('http');
var fs = require('fs');
function download(url,index, callback){
  console.log("Download From " + url);
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data, index);
    });
  }).on("error", function() {
    callback(null, index);
  });
}

var url = "http://jobsearch.monster.com/browse/?pg=";
for(var i = 1; i <= 100; i ++){
  download(url+i,i, function(data, index){
    if(data === null){
      console.log("Download from " + url+index + " Failed");
    } else {
      fs.writeFile('pages/monster'+index+'.html', data, function(err){
        if (err) throw err;
        console.log("Download from " + url+index + " Finished; Writing Data To monster" + index);
      });
    }
  }); //jshint ignore: line
}
