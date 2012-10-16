Ti.include("./global.js");
var winSlideShow = Titanium.UI.currentWindow;
var tabSlideShow = Titanium.UI.currentTab;

var nav_hidden = true;
loadPhotos(winSlideShow.tutor);
var nav_hidden = true;
 

function loadPhotos(tutor)
{
	showIndicator("Loading...");
	var photoUrl = '';
	if (typeof(tutor.photos) != 'undefined' && tutor.photos.length > 0) {
		photoUrl = txtImageURL + tutor.photos[0].imageId + '/w/640/h/960';
	}			
	else {
		photoUrl = '/images/no_profile_img.gif';
	}
	var imageAvatar = Ti.UI.createImageView({
	    image: photoUrl,
	    defaultImage:'./images/dot.gif',
	    left:0, top:0,
	    width:'auto', 
	    height:'auto',
	    canScale: true,
	    enableZoomControls: true
	    
	});
	imageAvatar.addEventListener('load', function(e)
	{
		hideIndicator(500);
	});
	imageAvatar.addEventListener('click', function() {
		Ti.API.info(winSlideShow.getNavBarHidden());
		nav_hidden = !nav_hidden;
    	winSlideShow.setNavBarHidden(nav_hidden);
	});
	winSlideShow.add(imageAvatar);
}

// track page view on focus
winSlideShow.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winSlideShow');
});