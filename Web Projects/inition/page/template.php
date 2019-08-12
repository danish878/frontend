<?php

	$frontEnd = new frontEnd();
	$_args['frontEnd'] = $frontEnd;

?>

<!DOCTYPE html>
<html>
<head>
<title><?php echo $activePage->title; ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="<?php echo $activePage->seoMetaDescription; ?>"></meta>
<meta name="keywords" content="<?php echo $activePage->seoMetaKeywords; ?>"></meta>
<!-- Bootstrap -->
<link href="<?php echo baseUrl;?>css/bootstrap.min.css" rel="stylesheet">
<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700,800' rel='stylesheet' type='text/css'>
<link href="<?php echo baseUrl;?>css/style.css" rel="stylesheet">
<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>

<body>
	
	<?php 
	
		include("page/view/header.php");
		loadView("page/type/".$pageType.".php", $_args);
		include("page/view/footer.php");
	
	
	 ?>
	
	
	
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) --> 
<script type="text/javascript" src="<?php echo baseUrl;?>js/jquery.min.js"></script> 
<!-- Include all compiled plugins (below), or include individual files as needed --> 
<script src="<?php echo baseUrl;?>js/bootstrap.min.js"></script> 
<script type="text/javascript">

$('.carousel').carousel({
  interval: 3500, // in milliseconds
  pause: 'none' // set to 'true' to pause slider on mouse hover
})
</script>


</body>
</html>