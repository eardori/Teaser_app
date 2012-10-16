Ti.include("./global.js");
var winLiked = Titanium.UI.currentWindow;
var tabLiked = Titanium.UI.currentTab;

loadLiked(winLiked.idx);

function loadLiked(idx)
{
	Ti.API.trace('winLiked.js call loadLiked(' + idx + ')');
	showIndicator("Loading...");	
	var callbackReq = Titanium.Network.createHTTPClient();
	callbackReq.open("GET", txtBaseURL + "/m/user/my/favorite/reverseList/" + idx);
	callbackReq.onload = function()
	{
		var tableView = Ti.UI.createTableView({
			backgroundColor:'white',
		});
		var tableData = [];
		tableView.setData([]);
		var callbackresponse = this.responseText;
		var data = JSON.parse(callbackresponse);
		Ti.API.trace('return from Server : ' + JSON.stringify(data));
		for(i=0;i<data.favorites.length;i++)
		{
			var user = data.favorites[i].fromUser;

			var row = Ti.UI.createTableViewRow({
				selectedBackgroundColor:'#f9bf7a',
				backgroundColor:'#efefef',
				rowIndex:i, // custom property, useful for determining the row during events
				idx:user._id,
				name:user.firstName + ' ' + user.lastName,
				selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,			
			    height:60
			});
			var photoUrl = '';
			if (typeof(user.photos) != 'undefined' && user.photos.length > 0) {
				photoUrl = txtImageURL + user.photos[0].imageId + '/w/60/h/60';
			}			
			else {
				photoUrl = '/images/no_profile_img.gif';
			}
	  
			var imageAvatar = Ti.UI.createImageView({
			    image: photoUrl,
			    left:0, top:0,
			    width:60, height:60
			});
			row.add(imageAvatar);
			  
			var labelUserName = Ti.UI.createLabel({
			    color:'#000',
				font:{fontFamily:'Gochi Hand', fontSize:defaultFontSize+6, fontWeight:'bold'},
				text:user.firstName + ' ' + user.lastName,
			    left:100, top: 3,
			    width:210, height: 30
			});
			row.add(labelUserName);
			  
			var labelGender = Ti.UI.createLabel({
				color:'#6a85ac',
				font:{fontFamily:'Arial', fontSize:defaultFontSize, fontWeight:'normal'},
				text:user.gender,
			    left:100, top:20, textAlign:'right',
			    width:210
			});
			row.add(labelGender);
			
			var labelCity = Ti.UI.createLabel({
				color:'#9c9c9c',
				font:{fontFamily:'Arial', fontSize:defaultFontSize-2, fontWeight:'normal'},
				text:user.currentCity,
				left:100, top:45,
				width:210
			});
			row.add(labelCity);
	 
			tableData.push(row);
		}
		tableView.setData(tableData);
		tableView.addEventListener('click', function(e)
		{
	
		});
		winLiked.add(tableView);		
		hideIndicator(500);
	}
	callbackReq.onerror = function()
	{
		hideIndicator(500);
	}
	callbackReq.send();
}

// track page view on focus
winLiked.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winLiked');
});