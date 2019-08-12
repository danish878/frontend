$(document).ready(function () {
    $('#Grid').mixitup();  // Start work gallery

    magnific(".gallery");
});


function magnific(name) {
    $(name).magnificPopup({
        delegate: 'a', // the selector for gallery item
        type: 'image',
        gallery: {
          enabled:true
        }
    });
}

$('#printing').click(function() { 
    magnific(".printing");
}); 
$('#development').click(function() { 
    magnific(".development");
}); 
$('#seo').click(function() { 
   magnific(".seo");
}); 
$('#webdesign').click(function() { 
   magnific(".webdesign");
}); 