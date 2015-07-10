var redis = require('redis');
var colors = require('colors');

var redisClient = redis.createClient();

redisClient.smembers('jobs', function(err, data){
  if (err) throw err;

  data.forEach(function(element, array, index){
    redisClient.hgetall('jobs:' + element, function(err, obj){
      if(err) throw err;
      console.log("Job:".inverse.white + " " + element.bold + " " + "Company:".inverse.white  + " "+ obj.company.underline  + " \n");
    });
  });
});
