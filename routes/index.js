var express = require('express');
var router = express.Router();
var fs = require('fs');
var unirest = require('unirest');
// API
var Instagram = require('instagram-node-lib');

var API500px = require('500px');
var consumer_key = 'IbSUcSINMHHuRhNip2l6s82B22AHmzb9KPROAMKH';
var api500px = new API500px(consumer_key);

var COLOURlovers = require('colourlovers');
var youtube = require('youtube-feeds');


//Instagram API Auth
Instagram.set('client_id', '79af45e84849472ab0a81a96e5647359');
Instagram.set('client_secret', '441b70ee21834ba68ccc4ffac5cb4199');


Instagram.tags.info({
  name: 'zach',
  complete: function(data){
    console.log(data);
  }
});


//location of json docs
var jsonFileInsta = 'public/tmp/instagram.json';
var jsonFile500px = 'public/tmp/500px.json';
var jsonFileColorlover = 'public/tmp/colorloverSearch.json';
var jsonFileSound = 'public/tmp/sound.json';
var jsonFileYoutube = 'public/tmp/youtube.json';


var tracks = 'public/tracks.html';



/*=====================================================*/

	
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/500pxSearch', function(req, res) {
  res.render('500pxSearch', { title: 'Express' });
});


/* POST getting results from Instagram text box input. */
router.post('/instaSearch', function(req, res){
	Instagram.users.recent({ 
		user_id: req.body.userInput,
		complete: function(instaData) {
			fs.writeFile(jsonFileInsta, JSON.stringify(instaData,null,4),function (err) {
				if(err){
					console.log(err);
				} else {
					console.log("JSON saved to " + jsonFileInsta);
				}
			});
			res.render('instaSearch', {title: 'Express', instaResult: instaData });
		}
	});
});


/* POST getting results from 500px text box input. */
router.post('/500pxSearch', function(req, res){

	api500px.photos.searchByTerm(req.body.userInput500px, {'sort': 'created_at', 'rpp': '1'},  function(error, fiveData) {
		fs.writeFile(jsonFile500px, JSON.stringify(fiveData,null,4),function (err) {
			if(error){
				console.log(error);
			}else{
				if (err) {
					// Error!
					return;
				} else {
					// Do something
					console.log("JSON saved to " + jsonFile500px);
					res.render('500pxSearch', {title: 'Express', fiveResults: fiveData });
				}
			}
		});
	});
});

router.post('/colorloverSearch', function(req, res){

	COLOURlovers.get('/palettes', {
		keywords:   req.body.userInputColor,
		sortBy:     'ASC',
		numResults: 5
	},function(error, colorData) {
		fs.writeFile(jsonFileColorlover, JSON.stringify(colorData,null,4), function (err){
			if(error){
				console.log(error);
			}else{
				if(err){
					return;
				} else {
					//console.log(colorData);
					res.render('colorloverSearch', {title: 'Express', colorResults: colorData });
				}
			}
		});
	});
});

router.post('/soundSearch', function(req, res){

	unirest.get("https://musixmatchcom-musixmatch.p.mashape.com/wsr/1.1/matcher.track.get?q_artist="+req.body.userInputSoundArtist+"&q_track="+req.body.userInputSoundTrack)
	.header("X-Mashape-Key", "ct4NNHsnUzmshkhQo6vCo1Kydbmip1U2fmgjsnHAnLwy92AzDg")
	.end(function (soundData) {
	  	console.log(JSON.parse(soundData.body));
	  	console.log("https://musixmatchcom-musixmatch.p.mashape.com/wsr/1.1/matcher.track.get?q_artist="+req.body.userInputSoundArtist+"&q_track="+req.body.userInputSoundTrack);
	
		res.render('soundSearch', {title: 'Express', soundResults: soundData.body });
	});
});

router.post('/youtubeSearch', function(req, res){
	youtube.httpProtocol = 'https';
	youtube.feeds.videos({q:req.body.userInputYoutube,'max-results':2}, function(err, youtubeData){
		if(err){
			console.log(err);
		} else{
			fs.writeFile(jsonFileYoutube, JSON.stringify(youtubeData,null,4), function (youtubeerr){
				if(youtubeerr instanceof Error){
					console.log(youtubeerr);
				} else {
					console.log(youtubeData);
					res.render('youtubeSearch', {title: 'Express', youtubeResults: youtubeData });
				}
			});//end fs write
		}
	});
});


unirest.get("https://musixmatchcom-musixmatch.p.mashape.com/wsr/1.1/track.get?track_id=15449912")
	.header("X-Mashape-Key", "ct4NNHsnUzmshkhQo6vCo1Kydbmip1U2fmgjsnHAnLwy92AzDg")
	.end(function (result) {
		fs.writeFile(jsonFileSound, JSON.stringify(JSON.parse(result.body),null,4), function (sounderr){
			if(sounderr){
				console.log(sounderr);
			} else {
				console.log("JSON saved to " + jsonFileSound);
			}
		});
	});


module.exports = router;




  // fs.writeFile(tracks, response.raw_body, function(err) {
  // 	if (err) throw err;
  // 	console.log('saved');
  // });




































