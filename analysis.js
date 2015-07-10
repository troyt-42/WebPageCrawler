var cheerio = require('cheerio');
var fs = require('fs');
var Q = require('q');
var redis = require('redis');

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
var redisClient = redis.createClient();

filesPromise.then(function(data){
  var promises = [];
  for(var i = 0; i < data.length; i ++){
    promises.push(readFile(data[i]));
  }
  return Q.all(promises);
}).then(function(){
  var $ = cheerio.load(generalData);
  var result = fs.createWriteStream("result.txt");
  result.write("Job                                                                                                     Company \n");

  $('.jobTitleCol.fnt4').each(function(index, element){
      var node = $(element);
      var job = $(element).find('.fnt11').text();
      var company = $(element).find('.fnt4').attr('title');
      console.log(index);
      console.log(job);
      console.log(company);

      var space = '';
      for(var p = 0; p < "                                                                                                        ".length - job.length; p++){
        space += " ";
      }
      redisClient.sadd('jobs', job);
      redisClient.hset('jobs:'+job, "company", company);
      console.log('jobs:'+job);
      console.log(space + "|");
      result.write(job + space + company + "\n");
  });
  result.end(function(){
    console.log('Done; Please Check the Result using result.js');
  });
});
