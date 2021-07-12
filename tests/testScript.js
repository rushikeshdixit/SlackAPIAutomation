/*
* Project: Slack API Automation
* Author: Rushikesh Dixit
* Slack Workspace: D-Soft
* Slack channel: test-project
* Framework: JavaScript and ChakramJS
* List of APIs Automated:
    * Get Channels list
    * Post Messages to Slack channel
    * Schedule and send messages to slack channel after 10 seconds
*/

var moment = require('moment');
var chakram = require('chakram');
expect = chakram.expect;

describe("Slack API Tests for Workspace D-Soft", function() {
  var baseURL = "https://slack.com/api";
  var channelName;
  var options = {
    headers: {
        'Authorization': '<token>'
    }
  };
  // Slack API to get list of channels and perform tests
  it("Get Channels List", function () {
    var response = chakram.get(baseURL+'/conversations.list',options);
    return response.then(function (data) {
        var jsonData = data.body;
        channelName = jsonData['channels'][2]['name'];
        expect(response).to.have.status(200);
        expect(channelName).to.equals("test-project");
        // expect(channelName).to.equals("test"); //Failing Negative Case
    });
});

//Slack API to post messages to slack channel named "test-project" and perform basic tests
  it("Post Messages to Slack", function () {
    var response = chakram.post(baseURL + "/chat.postMessage",{
      channel: channelName,
      as_user: true,
      text: "Helloooo",
      pretty: 1
    },options);
    return response.then(function (data) {
        expect(response).to.have.status(200);
        var jsonData = data.body;
        userId = jsonData['message']['user'];
        channelId = jsonData['channel'];
        expect(jsonData['ok']).to.eql(true);
        expect(userId).to.equals("U027L0P6PQV");
        expect(channelId).to.equals("C0281LR3JRX");
        // expect(channelId).to.equals("C0281LR3ABC"); //Negative Failing Case
    });
  });
  
//Slack channel to post messages at a scheduled time (After 10 seconds of current time). Epoch time is calculated using the moments library
  it("Schedule Messages to Slack", function () {
      var timestamp = Math.ceil(((moment().valueOf() / 1000)) + 10);
      var response = chakram.post(baseURL + "/chat.scheduleMessage",{
      channel: channelName,
      post_at: timestamp,
      text:"Scheduled Msg at epoch time" +timestamp,
      pretty:1
    },options);
    return response.then(function (data) {
        expect(response).to.have.status(200);
        var jsonData = data.body;
        userId = jsonData['message']['user'];
        channelId = jsonData['channel'];
        expect(jsonData['ok']).to.eql(true);
        expect(userId).to.equals("U027L0P6PQV");
        // expect(userId).to.equals("U027L0P6PQR"); //Negative Failing Case
        expect(channelId).to.equals("C0281LR3JRX");
    });
  });
})
