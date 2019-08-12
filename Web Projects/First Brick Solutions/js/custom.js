			// Script for border bottom when scrolling down the page.
var nav = $('#navigation').offset().top + 70;
			
			$(document).scroll(function(){
				if($(this).scrollTop() > nav )
				{
					$('#navigation').css({
						'box-shadow' : '0 0 3px 0 rgba(0,0,0,0.33)'
					})
				}
				else
				{
					$('#navigation').css({
						'box-shadow' : 'none'
					})
				}
			})
			
// ==================================================================================

			// Mix it up Script
$(function(){
		    // Instantiate MixItUp:
		    $('#Container').mixItUp();
		
		});
		
// ==================================================================================