const Gun = require('gun');
var gun = Gun('https://db.robbestad.no/gun');
gun.put({hello: process.argv[2] || Math.random()*1000 }).key('random/mui3');
