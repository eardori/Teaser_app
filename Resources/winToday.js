Ti.include("./global.js");
var winToday = Titanium.UI.currentWindow;
var tabToday = Titanium.UI.currentTab;
winToday.barColor = '#4782ab';

	
var viewWeb = Ti.UI.createWebView();
winToday.add(viewWeb);

var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var btnNext = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FAST_FORWARD
});
btnNext.addEventListener('click', function()
{
	if (index <= 0) {
		Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('latest_data')}).show();
	} else {
		getTodayEnglish(--index, viewWeb);
	}
});
var btnPrev = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.REWIND
});
btnPrev.addEventListener('click', function()
{
	getTodayEnglish(++index, viewWeb);
})

var today = new Date();
today = today.toString().substr(0,10);
var labelToday = Ti.UI.createLabel({
	text:today,
	color:'#fff',
	width:'auto'
});
winToday.toolbar = [btnPrev,flexSpace,labelToday,flexSpace,btnNext];

var index = 0;
getTodayEnglish(index, viewWeb);




function getTodayEnglish(idx, webView)
{
	Ti.API.info('Get ' + idx + ' th article..');
	showIndicator("Loading...");
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET",txtBaseBlogURL + "/rss/xml");
	xhr.onload = function() {
		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName("item");
		var htmlOutput = '';
		var count = 0;
		var isFound = false;
		for (i=0;i<items.length;i++)
		{
			var item = items.item(i);
			var title = item.getElementsByTagName("title").item(0).text;
			if (title.indexOf("[Today]") >= 0) {
				if (count===idx) {
					isFound = true;
					var mURL = item.getElementsByTagName('guid').item(0).text;
					var content = item.getElementsByTagName('description').item(0).text;
					var pubDate = item.getElementsByTagName('pubDate').item(0).text;
					guid = mURL.substr(mURL.lastIndexOf("/") + 1);
					
					pubDate = new Date(pubDate);
					labelToday.text = String.formatDate(pubDate);

					hideIndicator(500);
					return printArticle(guid, title, webView);
					break;
				} else {
					count++;
				}
			}
		}
		if (!isFound) {
			index--;
			Ti.UI.createAlertDialog({title: 'TakeTalks', message: L('first_data')}).show();
		}
		hideIndicator(500);
	};
	xhr.onerror = function () {
		hideIndicator(500);
	}
	xhr.send();
};	

//						/m/post/getImage/?f=cfile29.uf%40 ' &size=480 '

		
		
function printArticle(guid, title, webView)
{
	Ti.API.info(txtBaseBlogURL + "/m/post/view/id/" + guid);
	showIndicator('Loading contents..');
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET",txtBaseBlogURL + "/m/post/view/id/" + guid);
	xhr.onload = function() {
			var response = this.responseText;
			var start = response.indexOf("<!-- 글 내용시작 -->");
			var end = response.lastIndexOf("area_comment");
			var htmlContents = response.substring(start - 2, end - 13);
			var replaceText = "<img src=\"/";
			var regex = new RegExp(replaceText, 'g');

			htmlContents = htmlContents.replace(/img src=\"/g,'img src=\"' + txtBaseBlogURL);			
			htmlOutput = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\" lang=\"ko\" xml:lang=\"ko\">\
			<head>\
			<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\
			<meta name=\"viewport\" content=\"user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width\" /><link href=\"http://m1.daumcdn.net/cfs.tistory/blog/style/mobile/common_h.css?v=29181\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />\
			<link href=\"http://m1.daumcdn.net/cfs.tistory/blog/style/mobile/skin/skin_default/style_h.css?v=29181\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" /><script type=\"text/javascript\" src=\"http://m1.daumcdn.net/cfs.tistory/blog/script/mobile/ti_common_ipn.js?v=29181\"></script>\
			<script type=\"text/javascript\" src=\"http://m1.daumcdn.net/cfs.tistory/blog/script/mobile/jigu-mobile-latest.min.js?v=29181\"></script>\
			<script type=\"text/javascript\" src=\"http://dmaps.daum.net/map_js_init/v3.js\"></script>\
			<script type=\"text/javascript\" src=\"http://m1.daumcdn.net/cfs.tistory/blog/script/mobile/transCoordinator.js?v=29181\"></script><title>" + title + "</title><style type=\"text/css\">\
					#daumHead {\
						background-image: url(http://cfile21.uf.tistory.com/R320x0/163CCA3E4D6B43B92EA858);\
						-moz-background-size: 320px auto;\
						background-size: 320px auto;\
						-webkit-background-size: 320px auto;\
					}\
					#daumHead { background-color: #434655 !important; }\
					#daumHead h1 a { color: #ffffff; }\
					#header { height: 40px; }\
					#header h1 a { line-height: 40px; }\
					#menu .blog_menu { background: #eeece5 !important; }\
					.em_color { color: #8a8a8a !important; }\
					.em_color_bg { background: none !important; background-color: #8a8a8a !important; }\
					.em_color_bd { border-color: #8a8a8a !important; }\
			</style>\
			</head>\
			<body>\
			<div id=\"daumWrap\" class=\"webkit \">\
				<div id=\"daumHead\" class=\"has_sub\">\
					<div id=\"header\">\
						<h1><a href=\"/m\" id=\"blogTitle\">" + title + "</a></h1>\
					</div>\
				</div>\
				<div id=\"daumContent\" class=\"viewer\">\
					<div class=\"wrap_posting\">\
						<div class=\"area_content\">" + htmlContents + "</div>\
					</div>\
				</div>\
			</div>\
			</body>\
			</html>";
			webView.setHtml(htmlOutput);
			hideIndicator(500);
	};
	xhr.onerror = function() {
		hideIndicator(500);
	}
	xhr.send();
};		
		

// track page view on focus
winToday.addEventListener('focus', function(e){
	Titanium.App.Analytics.trackPageview('/winToday');
});
