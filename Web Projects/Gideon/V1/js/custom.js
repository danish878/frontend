$(window).scroll(function(){
    var scrollValue = $(this).scrollTop(); 
    if( scrollValue >= 17) {
        $(".logo").css('display',"none");
        $(".smallLogo .smallLogo1").css('display',"block");
        $(".gradient").addClass("gradientBackground");
    }
    else{
        $(".logo").css('display',"block");
        $(".smallLogo .smallLogo1").css('display',"none");
        $(".gradient").removeClass("gradientBackground");
    }
}); 
    
$( ".autosubmit" ).keyup(function() {
    if( $(".autosubmit").val().length > 0 ){
        $( ".searchResult" ).show();
        $( ".search" ).css('z-index',"2010");
        $( ".fullOverlay" ).show();
    }
    else{
        $( ".searchResult" ).hide();
        $( ".fullOverlay" ).hide();
        $( ".search" ).css('z-index',"1000");
    }
});

$( ".fullOverlay" ).click(function() {
    $( ".searchResult" ).hide();
    $( ".fullOverlay" ).hide();
    $( ".search" ).css('z-index',"1000");   
});

$( ".categoryBtn" ).click(function() {
    $( ".sideBar" ).toggle();
    return false; 
});

$( ".categories ul li" ).hover(function() {
    var index = $(".categories ul li").index(this);
    
    $('.categories ul li:nth-child(n)').css('width',"100%");
    $('.categories ul li:first-child').css('border-top',"none");
    $('.categories ul li:last-child').css('border',"none");

    if(index == 0){
        $('.categories ul li:nth-child(' + (index+1) + ')').css(
            {"width":"260px", "border-bottom":"1px solid #DDD", "border-top":"1px solid #DDD"}
        );
    }
    else{
        $('.categories ul li:nth-child(' + index + ')').css({"width":"270px", "border-bottom":"1px solid #DDD"});
        $('.categories ul li:nth-child(' + (index+1) + ')').css({"width":"270px", "border-bottom":"1px solid #DDD"});    
    }


    if (!$(this).hasClass("active")) {                    
        $("li.active").removeClass("active");
        $(".patch").remove();
        $(this).addClass("active");

        $('.categories ul li:nth-child(' + (index+1) + ') .submenu').css({top: -19, left: 258});
        $('.categories ul li:nth-child(' + (index+1) + ') .submenu').addClass("showDiv");
        $('.categories').css('z-index',"2010");
        $('.fullOverlay').show();
        $(this).append('<div class="patch"></div>');
      }
    else{
        $(this).removeClass("active");
        $('.patch').remove();
        $('.categories ul li:first-child').css('border-top',"none");
        $('.categories ul li:last-child').css('border',"none");
        $('.categories ul li:nth-child(n)').css('width',"100%");
        $('.categories ul li:nth-child(' + (index+1) + ') .submenu').removeClass("showDiv");
        $('.categories').css('z-index',"1000");
        $('.fullOverlay').hide();
    }

    return false;
});
                               
