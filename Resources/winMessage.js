Ti.include("./global.js");

var winMessage = Titanium.UI.currentWindow;
var tabMessage = Titanium.UI.currentTab;
winMessage.orientationModes = [1,2,3,4];
winMessage.barColor = '#4782ab';
/*
 Copyright 2011 Pedro Enrique
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

Titanium.SMSView = require('ti.smsview');



var textArea = Ti.SMSView.createView({
	//maxLines:6,				// <--- Defaults to 4
	//minLines:2,				// <--- Defaults to 1
	backgroundColor: '#dae1eb',	// <--- Defaults to #dae1eb
//	assets: 'assets',			// <--- Defauls to nothing, smsview.bundle can be placed in the Resources dir
	// sendColor: 'Green',		// <--- Defaults to "Green"
	// recieveColor: 'White',	// <--- Defaults to "White"
	// selectedColor: 'Blue',	// <--- Defaults to "Blue"
	editable: true,			// <--- Defautls to true, do no change it
	animated: false,			// <--- Defaults to true
	// buttonTitle: 'Something',	// <--- Defaults to "Send"
	// font: { fontSize: 12 ... },	// <--- Defaults to... can't remember
	autocorrect: false,		// <--- Defaults to true
	// textAlignment: 'left',	// <--- Defaulst to left
	// textColor: 'blue',		// <--- Defaults to "black"
	returnType: Ti.SMSView.RETURNKEY_DEFAULT, // <---- Defaults to Ti.SMSView.RETURNKEY_DEFAULT
	camButton: false,				// <--- Defaults to false
	hasTab: true				// <--- Defaults to false	
});

winMessage.add(textArea);

/*
buttonBar.addEventListener('click', function(e){
	switch(e.index){
		case 0:	textArea.recieveMessage('Hello World!'); break;
		case 1: textArea.empty(); break;
		case 2: Ti.API.info(textArea.getAllMessages()); break;
		case 3: textArea.sendButtonDisabled = true; break;
		case 4: textArea.sendButtonDisabled = false; break;
	}
});
textArea.addEventListener('camButtonClicked', function(){
	// fires when clicked on the camera button
	
	var options = Ti.UI.createOptionDialog({
		options: ['Photo Gallery', 'Cancel'],
		cancel: 1,
		title: 'Send a photo'
	});
	options.show();
	options.addEventListener('click', function(e) {
		if(e.index == 0){
		// --------------- open the photo gallery and send an image ------------------
			Titanium.Media.openPhotoGallery({
				success: function(event) {
					// uncomment to set a specific width, in this case 100
					// var image = Ti.UI.createImageView({image:event.media});
					// image.width = 100;
					// image.height = (100/event.media.width)*event.media.height
					//textArea.sendMessage(image.toBlob());
					textArea.sendMessage(event.media);
				},
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
			});
		// ---------------------------------------------------------------------------
		}
	});	
});

textArea.addEventListener('change', function(e){
	Ti.API.info(e.value);
});
textArea.addEventListener('messageClicked', function(e){
	// fires when clicked on a message
	if(e.text){
		Ti.API.info('Text: '+e.text);
	}
	if(e.image){
		Ti.API.info('Image: '+e.image);
	}
	Ti.API.info('Index: ' + e.index);
});
*/

textArea.addEventListener('click', function(e){
	if(e.scrollView){
		textArea.blur();
	}
	// fires when clicked on the scroll view
	Ti.API.info('Clicked on the scrollview');
});
textArea.addEventListener('buttonClicked', function(e){
	var tmpEmail = loginCheck();
	if (tmpEmail===false) return;
	// fires when clicked on the send button
    var callbackReq = Titanium.Network.createHTTPClient();
    var msgText = e.value;
//    var msgText = Titanium.Utils.base64encode(e.value);
    callbackReq.open("POST", txtBaseURL + '/m/user/my/message/send/' + winMessage.idx + '?email=' + tmpEmail + '&message=' + msgText);
    textArea.sendButtonDisabled = true;
    callbackReq.onload = function()
    {
    	textArea.addLabel(new Date()+"");
    	textArea.sendMessage(msgText);
    	textArea.sendButtonDisabled = false;
    	var response = this.responseText;
    }
    callbackReq.onerror = function()
    {
    	Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('send_failed')}).show();
    }
    callbackReq.send();
});

loadMessage(textArea);

function loadMessage(winSMS)
{
	var email = loginCheck();
	if (email===false) return;
	
	showIndicator('Loading...');
	var callbackReq = Titanium.Network.createHTTPClient();
	callbackReq.open("GET", txtBaseURL + '/m/user/my/message/' + winMessage.idx + '?email=' + email);
	callbackReq.onload = function()
	{
		var callbackresponse = this.responseText;
		var data = JSON.parse(callbackresponse);
		for(i=0;i<data.messages.length;i++) {
			var message = data.messages[i];
			var msgText = message.message;
			if (message.from === email) {
				Ti.API.info("Sent:" + message.sentDate + " " + msgText);
				winSMS.addLabel(message.sentDate);
				winSMS.sendMessage(msgText);				
			} else {
				Ti.API.info("Received:" + message.sentDate + " " + msgText);
				winSMS.addLabel(message.sentDate);
				winSMS.recieveMessage(msgText);
			}
		}
		hideIndicator(500);
	}
	callbackReq.onerror = function()
	{
		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('bad_connection')}).show();
		hideIndicator(500);
	}
	callbackReq.send();	
}	
		
// track page view on focus
winMessage.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winMessage');
});