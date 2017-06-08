var page = require('webpage').create();
page.open('./art/mondrian.html', function() {
  page.render('art.png');
  phantom.exit();
});