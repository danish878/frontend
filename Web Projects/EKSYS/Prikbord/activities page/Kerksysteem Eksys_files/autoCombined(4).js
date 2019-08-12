function adminFrontEnd (options) {
    var contextMenu, popup;
    var self = this;
    this.init = function () {
        for (var i = 0; i < options.length; i++) {
            if (typeof(options[i].el) === "string") {
                options[i].el = document.getElementById(options[i].el);
            }
        }
		
        contextMenu = element(document.body, "ul");
        contextMenu.id = 'contextMenu';
		
        var overlay = element(document.body, "div");
        overlay.id = "systemOverlay";
		
        var popup = element(document.body, "div");
        popup.id = 'systemPopup';
		
        var top = element(popup, "div");
		top.className = 'top';
		
        var title = element(top, "div");
        title.className = 'title';
			
        var exit = element(top, "a");
        exit.className = 'exit';
        exit.href = '#';
        exit.innerHTML = '&nbsp;';
		
		var line = element(top, "div");
        line.className = 'line';
			
		var content = element(popup, "div");
			content.className = 'contentHolder';
			
        var iframe = document.createElement("iframe");
        iframe.border = '0';
        iframe.frameBorder = '0';
        iframe.width = '100%';
        iframe.height = '352px';   
        iframe.scrolling = 'no';
        content.appendChild(iframe);
		
		var hasSavedData = false;
        var parentInterface = {
            "goBack": function (a) {
            	var oldPath = a[0];
                var action = getActiveAction();
                
                if (action !== false) {
                    if (oldPath === action.path) {
                        window.location = '#';
                    }
                }
            },
            "onSave": function () {
            	hasSavedData = true;
            }
        };
			
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
		
        // Listen to message from child window
        eventer(messageEvent, function(e) {
            var args = [];
			if (e.data.args !== undefined) {
                args = e.data.args;
            }
            
            if (e.data.method !== undefined) {
                if (parentInterface[e.data.method] !== undefined) {
                    func = parentInterface[e.data.method](args);
                }
            }
        }, false);
			
        var a = new Animator();
        a.addSubject(function (r) {
            var per = r * 100;
				
            setAlpha(overlay, per);
            setAlpha(popup, per);
				
            var display  = '';
				
            if (r === 0) {
                display = 'none';
                iframe.src = "about:blank";
            }
				
            overlay.style.display = display;
            popup.style.display = display;
        });
        a.jumpTo(0);
			
        var getActiveAction = function () {
            var action = events.urlChange.getUriSegment("action");
			
            if (action !== undefined) { 
                action = options[action];
				
                return action;
            }
            return false;
        };
        
        var urlCheck = function () {
            var action = getActiveAction();
            if (action !== false) {
            	clearContextMenu();
            	
            	var iframeDocument = (iframe.contentDocument || iframe.document);
            	
            	var path = encodeURIComponent(action.path);
            	iframeDocument.location = baseUrl + "admin?startPath=" + path + "#path=" + path;
            	
                title.innerHTML = action.label;
					
                a.seekTo(1);
            }
            else if (hasSavedData) {
            	window.location.reload(true);
            }
            else {
            	a.seekTo(0);
            }
        };
			
        document.body.oncontextmenu = function (e) {
            justStarted = true;
            e = (e || window.event);
            
            var tar = (e.srcElement || e.target);
			
            var contextOptions = { };
			
            var loop = tar;
            var loopTo = document.body.parentNode;
            while (loop !== loopTo) {
                for (var i = 0; i < options.length; i++) {
                    if (loop === options[i].el) {
                        contextOptions[i] = options[i];
                    }
                }
				
                loop = loop.parentNode;
            }
			
            contextMenu.innerHTML = '';
            var closure = function (i) {
                var li = element(contextMenu, "li");
				
                var a = element(li, "a");
                a.href= '#';
                a.innerHTML = options[i].label;
                a.onclick = function () {
                    events.urlChange.setUriSegments({
                        "action": 	i
                    });
                    return false;
                };
            };
			
            for (var i in contextOptions) {
                closure(i);
            }
			
            displayContextMenu(e.clientX, e.clientY);
            return false;
        };
		
        events.mouseUp.addEvent(mouseUp);
        clearContextMenu();
		
        events.urlChange.addEvent(urlCheck);
        urlCheck();
    };

    var displayContextMenu = function (x, y) {
    	contextMenu.style.display = '';
    	
    	var maxX = document.body.offsetWidth - contextMenu.offsetWidth;
    	var maxY = document.body.offsetHeight - contextMenu.offsetHeight;
    	
    	if (y > maxY) 
    		{ y = maxY; }
    	if (x > maxX)
    		{ x = maxX; }
    	
        contextMenu.style.left 	= x + "px";
        contextMenu.style.top 	= y + "px";
        
    };
    
    var justStarted = false;
    var clearContextMenu = function () {
        if (!justStarted) {
            contextMenu.style.display = 'none';
        }
        justStarted = false;
    };
	
    var mouseUp = function () {
        clearContextMenu();
    };
	
	
    this.init();
}