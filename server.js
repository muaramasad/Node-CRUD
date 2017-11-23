const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
var db
// Declare object Id
var ObjectId = require('mongodb').ObjectID

MongoClient.connect('mongodb://***:***@ds****.mlab.com:15396/stars-wars-quote', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
  	//Get request
  	app.get('/', (req,res) => {
 		//res.sendFile(__dirname + '/index.html')
 		db.collection('quotes').find().toArray(function(err, results) {
 			//console.log(results)
 			if (err) return console.log(err)
 			res.render('index.ejs', {quotes: results})
 		})
 	})
 	// Get request by id
 	app.get('/quotes/:_id', (req,res) => {
 		//res.send(req.params._id)
 		//res.sendFile(__dirname + '/index.html')
		db.collection('quotes').find({ "_id": ObjectId(req.params._id) }).toArray(function(err, results) {
			if (err) return console.log(err)
 			res.render('quote.ejs', {quotes: results})
		})
 		// db.collection('quotes').find().toArray(function(err, results) {
 		// 	//console.log(results)
 		// 	if (err) return console.log(err)
 		// 	res.render('index.ejs', {quotes: results})
 		// })
 	})
 	// Post request
 	app.post('/quotes', (req, res) => {
 		// Save to DB
	  	db.collection('quotes').save(req.body, (err, result) => {
	    	if (err) return console.log(err)
	    	console.log('saved to database')
	    		res.redirect('/')
	  		})
	})
	// Update request
	app.put('/quotes', (req, res) => {
	db.collection('quotes').findOneAndUpdate({name: 'fly'}, {
		$set: {
			name: req.body.name,
			quote: req.body.quote
		}
	}, {
		sort: {_id: -1},
		upsert: true
	}, (err, result) => {
		if (err) return res.send(err)
		res.send(result)
	})
	})
	// Delete request
	app.delete('/quotes', (req, res) => {
		db.collection('quotes').findOneAndDelete({name: req.body.name},
		(err, result) => {
			if (err) return res.send(500, err)
			res.send({message: 'A darth vadar quote got deleted'})
		})
	})
  })
})

// app.use(bodyParser.urlencoded({extended: true}))

// app.listen(3000, function(){
// 	app.get('/', (req,res) => {
// 		//res.send('Hello World')
// 		res.sendFile(__dirname + '/index.html')
// 	})
// 	app.post('/quotes', (req, res) => {
//   		console.log(req.body)
// 	})
// })
