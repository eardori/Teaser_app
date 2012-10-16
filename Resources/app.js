Ti.include("./global.js");
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
var tabGroup = Titanium.UI.createTabGroup();
Ti.App.customTabGroup = tabGroup;
//    	#3c9dd0
//		#9dcee7
//		#f9bf7a

var winPhoto = Titanium.UI.createWindow({
	url:'./winPhoto.js',
	navBarHidden:'true'
});
var tabPhoto = Titanium.UI.createTab({
	icon:'./images/tabPhoto.png',
	title:'Photo',
	height:'auto',
	width:'auto',
	window:winPhoto
});
	
var winToday = Titanium.UI.createWindow({
	url:'./winToday.js',  
    title:'Today English',
    navBarHidden: true,
    backgroundColor:'#3c9dd0'
});
var tabToday = Titanium.UI.createTab({  
    icon:'./images/tabToday.png',
    title:'Today English',
    height:'auto',
    width:'auto',
    window:winToday
});

var winMessage = Titanium.UI.createWindow({
	url:'./winMessageMain.js',
    title:'Message',
    backgroundColor:'#9dcee7'
});
var tabMessage = Titanium.UI.createTab({  
    icon:'./images/tabMessage.png',
    title:'Message',
    height:'auto',
    width:'auto',
    window:winMessage
});

var winMyPage = Titanium.UI.createWindow({  
    title:'MyPage',
    backgroundColor:'#f9bf7a',
	url: './winMyPage.js'    
});
var tabMyPage = Titanium.UI.createTab({  
    icon:'./images/tabMypage.png',
    title:'MyPage',
    height:'auto',
    width:'auto',
    window:winMyPage
});
//
//  add tabs
//
//tabGroup.addTab(tabTutors);
tabGroup.addTab(tabPhoto);
tabGroup.addTab(tabMessage); 
tabGroup.addTab(tabToday); 
tabGroup.addTab(tabMyPage); 

tryLogout();
//if (Ti.App.Properties.getBool('showNotice', true)){
// open tab group
tabGroup.open();



