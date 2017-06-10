const Twitter = require('node-twitter'),
Tumblr = require('tumblrwks'),
exec = require('child_process').exec,
fs = require('fs'),
argv = require('minimist')(process.argv.slice(2)),
chrome = argv.chrome;

var tumblr = new Tumblr({
        consumerKey: '-------',
        consumerSecret: '-------',
        accessToken: '-------',
        accessSecret: '-------'
    }, "------.tumblr.com" 
);
var twitterRestClient = new Twitter.RestClient(
    '--------------',
    '--------------',
    '--------------',
    '--------------'
);


var convertCommand = ['-trim', '-bordercolor', '"#ffffff"', '-border', '12', '-bordercolor', 'white', '-border', '6', 'art.png', 'framed.png'];


var build = function(err, stdout, stderr) {
    exec('convert ' + convertCommand.join(' '), function(err, stdout, stderr) {
        console.log(convertCommand.join(' '));
        //console.log(err);
        var photo = fs.readFileSync('./framed.png');
        tumblr.post('/post', { type: 'photo', state: 'draft', data: [photo] }, function(err, json) {

            tumblr.post('/post/edit', { id: json.id, state: 'published', caption: Check this out }, function(err, out) {
                console.log(out);
            });
        });
        twitterRestClient.statusesUpdateWithMedia({
                'status': 'Check this out #art',
                'media[]': './framed.png'
            },
            function(error, result) {
                if (error) {
                    console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
                }

                if (result) {
                    console.log(result);
                }
            }
        );
    });
};

if (chrome) {
    exec('node chromeDriver.js', build);
} else {
    exec('phantomjs phantomDriver.js', build);
}
