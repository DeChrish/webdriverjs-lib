var path = require('path');
var where = process.env['ENVIRONMENT'] || 'dev1';
var browser = process.env['BROWSER'] || 'chrome';
var env = require('./environments.json');
var users = require('./users');
var caps = require('./capabilities');
var chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var screenshot = require('./screenshot');
var shelljs = require('shelljs');
var fs =  require('fs');

var basedir = './target/endtoend/screenshots/';
var timeOut = 20000;
var chai = require('chai');
chai.config.truncateThreshold = 0;

var driver;

module.exports = {
  where: where,
  config: env,
  users: users,
  timeOut: timeOut,
  driver: function() {
    return driver;
  }
};

test.before(function() {
  var width = 300;
  var height = 800;
  driver = new webdriver.Builder()
//    .usingServer('http://rumba.lvdc.kp.org:4445/wd/hub/')
    .withCapabilities(caps[browser])
    .build();
  driver.manage().deleteAllCookies();
  driver.manage().window().setSize(width, height);
  driver.manage().timeouts().implicitlyWait(timeOut);
  shelljs.rm('-rf',basedir);
  });

test.beforeEach(function(){
  shelljs.mkdir('-p' ,path.join(basedir,this.currentTest.parent.fullTitle(),this.currentTest.title));
  screenshot.startTest(driver,this.currentTest);
});

test.afterEach(function() {
  var currentTestName = this.currentTest.title;
  driver.manage().deleteAllCookies();
  if (this.currentTest.state === 'failed'){
    console.log(this.currentTest.state);
      var filename =path.join((basedir+this.currentTest.parent.fullTitle()),this.currentTest.title,this.currentTest.title+'.step.Fail'+'.png');
      driver.takeScreenshot().then(function(image){
        fs.writeFileSync(filename, image, 'base64' );
      });
  }
});
test.after(function() {
  driver.session_.then(function(sessionData) {
    if (sessionData.id) {
      driver.quit();
    } else {
      driver.close();
    }
  });
});