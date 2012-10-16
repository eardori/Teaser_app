Ti.include("./global.js");

var winMyPage = Titanium.UI.currentWindow;
winMyPage.orientationModes = [Titanium.UI.PORTRAIT];
winMyPage.backgroundColor = '#428cb9';

var tbInfo = Titanium.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: '#fff',
	backgroundDisabledColor: '#fff'
});
winMyPage.add(tbInfo);
setStatus(loginCheck(true)===false ? false : true);


function setStatus(IsLoggedIn)
{
	Ti.API.trace('global.js call setStatus(' + IsLoggedIn + ')');
	if (!IsLoggedIn) IsLoggedIn = Ti.Facebook.getLoggedIn();
	
	if (IsLoggedIn) {
		loadMyPage();
	} else {
		loadLoginBox();
	}
}

function loadLoginBox()
{
	Ti.API.trace('globel.js call loadLoginBox()');
	tbInfo.setData([]);
	
	var tbData = [];
	var section = Titanium.UI.createTableViewSection({headerTitle:'Basic Login'});
	var sectionRow = Ti.UI.createTableViewRow({
		color:'#000',
		backgroundColor:'#fff',
		height:100
	});
	var partner_id = Titanium.UI.createTextField({
		color: '#336699',
		width: 180,
		height: 40,
		top:10,
		left: 10,
		hintText: 'Login ID',
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		value: Ti.App.Properties.getString('account_username')
	});
	var partner_password = Titanium.UI.createTextField({
		color: '#336699',
		top: 55,
		left: 10,
		width: 180,
		height: 40,
		hintText: 'Password',
		passwordMask: true,
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		value: Ti.App.Properties.getString('account_password')
	});
	var btnLogin = Titanium.UI.createButton({
		top: 10,
		left: 200,
		width: 90,
		height: 85,
		title: 'Login',
		verticalAlign: 'right'
	});
	objectAdd(defButtonProperty, btnLogin);	
	btnLogin.font = {fontSize:16, fontFamily: 'Arial', fontWeight: 'bold'};
	btnLogin.addEventListener('click', function(e)
	{
		Ti.API.trace('winMyPage.js btnLogin click');
		if (partner_id.value != '' && partner_password.value != '')
		{
			partner_id.blur();
			partner_password.blur();
			if (saveLogin.value == false)
		    {
		        Ti.App.Properties.setString('account_username', '');
		        Ti.App.Properties.setString('account_password', '');
		    }
		    else
		    {
		        Ti.App.Properties.setString('account_username', partner_id.value);
		        Ti.App.Properties.setString('account_password', partner_password.value);
		    }
		    
		    var isFB = false;
		    tryLogin(isFB, partner_id.value, partner_password.value);
		}
		else Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('request_login_info')}).show();	
	});
	
	sectionRow.add(btnLogin);
	sectionRow.add(partner_id);
	sectionRow.add(partner_password);
	section.add(sectionRow);
	
	var sectionRow = Ti.UI.createTableViewRow({
		color:'#000',
		backgroundColor:'#fff',
		height:'auto'
	});
	var labelSave = Ti.UI.createLabel({
	    color:'#000',
		font:{fontFamily:'굴림', fontSize:15},
		text:'비밀번호 저장',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    left:10, top:0,
	    width:300, height:40				
	});
	sectionRow.add(labelSave);
	var saveLogin = Titanium.UI.createSwitch({
		top: 5,
		left: 220,
	    value: true
	});
	sectionRow.add(saveLogin);
	section.add(sectionRow);
	tbData.push(section);
	
	var section = Titanium.UI.createTableViewSection({headerTitle:'Facebook Login'});
	var sectionRow = Ti.UI.createTableViewRow({
		color:'#999',
		backgroundColor:'#fff',
		height:50
	});
	
	sectionRow.add(Ti.Facebook.createLoginButton({
	    top : 10,
	    left: 10,
	    style : Ti.Facebook.BUTTON_STYLE_WIDE
	}));
	section.add(sectionRow);
	tbData.push(section);
	tbInfo.setData(tbData);
}

function loadMyPage()
{
	Ti.API.trace('globel.js call loadMyPage()');
	var user = Ti.App.Properties.getObject('user');

	tbInfo.setData([]);
	var tbData = [];
	var section = Titanium.UI.createTableViewSection({headerTitle:'My Info'});

// Name Begin
	var sectionRow = Ti.UI.createTableViewRow({
		color:'#000',
		backgroundColor:'#fff',
		height:nTableHeight
	});	
	var labelName = Ti.UI.createLabel({
		text:'Name',
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:nSpliterSize,
		left:10
	});
	var labelNameValue = Ti.UI.createLabel({
		text:user.lastName + ' ' + user.firstName,
		height:'auto',
		font:{fontSize:defaultFontSize + 8, fontFamily:'Gochi Hand'},
		width:'auto',
		left:nSpliterSize + 10 + 5
	});	
	sectionRow.add(labelName);
	sectionRow.add(labelNameValue);
	section.add(sectionRow);
// Name End

// Gender and Age Begin
	var sectionRow = Ti.UI.createTableViewRow({
		height:nTableHeight,
		backgroundColor:cRowBackgroundColor,
		color:cRowTitleColor
	});
	var labelGender = Ti.UI.createLabel({
		text:'Gender',
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:nSpliterSize,
		left:10
	});
	var labelGenderValue = Ti.UI.createLabel({
		text:user.gender,
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:'auto',
		left:nSpliterSize + 10 + 5
	});
	var labelAge = Ti.UI.createLabel({
		text:'Age',
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:nSpliterSize,
		left:nSpliterSize + 5 + nSpliterSize
	});
	var age = '?';
	if (user.birthDay) {
		var thisYear = new Date().getFullYear();
		var birthYear = new Date(user.birthDay).getFullYear();
		age = thisYear - birthYear;
	}
	
	var labelAgeValue = Ti.UI.createLabel({
		text:age,
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:'auto',
		left:nSpliterSize + 5 + nSpliterSize + nSpliterSize + 5
	});
	sectionRow.add(labelAge);
	sectionRow.add(labelAgeValue);
	sectionRow.add(labelGender);
	sectionRow.add(labelGenderValue);	
	section.add(sectionRow);
// Gender and Age End

/*
// Friends Begin		
	var sectionRow = Ti.UI.createTableViewRow({
		height:nTableHeight,
		hasDetail:true,
		backgroundColor:cRowBackgroundColor,
		color:cRowTitleColor
	});		
	var labelFriends = Ti.UI.createLabel({
		text:'Friends',
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:nSpliterSize,
		left:10
	});
	var labelDetail = Ti.UI.createLabel({
		text:100,
		height:'auto',
		width:'auto',
		font:{fontSize:defaultFontSize},
		left:nSpliterSize + 10 + 5
	});	
	sectionRow.add(labelFriends);
	sectionRow.add(labelDetail);
	sectionRow.addEventListener('click', function()
	{
		var winLiked = Ti.UI.createWindow({
			title: 'Friends list',
			backButtonTitle: 'back',
			barColor: '#9dcee7',
			url:'./winLiked.js',
			navBarHidden:false,
			exitOnClose:true,
			idx:idx						
		});
		tabProfile.open(winLiked, {animated: true});
	});	
	section.add(sectionRow);
// Friends End

// Favorites Begin
	var sectionRow = Ti.UI.createTableViewRow({
		height:nTableHeight,
		hasDetail:true,
		backgroundColor:cRowBackgroundColor,
		color:cRowTitleColor
	});
	var labelFavorites = Ti.UI.createLabel({
		text:'Favorites',
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:nSpliterSize,
		left:10
	});
	var labelDetail = Ti.UI.createLabel({
		text:100,
		height:'auto',
		width:'auto',
		font:{fontSize:defaultFontSize},
		left:nSpliterSize + 10 + 5
	});	
	sectionRow.add(labelFavorites);
	sectionRow.add(labelDetail);
	sectionRow.addEventListener('click', function()
	{
		var winLiked = Ti.UI.createWindow({
			title: 'Favorite list',
			backButtonTitle: 'back',
			barColor: '#9dcee7',
			url:'./winLiked.js',
			navBarHidden:false,
			exitOnClose:true,
			idx:idx						
		});
		tabProfile.open(winLiked, {animated: true});
	});	
	section.add(sectionRow);
// Favorites End
*/

// City Begin
	var sectionRow = Ti.UI.createTableViewRow({
		color:'#000',
		backgroundColor:'#fff',
		height:nTableHeight
	});	
	var labelName = Ti.UI.createLabel({
		text:'City',
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:nSpliterSize,
		left:10
	});
	var labelValue = Ti.UI.createLabel({
		text:user.currentCity,
		height:'auto',
		font:{fontSize:defaultFontSize , fontFamily:'Arial'},
		width:'auto',
		left:nSpliterSize + 10 + 5
	});	
	sectionRow.add(labelName);
	sectionRow.add(labelValue);
	section.add(sectionRow);
// Current City End
	tbData.push(section);
	
// Interest Begin //		
	var section = Titanium.UI.createTableViewSection({headerTitle:'Interest'});
	var sectionRow = Ti.UI.createTableViewRow({
		height:'auto',
		backgroundColor:cRowBackgroundColor,
		color:cRowTitleColor
	});
	var arrayInterest = [];
	var rowInterest = [];
	var numOfCel = 5;
	if (!user.interests) user.interests = [];	
	for (var i = 0; i < user.interests.length; i++) 
	{
		var interest = {};
		interest.shortName = user.interests[i].name.length > 9 ? user.interests[i].name.substr(0,7) + '..' : user.interests[i].name;
		interest.fullName = user.interests[i].name;
		interest.category = user.interests[i].category;
		interest.index = i;
		arrayInterest.push(interest);
		if (i%5==0) {
			arrayInterest = [];
			rowInterest.push(arrayInterest);
		}
	}
	for (i=0; i<rowInterest.length;i++)
	{
		var btnInterest = Ti.UI.createButtonBar({
		    labels:getArrayFromObject(rowInterest[i], 'shortName'),
		    idx:getArrayFromObject(rowInterest[i], 'index'),
		    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		    font:{fontSize:6},
		    height:25,
		    width:'auto',  
		    top:i*27
		});
		btnInterest.addEventListener('click', function(e)
		{
			var selectedIndex = e.source.idx[e.index];
		});
		sectionRow.add(btnInterest);		
	}
	section.add(sectionRow);
	tbData.push(section);
// Interest End //		

// Login Begin
	var section = Titanium.UI.createTableViewSection({headerTitle:'Login Info'});
	var sectionRow = Ti.UI.createTableViewRow({
		color:'#000',
		backgroundColor:'#fff',
		height:nTableHeight
	});	
	var labelName = Ti.UI.createLabel({
		text:'Registered',
		height:'auto',
		font:{fontSize:defaultFontSize},
		width:nSpliterSize,
		left:10
	});
	var labelValue = Ti.UI.createLabel({
		text:new Date(),
		height:'auto',
		font:{fontSize:defaultFontSize , fontFamily:'Arial'},
		width:'auto',
		left:nSpliterSize + 10 + 5
	});	
	sectionRow.add(labelName);
	sectionRow.add(labelValue);
	var sectionRow = Ti.UI.createTableViewRow({
		color:'#000',
		backgroundColor:'#fff',
		height:nTableHeight
	});		
	sectionRow.add(Ti.Facebook.createLoginButton({
	    top : 10,
	    left: 10,
	    style : Ti.Facebook.BUTTON_STYLE_WIDE
	}));
	section.add(sectionRow);
	tbData.push(section);		
// Login End			
	tbInfo.setData(tbData);	
}

Ti.Facebook.addEventListener('login', function(e) {
    if (e.success) {
    	var isFB = true;
		tryLogin(isFB, null, null, setStatus, true);
    }
});
Ti.Facebook.addEventListener('logout', function(e) {
	setStatus(false);
	tryLogout();
});


// track page view on focus
winMyPage.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winMyPage');
});
