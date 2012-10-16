Ti.include("./global.js");
var winProfile = Titanium.UI.currentWindow;
var tabProfile = Titanium.UI.currentTab;

var nPhotoSize = 80;
var nGap = 3;

winProfile.backgroundColor = '#cccccc';
winProfile.barColor = '#4782ab';

loadProfile(winProfile.idx);

function loadProfile(idx)
{
	Ti.API.trace('winProfil.js call loadProfile(' + idx + ')');
	var tmpEmail = loginCheck();
	if (tmpEmail===false) return;
	
	showIndicator("Loading...");
	var isLiked = false;
	var callbackReq = Titanium.Network.createHTTPClient();
	callbackReq.open("GET", txtBaseURL + "/m/user/" + idx + "/profile?email=" + tmpEmail);
	Ti.API.trace('httpOpen:' + txtBaseURL + "/m/user/" + idx + "/profile?email=" + tmpEmail);
	callbackReq.onload = function()
	{
		var callbackresponse = this.responseText;
		var data = JSON.parse(callbackresponse);
		var tutor = data.tutor;
		Ti.API.trace('return from Server : ' + JSON.stringify(tutor));
		var photoUrl = "";
		var left = 0;
		var top = 0;
	
		var hitToday = tutor.hitToday || 1;
		var hitTotal = tutor.hitTotal || 1;
		var labelHit = Ti.UI.createLabel({
			text:'Today : ' + hitToday + '\nTotal : ' + hitTotal,
			color:'#fff',
			font:{fontSize:14}
		});
		winProfile.rightNavButton = labelHit;	
		var dataProfile = [];
		var sectionContacts = Titanium.UI.createTableViewSection({headerTitle:'Contacts'});
		if (typeof(tutor.photos) !== 'undefined' && tutor.photos.length > 0)
		{
			var rowPhoto = Titanium.UI.createTableViewRow({
				height:'auto',
				backgroundColor:cRowBackgroundColor,
				color:cRowTitleColor
			});
			for(i=0;i<tutor.photos.length;i++)
			{
				left = (nPhotoSize + nGap) * (i % 4) + 3;
				top = (nPhotoSize + nGap) * parseInt(i / 4) + 10;			
				photoUrl = txtImageURL + tutor.photos[i].imageId + "/w/100/h/100";
				var imagePhoto = Ti.UI.createImageView({
					image:photoUrl,
					defaultImage:'./images/no_profile_img.gif',
					idx:tutor._id,
					count:i,
					tutor:tutor,
					left:left,
					top:top,
					width:nPhotoSize,
					height:nPhotoSize
				});
				rowPhoto.add(imagePhoto);
				imagePhoto.addEventListener("click", function(e)
				{
					var winSlideShow = Ti.UI.createWindow({
						url:'./winSlideShow.js',
						title: tutor.lastName + ' ' + tutor.firstName,
						backButtonTitle: 'back',
						tabBarHidden:true			
					});
					winSlideShow.idx = e.source.idx;
					winSlideShow.count = e.source.count;
					winSlideShow.tutor = e.source.tutor;
					tabProfile.open(winSlideShow, {animated: true});
				});
			}
			var matchProportion = calculateMatch(tutor.interests);
			var labelMatchTitle = Ti.UI.createLabel({
				text:'Match(%)', right:20, top:10
			});
			var labelMatchValue = Ti.UI.createLabel({
				text:matchProportion, right:25, top:25,
				font:{fontSize:60, fontFamily:'Gochi Hand', fontWeight:'bold'}
			});
			rowPhoto.add(labelMatchTitle);
			rowPhoto.add(labelMatchValue);
			sectionContacts.add(rowPhoto);
			
			var rowButtons = Ti.UI.createTableViewRow({
				height:nTableHeight,
				backgroundColor:cRowBackgroundColor,
				color:cRowTitleColor
			});
			if (typeof(tutor.myUser.favorites) === 'undefined') {
				isLiked = false;
			} else if (tutor.myUser.favorites[tutor._id] === true) {
				isLiked = true;
			} else {
				isLiked = false;
			}			
			var btnLike = Titanium.UI.createButton({
			   title: isLiked ? 'Unlike' : 'Like',
			   top: 10,
			   left:10,
			   width: 65,
			   height: 30,
			});
			objectAdd(defButtonProperty, btnLike);
			btnLike.addEventListener('click', function(e)
			{
//				btnLike.setEnabled(false);
				setFavorite(tutor._id, !isLiked, btnLike);
			});
			btnLike.addEventListener('onSuccess', function(e)
			{
				btnLike.setEnabled(true);
				isLiked != isLiked;
				btnLike.setTitle(isLiked ? 'Like' : 'Unlike');
			});
			btnLike.addEventListener('onFailure', function(e)
			{
				btnLike.setEnabled(true);
			});
			var btnSchedule = Titanium.UI.createButton({
			   title: 'Schedule',
			   top: 10,
			   left:150,
			   width: 65,
			   height: 30
			});
			btnSchedule.addEventListener('click', function(e)
			{
//				showCalendar();
				Ti.API.info(e);
			});
			objectAdd(defButtonProperty, btnSchedule);	
			var btnMessage = Titanium.UI.createButton({
			   title: 'Message',
			   top: 10,
			   left:80,
			   width: 65,
			   height: 30
			});
			btnMessage.addEventListener('click', function(e)
			{
				var winMessage = Titanium.UI.createWindow({
					title: tutor.firstName + ' ' + tutor.lastName,
					backButtonTitle: 'back',
					barColor: '#9dcee7',
					url: './winMessage.js'
				});
				winMessage.idx = winProfile.idx;
				Ti.App.customTabGroup.setActiveTab(1);				
				Ti.App.customTabGroup.tabs[1].open(winMessage, {animated: true});
//				tabMessageMain.open(winMessage, {animated: true});	
			});
			objectAdd(defButtonProperty, btnMessage);	
			// var btnTakeTalks = Titanium.UI.createButton({
			   // title: 'TakeTalks',
			   // top: 10,
			   // left:220,
			   // width: 65,
			   // height: 30
			// });
			// btnTakeTalks.addEventListener('click', function(e)
			// {
				// Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('under_construction')}).show();
			// });
			// objectAdd(defButton2Property, btnTakeTalks);
			
			rowButtons.add(btnLike);
			rowButtons.add(btnSchedule);
			rowButtons.add(btnMessage);
//			sectionRow.add(btnTakeTalks);
			sectionContacts.add(rowButtons);
		}
		dataProfile.push(section);	
		
		
		var sectionAbout = Titanium.UI.createTableViewSection({headerTitle:'About'});
		var labelLikedTitle = Ti.UI.createLabel({
			text:'Liked',
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:nSpliterSize,
			left:10
		});
		var labelLikedValue = Ti.UI.createLabel({
			text:tutor.likedCount,
			height:'auto',
			width:'auto',
			font:{fontSize:defaultFontSize},
			left:nSpliterSize + 10 + 5
		});	
		var rowLiked = Ti.UI.createTableViewRow({
			height:nTableHeight,
			hasDetail:true,
			foo:'Liked',
			backgroundColor:cRowBackgroundColor,
			color:cRowTitleColor
		});
		rowLiked.add(labelLikedTitle);
		rowLiked.add(labelLikedValue);
		sectionAbout.add(rowLiked);
		rowLiked.addEventListener('click', function()
		{
			var winLiked = Ti.UI.createWindow({
				title: 'Fan list',
				backButtonTitle: 'back',
				barColor: '#9dcee7',
				url:'./winLiked.js',
				navBarHidden:false,
				exitOnClose:true,
				idx:idx						
			});
			tabProfile.open(winLiked, {animated: true});
		});

		var labelGenderTitle = Ti.UI.createLabel({
			text:'Gender',
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:nSpliterSize,
			left:10
		});
		var labelGenderValue = Ti.UI.createLabel({
			text:tutor.gender,
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:'auto',
			left:nSpliterSize + 10 + 5
		});	
		var labelAgeTitle = Ti.UI.createLabel({
			text:'Age',
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:nSpliterSize,
			left:nSpliterSize + 5 + nSpliterSize
		});
		var age = '?';
		if (tutor.birthDay) {
			var thisYear = new Date().getFullYear();
			var birthYear = new Date(tutor.birthDay).getFullYear();
			age = thisYear - birthYear;
		}
		var labelAgeValue = Ti.UI.createLabel({
			text:age,
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:'auto',
			left:nSpliterSize + 5 + nSpliterSize + nSpliterSize + 5
		});
		var rowGenderAge = Ti.UI.createTableViewRow({
			height:nTableHeight,
			backgroundColor:cRowBackgroundColor,
			color:cRowTitleColor
		});
		rowGenderAge.add(labelGenderTitle);
		rowGenderAge.add(labelGenderValue);
		rowGenderAge.add(labelAgeTitle);
		rowGenderAge.add(labelAgeValue);
		sectionAbout.add(rowGenderAge);

		var labelJoinedTitle = Ti.UI.createLabel({
			text:'Joined',
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:nSpliterSize,
			left:10
		});
		var joined = tutor.applyDateTime.substr(0,10);
		var labelJoinedValue = Ti.UI.createLabel({
			text:joined,
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:'auto',
			left:nSpliterSize + 10 + 5
		});	
		var rowJoined = Ti.UI.createTableViewRow({
			height:nTableHeight,
			backgroundColor:cRowBackgroundColor,
			color:cRowTitleColor
		});
		rowJoined.add(labelJoinedTitle);
		rowJoined.add(labelJoinedValue);
		sectionAbout.add(rowJoined);
		dataProfile.push(sectionAbout);
		
		
		var sectionIntro = Titanium.UI.createTableViewSection({headerTitle:'Introduce'});
		var labelIntroTitle = Ti.UI.createLabel({
			text:tutor.intro,
			height:'auto',
			width:'auto',
			font:{fontSize:defaultFontSize, fontFamily:'Arial'},
			left:10, top:10
		});
		var rowIntro = Ti.UI.createTableViewRow({
			height:'auto',
			backgroundColor:cRowBackgroundColor,
			color:cRowTitleColor
		});
		rowIntro.add(labelIntroTitle);
		sectionIntro.add(rowIntro);
		dataProfile.push(sectionIntro);
		
		
		var sectionInterests = Titanium.UI.createTableViewSection({headerTitle:'Interest', footerTitle:'Touch interest to add on yours.'});
		var rowInterests = Ti.UI.createTableViewRow({
			height:'auto',
			backgroundColor:cRowBackgroundColor,
			color:cRowTitleColor
		});
		var arrayInterest = [];
		var rowInterest = [];
		var numOfCel = 5;		
		for (var i = 0; i < tutor.interests.length; i++) 
		{
			var interest = {};
			interest.shortName = tutor.interests[i].name.length > 9 ? tutor.interests[i].name.substr(0,7) + '..' : tutor.interests[i].name;
			interest.fullName = tutor.interests[i].name;
			interest.category = tutor.interests[i].category;
			interest.index = i;
			arrayInterest.push(interest);
			if (i%5==0) {
				var arrayInterest = new Array();
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
//				style:'',  
			    top:i*27
			});
			btnInterest.addEventListener('click', function(e)
			{
				var selectedIndex = e.source.idx[e.index];
				var confirmDialog = Ti.UI.createAlertDialog({
					cancel: 1,
					buttonNames: ['Yes', 'No'],
					title: 'TakeTalks', 
					message: String.format(L('add_interest'), tutor.interests[selectedIndex].name, tutor.interests[selectedIndex].category)
				});
				confirmDialog.addEventListener('click', function(e){
        			if (e.index !== e.source.cancel) {
        				addInterest(tutor.interests[selectedIndex].category, tutor.interests[selectedIndex].name);
        			}
        		});
        		confirmDialog.show();
			});
			rowInterests.add(btnInterest);		
		}
		sectionInterests.add(rowInterests);
		dataProfile.push(sectionInterests);
		
		
		var sectionRegion = Titanium.UI.createTableViewSection({headerTitle:'Region and Language'});
		var labelCityTitle = Ti.UI.createLabel({
			text:'City',
			height:'auto',
			font:{fontSize:defaultFontSize},
			width:nSpliterSize,
			left:10
		});
		var labelCityValue = Ti.UI.createLabel({
			text:tutor.currentCity,
			height:'auto',
			width:'auto',
			font:{fontSize:defaultFontSize},
			left:nSpliterSize + 10 + 5
		});	
		var rowCity = Ti.UI.createTableViewRow({
			height:nTableHeight,
			backgroundColor:cRowBackgroundColor,
			color:cRowTitleColor
		});
		rowCity.add(labelCityTitle);
		rowCity.add(labelCityValue);
		sectionRegion.add(rowCity);
	
		var labelLanguageTitle = Ti.UI.createLabel({
			text:'Hometown',
			font:{fontSize:defaultFontSize},			
			height:'auto',
			width:nSpliterSize,
			left:10
		});
		var labelLanguageValue = Ti.UI.createLabel({
			text:tutor.homeTown,
			height:'auto',
			width:'auto',
			font:{fontSize:defaultFontSize},
			left:nSpliterSize + 10 + 5
		});	
		var rowLanguage = Ti.UI.createTableViewRow({
			height:nTableHeight,
			backgroundColor:cRowBackgroundColor,
			color:cRowTitleColor,
			indentionLevel:3,
			horizontalWrap :false
		});
		rowLanguage.add(labelLanguageTitle);
		rowLanguage.add(labelLanguageValue);
		sectionRegion.add(rowLanguage);
		dataProfile.push(sectionRegion);
	
		
		var sectionEducation = Titanium.UI.createTableViewSection({headerTitle:'Education'});
		for (var i = 0; i < tutor.edus.length; i++) 
		{ 
			var edu = tutor.edus[i];
			
			var labelEducationTitle = Ti.UI.createLabel({
				text:edu.eduStartDate + '~' + edu.eduEndDate,
				height:'auto',
				width:nSpliterSize,
				font:{fontSize:defaultFontSize},
				left:10
			});
			var labelEducationValue = Ti.UI.createLabel({
				text:edu.eduName + ', ' + edu.eduMajor + ', ' + edu.eduDegree,		
				height:'auto',
				width:'auto',
				font:{fontSize:defaultFontSize},
				left:nSpliterSize + 10 + 5
			});
			var rowEducation = Ti.UI.createTableViewRow({
				height:'auto',
				backgroundColor:cRowBackgroundColor,
				color:cRowTitleColor
			});
			rowEducation.add(labelEducationTitle);
			rowEducation.add(labelEducationValue);
			sectionEducation.add(rowEducation);
		}
		dataProfile.push(sectionEducation);
		
		
		var sectionCareer = Titanium.UI.createTableViewSection({headerTitle:'Career'});
		for (var i = 0; i < tutor.works.length; i++) 
		{ 
			var work = tutor.works[i];
			
			var labelCareerTitle = Ti.UI.createLabel({
				text:work.workStartDate + '~' + work.workEndDate,
				height:'auto',
				width:nSpliterSize,
				font:{fontSize:defaultFontSize},
				left:10
			});
			var labelCareerValue = Ti.UI.createLabel({
				text:work.workPosition + ', ' + work.workName + ', ' + work.workResponsibilities,		
				height:'auto',
				width:'auto',
				font:{fontSize:defaultFontSize},
				left:nSpliterSize + 10 + 5
			});
			var rowCareer = Ti.UI.createTableViewRow({
				height:'auto',
				backgroundColor:cRowBackgroundColor,
				color:cRowTitleColor
			});
			rowCareer.add(labelCareerTitle);
			rowCareer.add(labelCareerValue);
			sectionCareer.add(rowCareer);
		}
		dataProfile.push(sectionCareer);
		
	
		var tbInfo = Titanium.UI.createTableView({
			data:dataProfile,
			style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundColor: '#cccccc',
			backgroundDisabledColor: '#ffffff'
		});

		hideIndicator(500);
		winProfile.add(tbInfo);
	}
	
	callbackReq.onerror = function()
	{
		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('bad_connection')}).show();
		hideIndicator(500);
	}
	callbackReq.send();
}



// track page view on focus
winProfile.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winProfile');
});
