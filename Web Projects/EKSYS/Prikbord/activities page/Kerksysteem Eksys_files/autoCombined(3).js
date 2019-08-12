function audioPlayer(player, audio,playername,seekbarname) {
	var playpause;
	var seekBar;
	var seekBack;
	var seekForward;
	var seekInterval = 15; //number of seconds to seek forward or back
	var timer;
	var currentTimeContainer;
	var currentTime;
	var duration;
	var durationContainer;
	var muteButton;
	var volume=0.5; //0 to 1
	var hasSlider;
	
	
	function init() {
		//add controls to #controls div using Javascript 
		//but only for browsers that support <audio> 
		if (audio.canPlayType) { //this browser suports HTML5 audio
		
			
			//audio.setAttribute('onvolumechange','updateVolumeControl()'); //not used
		 
			playpause = document.createElement('input');
			playpause.setAttribute('type','button');
			playpause.setAttribute('id','playpause');
			playpause.setAttribute('value','');
			playpause.setAttribute('title','Play');
			playpause.setAttribute('onclick','playAudio("'+playername+'")');
			playpause.setAttribute('accesskey','P');
			player.appendChild(playpause);
	
			seekBar = document.createElement('input');
			seekBar.setAttribute('type','range');
			seekBar.setAttribute('id',seekbarname);
			seekBar.setAttribute('value','0'); //???
			seekBar.setAttribute('step','any');
			seekBar.setAttribute('ondurationchange','setupSeekBar('+seekbarname+')');
			seekBar.setAttribute('onchange','seekAudio(this,"'+playername+'","'+seekbarname+'")');
			player.appendChild(seekBar);
			
			audio.setAttribute('ontimeupdate','updateSeekBar("'+seekbarname+'","'+playername+'")');
	
			if (seekBar.type !== 'text') { 
				//if browser doesn't support type="range" (i.e., Firefox), it will render as type="text"
				hasSlider = true;
			}
			else { 
				//input type="text" is ugly and not very usable on the controller bar. Remove it.  
				player.removeChild(seekBar); //seekBar.style.display='none'; 
			}
			//Now add rewind and fast forward buttons  
			//These will be hidden from users who have sliders, but visible to users who don't
			//We still want them, even if hidden, so users can benefit from their accesskeys
			seekBack = document.createElement('input');
			seekBack.setAttribute('type','button');
			seekBack.setAttribute('id','seekBack');
			seekBack.setAttribute('value','');
			seekBack.setAttribute('title','Rewind ' + seekInterval + ' seconds');
			seekBack.setAttribute('onclick','seekAudio(this,'+playername+',i)');
			seekBack.setAttribute('accesskey','R');
			player.appendChild(seekBack);
			seekForward = document.createElement('input');
			seekForward.setAttribute('type','button');
			seekForward.setAttribute('id','seekForward');
			seekForward.setAttribute('value','');
			seekForward.setAttribute('title','Forward ' + seekInterval + ' seconds');
			seekForward.setAttribute('onclick','seekAudio(this,'+playername+',i)');
			seekForward.setAttribute('accesskey','F');
			player.appendChild(seekForward);
			if (hasSlider == true) { 
				//Note: all major browsers support accesskey on elements hidden with visibility:hidden
				seekBack.style.visibility='hidden';
				seekForward.style.visibility='hidden';
			}
			timer = document.createElement('span');
			timer.setAttribute('id','timer');		
			currentTimeContainer = document.createElement('span');
			currentTimeContainer.setAttribute('id','currentTime');
			var startTime = document.createTextNode('0:00');
			currentTimeContainer.appendChild(startTime);
		
			durationContainer = document.createElement('span');
			durationContainer.setAttribute('id','duration');
			timer.appendChild(currentTimeContainer);
			timer.appendChild(durationContainer);
			player.appendChild(timer);
	
			muteButton = document.createElement('input');
			muteButton.setAttribute('type','button');
			muteButton.setAttribute('id','muteButton');
			muteButton.setAttribute('value','');
			muteButton.setAttribute('title','Mute');		
			muteButton.setAttribute('onclick','toggleMute()');
			muteButton.setAttribute('accesskey','M');
			player.appendChild(muteButton);
	
			volumeUp = document.createElement('input');
			volumeUp.setAttribute('type','button');
			volumeUp.setAttribute('id','volumeUp');
			volumeUp.setAttribute('value','');
			volumeUp.setAttribute('title','Volume Up');		
			volumeUp.setAttribute('onclick',"updateVolume('up')");
			volumeUp.setAttribute('accesskey','U');
			player.appendChild(volumeUp);
	
			volumeDown = document.createElement('input');
			volumeDown.setAttribute('type','button');
			volumeDown.setAttribute('id','volumeDown');
			volumeDown.setAttribute('value','');
			volumeDown.setAttribute('title','Volume Down');		
			volumeDown.setAttribute('onclick',"updateVolume('down')");
			volumeDown.setAttribute('accesskey','D');
			player.appendChild(volumeDown);
			
			//get and set default values 
			audio.volume = volume;
			
			duration = Math.floor(audio.duration);
			
			if (isNaN(duration)) { 
				audio.addEventListener('loadedmetadata',function (e) { 
					duration = audio.duration;
					showTime(duration,durationContainer,hasSlider);
					seekBar.setAttribute('min',0);
					seekBar.setAttribute('max',duration);
				},false);
			}
			else { 
				showTime(duration,durationContainer,hasSlider);
				seekBar.setAttribute('min',0);
				seekBar.setAttribute('max',duration);
			}
		}
		else { 
			player.style.display='none';
		}	
	}
	function setupSeekBar() { 
		seekBar.max = video.duration;
	}
	function toggleMute() { 
		if (audio.muted) { 
			audio.muted = false; //unmute the volume
			muteButton.setAttribute('title','Mute');
			audio.volume = volume;
			//volumeControl.value = volume; //not used
			//muteButton.style.backgroundImage="url('images/audio_volume.gif')";
		}
		else { 
			audio.muted = true; //mute the volume
			muteButton.setAttribute('title','UnMute');
			//don't update var volume. Keep it at previous level 
			//so we can return to it on unmute
			//muteButton.style.backgroundImage="url('images/audio_mute.gif')";
		}
	}
	function showVolume() { 
		//not used...
		//triggered when #muteButton or #volumeControl receives focus 
		volumeControl.style.display="block";
		volumeIsVisible = true;
		muteHasFocus = true;
		//volume doesn't have focus yet, but we'll say it does 
		//this will keep it visible so user can tab to it if needed
		//If it's hidden when mute button loses focus, there's nothing for user to tab to
		volumeHasFocus = true;
	}
	function hideVolume() { 
		//not used...
		//triggered when #muteButton or #volumeControl loses focus
		muteHasFocus = false;
		if (volumeHasFocus == false && muteHasFocus == false) { 
			volumeControl.style.display="none";
			volumeIsVisible = false;
		}
	}
	function setVolumeFocus() { 
		//not used...
		//user has moused over or tabbed to volumeControl
		volumeHasFocus = true;
		if (!volumeIsVisible) { 
			showVolume();
		}
	}
	function unsetVolumeFocus() {
		//not used...
		//user has moused or tabbed away from volumeControl
		volumeHasFocus = false;
		hideVolume();
	}
	function updateVolume(direction) {
		//volume is a range between 0 and 1
		if (direction == 'up') { 
			if (volume < 0.9) volume = (volume + 0.1);
			else volume = 1;
		}
		else { //direction is down
			if (volume > 0.1) volume = (volume - 0.1);
			else volume = 0;
		}
		audio.volume = volume;
		/* 
		//volumeControl not used
		audio.volume = volumeControl.value;
		volume = volumeControl.value;
		*/
	}
	function updateVolumeControl() { 
		//not used...
		volumeControl.value = audio.volume;
	}
	init();
}

function playAudio(audio) { 
	var audio = document.getElementById(audio);
	if (audio.paused || audio.ended) { 
		audio.play();
		playpause.setAttribute('title','Pause');
		//playpause.style.backgroundImage="url('images/audio_pause.gif')";
	}
	else { 
		audio.pause();
		playpause.setAttribute('title','Play');
		//playpause.style.backgroundImage="url('images/audio_play.gif')";
	}
}

function showTime(time,elem,hasSlider) { 
	var minutes = Math.floor(time/60);  
	var seconds = Math.floor(time % 60); 
	if (seconds < 10) seconds = '0' + seconds;
	var output = minutes + ':' + seconds; 
	/*if (elem == currentTimeContainer) elem.innerHTML = output;
	else elem.innerHTML = ' / ' + output;*/
}

function updateSeekBar(seekbar, audio) { 
	//if browser displays input[type=range] as a slider, increment it
	var seekBar = document.getElementById(seekbar);
	var audio = document.getElementById(audio);
	if (seekBar.type !== 'text') { 
		seekBar.value = audio.currentTime;
	}
	hasSlider = true;
	//also increment counter 
	showTime(audio.currentTime,false,hasSlider);
}

function seekAudio(element, audio, seekbar) {
		//element is either seekBar, seekForward, or seekBack
	var seekBar = document.getElementById(seekbar);
	var audio = document.getElementById(audio);
	if (element == seekBar) { 
		var targetTime = element.value;
		if (targetTime < duration) audio.currentTime = targetTime;
	}
	else if (element == seekForward) { 
		var targetTime = audio.currentTime + seekInterval;
		if (targetTime < duration) audio.currentTime = targetTime;
		else audio.currentTime = duration;
	}
	else if (element == seekBack) { 
		var targetTime = audio.currentTime - seekInterval;
		if (targetTime > 0) audio.currentTime = targetTime;
		else audio.currentTime = 0;
	}
}

function getElementsByClassName(node, classname) {
    var a = [];
    var re = new RegExp('(^| )'+classname+'( |$)');
    var els = node.getElementsByTagName("*");
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
}

(new function() {
	var controls  = getElementsByClassName(document.body,'controls');
	var players  = getElementsByClassName(document.body,'player');
	
	for(var i=0; i<controls.length; i++) {
		new window.audioPlayer(controls[i], players[i],'player'+(i+1),('seekBar'+(i+1)));	
	}
});

;(function ($, window, undefined) {
    // outside the scope of the jQuery plugin to
    // keep track of all dropdowns
    var $allDropdowns = $();

    // if instantlyCloseOthers is true, then it will instantly
    // shut other nav items when a new one is hovered over
    $.fn.dropdownHover = function (options) {
        // don't do anything if touch is supported
        // (plugin causes some issues on mobile)
        if('ontouchstart' in document) return this; // don't want to affect chaining

        // the element we really care about
        // is the dropdown-toggle's parent
        $allDropdowns = $allDropdowns.add(this.parent());

        return this.each(function () {
            var $this = $(this),
                $parent = $this.parent(),
                defaults = {
                    delay: 500,
                    hoverDelay: 0,
                    instantlyCloseOthers: true
                },
                data = {
                    delay: $(this).data('delay'),
                    hoverDelay: $(this).data('hover-delay'),
                    instantlyCloseOthers: $(this).data('close-others')
                },
                showEvent   = 'show.bs.dropdown',
                hideEvent   = 'hide.bs.dropdown',
                // shownEvent  = 'shown.bs.dropdown',
                // hiddenEvent = 'hidden.bs.dropdown',
                settings = $.extend(true, {}, defaults, options, data),
                timeout, timeoutHover;

            $parent.hover(function (event) {
                // so a neighbor can't open the dropdown
                if(!$parent.hasClass('open') && !$this.is(event.target)) {
                    // stop this event, stop executing any code
                    // in this callback but continue to propagate
                    return true;
                }

                openDropdown(event);
            }, function () {
                // clear timer for hover event
                window.clearTimeout(timeoutHover)
                timeout = window.setTimeout(function () {
                    $this.attr('aria-expanded', 'false');
                    $parent.removeClass('open');
                    $this.trigger(hideEvent);
                }, settings.delay);
            });

            // this helps with button groups!
            $this.hover(function (event) {
                // this helps prevent a double event from firing.
                // see https://github.com/CWSpear/bootstrap-hover-dropdown/issues/55
                if(!$parent.hasClass('open') && !$parent.is(event.target)) {
                    // stop this event, stop executing any code
                    // in this callback but continue to propagate
                    return true;
                }

                openDropdown(event);
            });

            // handle submenus
            $parent.find('.dropdown-submenu').each(function (){
                var $this = $(this);
                var subTimeout;
                $this.hover(function () {
                    window.clearTimeout(subTimeout);
                    $this.children('.dropdown-menu').show();
                    // always close submenu siblings instantly
                    $this.siblings().children('.dropdown-menu').hide();
                }, function () {
                    var $submenu = $this.children('.dropdown-menu');
                    subTimeout = window.setTimeout(function () {
                        $submenu.hide();
                    }, settings.delay);
                });
            });

            function openDropdown(event) {
                // clear dropdown timeout here so it doesnt close before it should
                window.clearTimeout(timeout);
                // restart hover timer
                window.clearTimeout(timeoutHover);
                
                // delay for hover event.  
                timeoutHover = window.setTimeout(function () {
                    $allDropdowns.find(':focus').blur();

                    if(settings.instantlyCloseOthers === true)
                        $allDropdowns.removeClass('open');
                    
                    // clear timer for hover event
                    window.clearTimeout(timeoutHover);
                    $this.attr('aria-expanded', 'true');
                    $parent.addClass('open');
                    $this.trigger(showEvent);
                }, settings.hoverDelay);
            }
        });
    }; 

    $(document).ready(function () {
        // apply dropdownHover to all elements with the data-hover="dropdown" attribute
        $('[data-hover="dropdown"]').dropdownHover();
    });
})(jQuery, window);