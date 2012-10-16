Ti.include("./global.js");

var winMessageMain = Titanium.UI.currentWindow;
var tabMessageMain = Titanium.UI.currentTab;

winMessageMain.backgroundColor = '#cfcfcf';
winMessageMain.title = 'Message';



var btnRefresh = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
});
btnRefresh.addEventListener('click', function(e)
{
	loadMessagelist(winMessageMain);	
});
winMessageMain.setRightNavButton(btnRefresh);

loadMessagelist(winMessageMain);

function loadMessagelist(win)
{
	Ti.API.trace('winMessageMain.js call loadMessagelist(' + win + ')');
	var email = loginCheck();
	if (email===false) return;
	
	showIndicator('Loading...');
	var tableView = Ti.UI.createTableView({
	  backgroundColor:'white',
	});
	var tableData = [];
	tableView.setData([]);
	var callbackReq = Titanium.Network.createHTTPClient();
	callbackReq.open("GET", txtBaseURL + "/m/user/my/message?email=" + email);
	callbackReq.onload = function()
	{
		var callbackresponse = this.responseText;
		var data;
		data = JSON.parse(callbackresponse);
		for(i=0;i<data.messages.length;i++)
		{
			var message = data.messages[i];	
			var row = Ti.UI.createTableViewRow({
				selectedBackgroundColor:'#f9bf7a',
				backgroundColor:'#efefef',
				rowIndex:i, // custom property, useful for determining the row during events
				idx:message.partnerUserId,
				name:message.partnerName,
				selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,			
			    height:85
			});
			var photoUrl = '';
			if (typeof(message.partnerPhotoImageId) !== 'undefined' && message.partnerPhotoImageId!==null) {
				photoUrl = txtImageURL + message.partnerPhotoImageId + '/w/105/h/105';
				Ti.API.info(photoUrl);
			}
			else {
				photoUrl = '/images/no_profile_img.gif';
			}
			Ti.API.info(photoUrl);		  
			var imageAvatar = Ti.UI.createImageView({
			    image: photoUrl,
			    left:0, top:0,
			    width:85, height:85
			});
			row.add(imageAvatar);
			  
			var labelUserName = Ti.UI.createLabel({
			    color:'#000',
				font:{fontFamily:'Gochi Hand', fontSize:defaultFontSize+2, fontWeight:'bold'},
				text:message.partnerName,
			    left:100, top: 3,
			    width:210, height: 30
			});
			row.add(labelUserName);
			  
			var labelDate = Ti.UI.createLabel({
				color:'#6a85ac',
				font:{fontFamily:'Arial', fontSize:defaultFontSize, fontWeight:'normal'},
				text:message.lastSentDate.substr(0,10),
			    left:100, top:20, textAlign:'right',
			    width:210
			});
			row.add(labelDate);
			
			var labelMesssage = Ti.UI.createLabel({
				color:'#9c9c9c',
				font:{fontFamily:'Arial', fontSize:defaultFontSize-2, fontWeight:'normal'},
				text:message.messages[message.messages.length - 1].message,
				left:100, top:45,
				width:210
			});
			row.add(labelMesssage);
	 
			tableData.push(row);
		}
		tableView.setData(tableData);
		tableView.addEventListener('click', function(e)
		{
			var winMessage = Titanium.UI.createWindow({
				title: e.rowData.name,
				backButtonTitle: 'back',
				barColor: '#9dcee7',
				url: './winMessage.js'
			});
			winMessage.idx = e.rowData.idx;
			tabMessageMain.open(winMessage, {animated: true});		
		});
		win.add(tableView);
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
winMessageMain.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winMessageMain');
});
