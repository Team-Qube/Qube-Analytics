var User = require('./user.js');

var database = {
	getUserData: function(callback){ 
		var temp = [];
		User.aggregate([{ $project : { _id : 1, lastLogin: 1, loginCount : 1}}, { $sort : { lastLogin : -1 }} ], function(err, users){
			if(err) {
				console.log("ERROR: " + err);
			}
			else {
				callback(users);
			}
		});
	},

	getTotalLoginCount: function(callback){
		User.aggregate([{ $group : { _id : null, totalCount : { $sum : "$loginCount" } } }], function(err, result){
			if(err){
				console.log(err);
			}
			else{
				callback(result);
			}
		});
	},

	getDates: function(callback){
		User.aggregate([{
		$group : {
				_id: {
					dayOfYear : {$dayOfYear : "$lastLogin" }
				},
				loginCount : {
					$sum : "$loginCount"
				},
				lastLogin : { $min : "$lastLogin" }
			}
		},
		{
			$project : {
				_id: 0,
				x: "$lastLogin",
				y: "$loginCount"
			}
		},
		{ $sort : {
			x : 1
		}}
		], function(err, result){
			if(err){
				console.log(err);
			}
			else {
				callback(result);
			}
		})
	},

	getPlaylistCount: function(callback){
		User.aggregate([{
				$unwind : "$playlist"
			}, {
				$group : { "_id" : "$playlist" }
			}, {
				$group : { "_id" : {} , count : {$sum:1} }}
		], function(err, result){
			if(err){
				console.log(err);
			} else {
				callback(result);
			}
		});
	}
};
module.exports = database;