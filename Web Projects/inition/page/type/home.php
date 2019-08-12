<section class="slider">
  <div id="myCarousel" class="carousel slide carousel-fade" data-ride="carousel">
    <div class="carousel-inner">
    	
    	<?php
    		$sliderItemTable = $activePage->slider;
			
			
			foreach ($sliderItemTable->_query() as $count =>$sliderItemName)
			{
				$sliderItem = $sliderItemTable($sliderItemName);
				$sliderImage = $sliderItem->image;
				$sliderHeading = $sliderItem->heading;
				$sliderTitle = $sliderItem->title;
				$sliderSubTitle = $sliderItem->subTitle;
				$sliderButtonText = $sliderItem->buttonText;
				$sliderButtonUrl = $sliderItem->url;
				?>
				
					<div class="item <?php if($count==0){echo 'active';} ?>" >
				      	<?php $sliderImage->_render(); ?>
				        <div class="container">
				          <div class="carousel-caption">
				            <p class="little"><span><?php echo $sliderHeading; ?></span></p>
				            <h1><?php echo $sliderTitle; ?></h1>
				            <p><?php echo $sliderSubTitle ?></p>
				            <p><a class="btn btn-default btn-sm" href="<?php echo $sliderButtonUrl; ?>" role="button"><?php echo $sliderButtonText; ?></a></p>
				          </div>
				        </div>
				    </div>
				<?php
					
 			}
    	
    	?>
    	
    </div>
    <a class="left carousel-control" href="#myCarousel" data-slide="prev"><span class="glyphicon carousel-control-left"></span></a> <a class="right carousel-control" href="#myCarousel" data-slide="next"><span class="glyphicon carousel-control-right"></span></a>
  </div>
</section>
<!--end of slider section-->
<section class="main__middle__container homepage13">
  <div class="row text-center no-margin nothing">
    <div class="container headings">
      <p class="little"><span><?php echo $activePage->aboutHeading; ?></span></p>
      <h2 class="page_title"><?php $abWeb = $activePage->aboutWebsite->_splitInColumns(1);
	  	foreach ($abWeb as $abtWeb)
		{
			echo $abtWeb;
		}
	   ?></h2>
    </div>
  </div>
  <div class="row  three__blocks text-center no_padding no-margin">
    <div class="container">
      <h2><?php echo $activePage->servicesTitle; ?></h2>
      <span class="separator"></span>
      <p class="small-paragraph"><?php $activePage->servicesDescription->_render(); ?></p>
      
      <?php
      	$itemBoxTable = $activePage->servicesItemBox;
		
		foreach ($itemBoxTable->_query() as $itemBoxName)
		{
			$item = $itemBoxTable($itemBoxName);
			$itemImage = $item->image;
			$itemTitle = $item->title;
			$itemSubTitle = $item->subTitle;
			$itemDescription = $item->description;
			$itemButtonText = $item->buttonText;
			?>
			
				<div class="col-md-4 img-rounded">
					<?php $itemImage->_render(); ?>
			        <h3><a href="#"><?php echo $itemTitle; ?></a></h3>
			        <p class="smaller"><?php echo $itemSubTitle; ?></p>
			        <p><?php echo $itemDescription; ?> </p>
			        <p><a class="btn btn-info btn-sm" href="#" role="button"><?php echo $itemButtonText; ?></a> 
			    </div>
		     <?php 
		}
      ?>
      
    </div>
  </div>
      
  <div class="text-center three-blocks" style="background:url('<?php $tImg = $activePage->testimonialImage->_getValue();$imgSource =  baseUrl.$tImg['img'];echo $imgSource; ?>') no-repeat center; background-size:cover; ">
      
    <div class="container">
      <div class="row white__heading">
        <h2><?php echo $activePage->testimonialHeading; ?></h2>
        <p class="little"><?php echo $activePage->testimonialDescription; ?></p>
        <p><a class="btn btn-info btn-lg" href="#"><?php echo $activePage->testimonialButtonText; ?></a></p>
      </div>
    </div>
  </div>
  
  <div class="row  three__blocks text-center no_padding no-margin">
    <div class="container">
      <h2><?php echo $activePage->whatWeDoTitle; ?></h2>
      <span class="separator"></span>
      <p class="small-paragraph"><?php $activePage->whatWeDoDescription->_render(); ?></p>
      
      <?php
      	$wwdItemTable = $activePage->whatWeDoItem;
		
		foreach ($wwdItemTable->_query() as $wwdItemName)
		{
			$wwdItem = $wwdItemTable($wwdItemName);
			$wwdImage = $wwdItem->image;
			$wwdTitle = $wwdItem->title;
			$wwdSubTitle = $wwdItem->subTitle;
			$wwdDescription = $wwdItem->description;
			$wwdButtonText = $wwdItem->buttonText;
			?>
			
				<div class="col-md-6 img-rounded">
					<?php $wwdImage->_render(); ?>
			        <h3><?php echo $wwdTitle; ?></h3>
			        <p class="smaller"><?php echo $wwdSubTitle; ?></p>
			        <p><?php echo $wwdDescription; ?></p>
			        <p><a href="#" class="btn btn-info btn-lg"><?php echo $wwdButtonText; ?></a></p>
			    </div>
			<?php
		}
      ?>
      
    </div>
  </div>
</section>