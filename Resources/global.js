/**
 * @author Hyunsuck Oh
 */
// Titanium.Facebook.appid = "455863451094729";
Titanium.Facebook.appid = "212457638876931"; // ec531a18935539b8a3d03d0140572d32 access_token=212457638876931|_3ePlftKg27Xo-1FbxDzOxR3EeE
Titanium.Facebook.forceDialogAuth = true;
Titanium.Facebook.permissions = ['publish_stream', 'read_stream', 'user_about_me', 'user_birthday', 'user_education_history', 'user_hometown', 'user_interests', 'user_location','user_work_history','email'];

//Set up analytics
Titanium.include('./analytics.js');
var analytics = new Analytics('UA-33510140-1');
// Call the next function if you want to reset the analytics to a new first time visit.
// This is useful for development only and should not go into a production app.
//analytics.reset();
// The analytics object functions must be called on app.js otherwise it will loose it's context
Titanium.App.addEventListener('analytics_trackPageview', function(e){
	analytics.trackPageview('/iPad' + e.pageUrl);
});

Titanium.App.addEventListener('analytics_trackEvent', function(e){
	analytics.trackEvent(e.category, e.action, e.label, e.value);
});
// I've set a global Analytics object to contain the two functions to make it easier to fire the analytics events from other windows
Titanium.App.Analytics = {
	trackPageview:function(pageUrl){
		Titanium.App.fireEvent('analytics_trackPageview', {pageUrl:pageUrl});
	},
	trackEvent:function(category, action, label, value){
		Titanium.App.fireEvent('analytics_trackEvent', {category:category, action:action, label:label, value:value});
	}
}
// You don't need to call stop on application close, but this is just to show you can call stop at any time (Basically sets enabled = false)
Titanium.App.addEventListener('close', function(e){
	analytics.stop();
});

Titanium.UI.iPhone.appBadge = 0;

var defaultFontSize = 14;
var nSpliterSize = 80;
var nTableHeight = 45;
var cRowBackgroundColor = '#ffffff';
var cRowTitleColor = '#999999';

var txtBaseURL = "http://app.taketalks.com";
var txtImageURL = "http://image.taketalks.com/";
var txtBaseBlogURL = "http://taketalks.tistory.com";
var defButtonProperty = {
	font :{fontSize:12,fontFamily:'Arial', fontWeight:'bold'},
	backgroundImage : './images/BTN_blue_off.png',
	backgroundSelectedImage : './images/BTN_blue_on.png',
	color : '#fff'
};
var defButton2Property = {
	font :{fontSize:12,fontFamily:'Arial', fontWeight:'bold'},
	backgroundImage : './images/BTN_orange_off.png',
	backgroundSelectedImage : './images/BTN_orange_on.png',
	color : '#fff'
};

var indWin = null;
var actInd = null;
var indView = null;

function showIndicator(msg)
{
	Ti.API.trace('globel.js call showIndicator(' + msg + ')');
	indWin = Titanium.UI.createWindow({});
	
	indView = Titanium.UI.createView({
		height: 150,
		width: 150,
		backgroundColor: '#000',
		borderRadius: 10,
		opacity: 0.8,
		zIndex: 15
	});
	indWin.add(indView);
	
	actInd = Titanium.UI.createActivityIndicator({
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height: 45,
		width: 45,
		zIndex: 20
	});
	indWin.add(actInd);
	
	var message = Titanium.UI.createLabel({
		text: msg,
		color: '#fff',
		width: 'auto',
		height: 'auto',
		font: {fontSize: 20, fontWeight: 'bold'},
		top: 105,
		zIndex: 25
	});
	indView.add(message);
	indWin.open();
	actInd.show();
};

function hideIndicator(dur){
	Ti.API.trace('global.js call hideIndicator(' + dur + ')');
	actInd.hide();
	indWin.close({opacity: 0, duration: dur});
};
function loginCheck(isGoOn)
{
	Ti.API.trace('global.js call loginCheck()');
	result = Ti.App.Properties.getString('email').length > 0 ? Ti.App.Properties.getString('email') : false;
	if (!result && !isGoOn) {
		Ti.App.customTabGroup.setActiveTab(3);
		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('ask_login')}).show();
	}
	Ti.API.trace('global.js return loginCheck() ' + result);
	return result;
}
function setFavorite(userId, isLike, obj) {
	Ti.API.trace('global.js call setFavorite(' + userId + ', ' + isLike + ', ' + obj + ')');
	var tmpEmail = loginCheck();
	if (tmpEmail===false) return;
	
	showIndicator("Processing...");
	var callbackReq = Titanium.Network.createHTTPClient();
	var command = isLike ? 'add' : 'delete';
	
	callbackReq.open("GET", txtBaseURL + "/m/user/my/favorite/" + command + "/" + userId + "?email=" + tmpEmail);
	callbackReq.onload = function()
	{
		obj.fireEvent('onSuccess');
		hideIndicator(500);
	}
	callbackReq.onerror = function()
	{
		obj.fireEvent('onFailure');
		hideIndicator(500);
		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('bad_connection')}).show();
	}
	callbackReq.send();	
};
function addInterest(category, interest)
{
	Ti.API.trace('global.js call addInterest(' + category + ', ' + interest + ')');
	var authUrl = txtBaseURL + '/m/user/my/interest/add';
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			var response = JSON.parse(this.responseText);
			if (response.result === true) {
				Ti.API.trace('global.js return addInterest :' + response.interests);
				return true;
			} else {
				Ti.API.trace('global.js return addInterest false');
	    		return false;
	   		}
	   	},
	   	onerror : function(e) {
	   		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('bad_connection')}).show();
	   		Ti.API.trace('global.js return addInterest false');
	   		return e;
	   	}
	});			

	var model = {
		email : Ti.App.Properties.getString('email'),
		interests: [{category: category, name: interest}]
	}
	xhr.open('POST', authUrl);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send( JSON.stringify(model) );	
}
function objectAdd(srcObj, destObj) 
{
	for (key in srcObj) {
		destObj[key] = srcObj[key];
	}
}
function getArrayFromObject(srcObj, srcKey)
{
	var retArray = new Array();
	for (i=0; i<srcObj.length; i++)
	{
		retArray.push(srcObj[i][srcKey]);
	}
	return retArray;
}
function calculateMatch(objTarget)
{
	Ti.API.trace('global.js call calculateMatch(' + objTarget + ')');
	var matchCount = 0;
	var user = Ti.App.Properties.getObject('user');
	var objSrc = user.interests || [];
	for (i=0; i<objTarget.length;i++) {
		for (j=0; j<objSrc.length; j++) {
			Ti.API.trace(i + ' :: ' + objTarget[i].category + ':' + objTarget[i].name + ' ' + j + ' :: ' + objSrc[j].category + ':' + objSrc[j].name);
			if (objTarget[i].category==objSrc[j].category && objTarget[i].name==objSrc[j].name) {
				matchCount++;
				Ti.API.trace('Bingo!');
			}
		}
	}
	return parseInt(matchCount/objTarget.length*100);
	
}
function tryLogin(isFB, email, password, callback)
{
	Ti.API.trace('global.js call tryLogin(' + arguments[4] + ')');
	showIndicator('Logging in...');
	var authUrl = txtBaseURL + '/m/user/auth';
	var user;
	if (!isFB) {
		user = {
			'email': email,
			'password': password
		};
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var response = JSON.parse(this.responseText);
				if (response.result === true) {
					Ti.App.Properties.setString('email', response.email);
					Ti.App.Properties.setObject('user', response.user);
					Ti.API.info(response.email + ' 로그인성공\n' + JSON.stringify(response.user));
					Ti.API.trace('global.js return tryLogin true');
					hideIndicator(500);
					if (arguments.length > 2) {
						Ti.API.trace('callback in tryLogin with parameters ' + arguments);
						callback(arguments[4]);
					} else {
						callback();
					}
					return true;
				} else {
					Ti.API.trace('global.js return tryLogin ' + response.message);
					Ti.UI.createAlertDialog({title: 'TakeTalks', message: L(response.message)}).show();
					hideIndicator(500);
		    		return false;
		   		}
		   	},
		   	onerror : function(e) {
		   		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('bad_connection')}).show();
		   		Ti.API.trace('global.js return tryLogin ' + e);
		   		hideIndicator(500);
		   		return e;
		   	}
		});			

		xhr.open('POST', authUrl);
		xhr.setRequestHeader("content-type", "application/json");
		xhr.send( JSON.stringify(user) );		
	} else {
	    Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
	        if (e.success) {
	        	var result = JSON.parse(e.result);
	        	Ti.API.trace('return from Facebook : ' + JSON.stringify(result));
				user = {
					'firstName': result.first_name,
					'lastName': result.last_name,
					'email': result.email,
					'password': '',
					'currentCity': (typeof(result.location) !== 'undefined' ? result.location.name : ''),
					'gender': (typeof(result.gender) !== 'undefined' ? result.gender : 'male'),
					'birthDay' : result.birthday,
					'status': 'student',
					'regPath' : 'iOS App',
					'regDateTime': new Date(),
					'access_token': Ti.Facebook.getAccessToken()
				};
				var xhr = Titanium.Network.createHTTPClient({
					onload : function(e) {
						var response = JSON.parse(this.responseText);
						if (response.result === 'registered') {
							Ti.API.info(response.email + ' 회원가입성공\n' + JSON.stringify(response.user));
							Ti.App.Properties.setString('email', response.email);
							Ti.App.Properties.setObject('user', response.user);
							hideIndicator(500);
							if (arguments.length > 2) {
								Ti.API.trace('callback in tryLogin with parameters ' + arguments);
								callback(arguments[4]);
							} else {
								callback();
							}
							return true;
						} else if (response.result===true) {
							Ti.API.info(response.email + ' FB로그인성공\n' + JSON.stringify(response.user));
							Ti.App.Properties.setString('email', response.email);
							Ti.App.Properties.setObject('user', response.user);
							hideIndicator(500);
							if (arguments.length > 2) {
								Ti.API.trace('callback in tryLogin with parameters ' + arguments);
								callback(arguments[4]);
							} else {
								callback();
							}
							return true;
				   		}
				   		else {
				   			Ti.UI.createAlertDialog({title: 'TakeTalks', message: L(response.message)}).show();
				   			hideIndicator(500);
				   			return false;
				   		}
				   		
				   	},
				   	onerror : function(e) {
				   		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('bad_connection')}).show();
				   		hideIndicator(500);
				   	}
				});			
			
				xhr.open('POST', authUrl);
				xhr.setRequestHeader("content-type", "application/json");
				xhr.send( JSON.stringify(user) );
	        } else if (e.error) {
	            alert(e.error);
	            hideIndicator(500);
	        } else {
	            alert('Unknown response');
	            hideIndicator(500);
	        }
	    });
	}
//	hideIndicator(500);
}				
					
function tryLogout()
{
	Ti.App.Properties.setString('email', '');
	Ti.App.Properties.setObject('user', {});
};
function getEmailFromFB()
{
	var permissions = {};
	var user_id = '';
	var qry = 'SELECT username, name, pic_small,pic_big,pic_square,timezone,birthday_date,sex,hometown_location,current_location,interests,about_me,education_history,work_history,email,languages from user where uid = me()';
	Ti.API.info('Will run query: ' + qry);
	Ti.Facebook.request('fql.query', {query: qry}, function(r) {
		if (!r.success || !r.result) {
			if (r.error) {
				permissions.text = 'error: ' + r.error;
			} else {
				permissions.text = 'failed to query for permissions';
			}
			return;
		}
		permissions.text = '';
		Ti.API.info('Query result from facebook: ' + r.result);
		var list = JSON.parse(r.result)[0];
	
		var text = '';
		for (var v in list)
		{
			if (v!==null)
			{
				// if (v=='')
					// user_id = v;
				text += v + ' = ' + list[v] + '\n';
			}
		}
		permissions.text = text;
		return list['email'];
	});
};
function fbLoginCheck(callback)
{
	Ti.API.trace('global.js call fbLoginCheck()');
	if (Titanium.Facebook.loggedIn) {
		tryLogin(true, null, null, callback);
	} else {
		tryLogout();
		callback();
	}
}
function getSthFromFB(key, callback)
{
	Ti.API.trace('global.js call getSthFromFb(' + key + ', ' + callback + ')');
    Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
        if (e.success) {
        	result = JSON.parse(e.result);
        	Ti.API.trace('global.js getSthFromFb(' + key + ', ' + callback + ') set ' + result[key]);
			Ti.App.Properties.setString(key, result[key]);
			callback();
        } else if (e.error) {
            alert(e.error);
        } else {
            alert('Unknown response');
        }
    });	
};