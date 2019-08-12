(
    function () {
        
        $(".autosubmit").each(function () {
        	var el = $(this);
        	var self = this;
        	
        	var timer = false;
        	var setTimer = function () {
        		if (timer !== false) {
        			window.clearTimeout(timer);
        			timer = false;
        		}
        		
        		timer = window.setTimeout(function () {
        			$(self.form).submit();
        		}, 500);
        	};
        	
        	el.keyup(function () {
        		setTimer();
        	});
        	
        	el.change(function () {
        		setTimer();
        	});
        });
    }()
);