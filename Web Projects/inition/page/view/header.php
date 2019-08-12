<header class="<?php if($pageType == "home") { echo "main__header"; } else { echo "sub__header"; } ?>">
  <div class="container">
    <nav class="navbar navbar-default" role="navigation"> 
      <!-- Brand and toggle get grouped for better mobile display --> 
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="navbar-header">
        <h1 class="navbar-brand"><a href="index.html">INITION</a></h1>
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1,#bs-example-navbar-collapse-2"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
      </div>
      <div class="navbar-collapse navbar-right" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
        	
        	<?php
        		$prepare = array("title");
				$pageTable = $database->page;
				$pageIds = $pageTable->_query(false, false, $prepare);
				foreach ($pageIds as $pageId){
					$page = $pageTable($pageId);
					if ($page->_getParId() === ""){
						$liClasses = array();
						if ($activePage  === $page){
							$liClasses[] = "active";
						}
						?>
        	
          				<li class="<?php echo implode(" ", $liClasses) ?>"><a href="<?php echo createUrl($page); ?>"><?php echo htmlspecialchars($page->title); ?></a></li>
          				<!-- <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown">Pages</a> -->
            			<?php
            		}
				}
            //<ul class="dropdown-menu">
              //<li><a href="index_fixed.html">Home / Fixed</a></li>
              
            ?>  
        </ul>
      </div>
      <!-- /.navbar-collapse --> 
    </nav>
  </div>
</header>