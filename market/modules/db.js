var pg = require('pg');
var async = require('async');
var conString = "postgres://vfwztuwkfhwgjo:Qu_u2f5d5coE6VKH-ivrSjYswt@ec2-23-21-76-246.compute-1.amazonaws.com:5432/dfeslaur11g8bs";
var client = new pg.Client(conString);
client.connect();