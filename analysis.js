var cheerio = require('cheerio');
var fs = require('fs');
var Q = require('q');

function readFolder(){

  var deferred = Q.defer();
  fs.readdir('pages', function(err, files){
    if (err) deferred.reject(new Error(err));
    deferred.resolve(files);
  });
  return deferred.promise;
}

function readFile(file){
  var deferred = Q.defer();
  fs.readFile('pages/'+file, function(err, data){
    if (err) deferred.reject(new Error(err));
    generalData += data;
    deferred.resolve();
  });
  return deferred.promise;
}

var filesPromise = readFolder();
var generalData = '';
filesPromise.then(function(data){
  var promises = [];
  for(var i = 0; i < data.length; i ++){
    promises.push(readFile(data[i]));
  }
  return Q.all(promises);
}).then(function(){
  var $ = cheerio.load(generalData);
  // var jobTitles = $('.jobTitleContainer').text().split(/\s{4,}/);
  // console.log(jobTitles);
  var result = fs.createWriteStream("result.txt");
  result.write("Job                                                                                         Company \n");
  for(var i = 0; i < 2500; i ++){
    var job = $('.jobTitleContainer').eq(i).text().replace(/\s/g, '').match(/([A-Z][a-z]+)|([A-Z]+)|([a-z]+)/g).join(" ");
    var company = $('.companyContainer .fnt4').eq(i).text().match(/([A-Z][^ ]*)|([a-z][^ ]*)/g).join(" ");
    console.log(i);
    var space = '';
    for(var p = 0; p < "                                                                                            ".length - job.length; p++){
      space += " ";
    }
    console.log(space + "|");
    result.write(job + space + company + "\n");
  }
  result.end(function(){
    console.log('Done; Please Check the Result in result.txt');
  });
});
