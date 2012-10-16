Ti.include("./global.js");
var winPhoto = Titanium.UI.currentWindow;
var tabPhoto = Titanium.UI.currentTab;
var nPhotoSize = 95;
var nGap = 5;
var nLabelHeight = 12;

winPhoto.backgroundColor = '#428cb9';
var scrollView = Titanium.UI.createScrollableView({
	showPagingControl:true,
	disableBounce:true,
	pagingControlHeight:20,
//	maxZoomScale:2.0,
	currentPage:0,
//	cacheSize:1,
//	clipViews:false
});

var btnObjects = [
	{title:'New'},
	{title:'Hot ♂'},
	{title:'Hot ♀'},
	{title:'Elite'},
	{title:'Bili'},
	{title:'Pro'},
	{title:'Liked'}
];
var btnBar = Titanium.UI.createTabbedBar({
	labels:btnObjects,
	backgroundColor:'#ff7e00',
	top:5,
	style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	height:25,
	width:310,
	index: 1,
	zIndex:1
});

btnBar.addEventListener('click', function(e)
{
	var condition = '';
	switch (e.index) {
		case 0:
			condition = 'isNew';
			break;
		case 1:
			condition = 'isHotM';
			break;
		case 2:
			condition = 'isHotF';
			break;
		case 3:
			condition = 'isElite';
			break;
		case 4:
			condition = 'isBilingual';
			break;
		case 5:
			condition = 'isPro';
			break;
		case 6:
			condition = 'isMine';
			break;
	}
	loadPhotos(condition);
});

winPhoto.add(btnBar);

startApp();

function startApp()
{
	Ti.API.trace('winPhoto.js call startApp()');
	analytics.start(10);
	fbLoginCheck(loadPhotos);
}
function loadPhotos(condition)
{
	Ti.API.trace('winPhoto.js loadPhotos(' + condition + ')');
	
	var tmpEmail = loginCheck(true);
//	if (tmpEmail===false) return;
	
	var keyword = condition || 'isHotM';
	scrollView.setViews([]);
	showIndicator("Loading...");	
	var callbackReq = Titanium.Network.createHTTPClient();
	callbackReq.open("GET", txtBaseURL + "/m/search/tutor/list/" + keyword + "?email=" + tmpEmail);
	Ti.API.trace('httpOpen:' + txtBaseURL + "/m/search/tutor/list/" + keyword + "?email=" + tmpEmail);
	callbackReq.onload = function()
	{
		var callbackresponse = this.responseText;
		var data = JSON.parse(callbackresponse);

		var items = [];
		var views = [];

		var tutors = condition==='isMine' ? data.list : data.tutors;
		var cnt = 0;
		var index = -1;
		var left = 0;
		var top = 0;
		for(i=0;i<tutors.length;i++)
		{
			var tutor = condition==='isMine' ? tutors[i].toUser : tutors[i];
			if (cnt%9==0)
			{
				cnt = 0;
				index++;			
				var view = Ti.UI.createView({
					backgroundColor:'#428cb9'
				});
				views.push(view);
				
			}
			var photoUrl = './images/no_profile_img.gif';
			if (typeof(tutor.photos) != 'undefined' && tutor.photos.length > 0) {
				photoUrl = txtImageURL + tutor.photos[0].imageId + '/w/105/h/105';
			}
			left = (nPhotoSize + nGap) * (cnt % 3) + 10;
			top = (nPhotoSize + nGap + nLabelHeight) * parseInt(cnt / 3) + 40;
			var image = Ti.UI.createImageView({
			    image:photoUrl,
			    defaultImage:'./images/no_profile_img.gif',
			    left:left, top:top,
				idx:tutor._id,
				name:tutor.firstName + ' ' + tutor.lastName,			    
			    width:nPhotoSize, height:nPhotoSize
			});
			
			// New 이미지
			var newDate = new Date(Date.now() - 60 * 60 * 24 * 7 * 1000);
			var segmentDate = new Date(tutor.segmentDate);
			if (segmentDate > newDate) {
				var imageNew = Ti.UI.createImageView({
					image:'./images/new.png',
					left:left+3, top:top-5,
					width:25,
					zIndex:1
				});
				views[index].add(imageNew);
			}
			// New 이미지
			
			// Like 이미지
			var isLiked = false;
			if (isLiked) {
				var imageLike = Ti.UI.createImageView({
					image:'./images/ic_tlt_01.png',
					left:nPhotoSize-3-40, top:top,
					zIndex:1
				});
				views[index].add(imageNew);
			}
			// Like 이미지
			
			var label = Ti.UI.createLabel({
				backgroundColor:'#222222',
			    color:'#fff',
				font:{fontFamily:'Gochi Hand', fontSize:10, fontWeight:'bold'},
				text:tutor.firstName + ' ' + tutor.lastName,
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			    left:left, top:top+nPhotoSize,
			    width:nPhotoSize, height:nLabelHeight				
			});
			
			image.addEventListener('singletap', function(e)
			{
				var tmpEmail = loginCheck();
				if (tmpEmail===false) return;
				
				var winProfile = Titanium.UI.createWindow({
					title: e.source.name,
					backButtonTitle: 'back',
					barColor: '#9dcee7',
					url: './winProfile.js',
					navBarHidden:false
				});
				winProfile.idx = e.source.idx;
				tabPhoto.open(winProfile, {animated: true});
		
			});
			views[index].add(image);
			views[index].add(label);
			cnt++;
		}
		scrollView.setViews(views);
		scrollView.setCurrentPage(0);
		hideIndicator(500);
	}
	callbackReq.onerror = function()
	{
		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('bad_connection')}).show();
		hideIndicator(500);
	}
	callbackReq.send();				
}

winPhoto.add(scrollView);


// track page view on focus
winPhoto.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winPhoto');
});