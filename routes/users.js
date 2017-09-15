var express = require('express');
var router = express.Router();

// GET users listing. 
router.get('/userlist', function(req, res){	
	var db = req.db;
	var collection = db.get('userlist');
	collection.find({},{},function(e,docs){
		res.json(docs);
		});
	});

//POST to adduser
router.post('/adduser', function(req,res){
	var db = req.db;
	var collection = db.get('userlist');
	collection.insert(req.body, function(err, result){
		res.send(
			(err === null) ? { msg: ''} : { msg : err}
			);
	});
});


// DELETE to deleteuser.
router.delete('/deleteuser/:id', function(req,res){
var db = req.db;
var collection = db.get('userlist');
var userToDelete = req.params.id;
collection.remove({'_id': userToDelete}, function(err){
	res.send((err === null) ? { msg:''} : {msg:'error:' + err});
	});
});

// PUT to update user

router.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToUpdate = req.params.id;
    // Find the user by ID and pass req.body (all the form data) to MongoDB
    collection.update({ '_id': userToUpdate }, req.body, function(err) {
      res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
