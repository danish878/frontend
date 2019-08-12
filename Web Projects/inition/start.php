<?php
    $args = $_args;

	$mainDirs = array();
	$mainDirs[] = "page/";
	
    $mainDir = $mainDirs[0];
	$datasetDir = $mainDir . "dataset/";
	$datasetUri = false;
	if (empty($url)) {
        $datasetUri = "noUrl.php";
    } else {
    	$datasetUri = "404.php";
		
		foreach ($mainDirs as $dir) {
            $dDir = $dir . "dataset/";
            $files = scandir($dDir);
            
            foreach ($files as $file) {
                if (is_file($dDir . $file)) {
                    $fileInfo = pathinfo($file);
                    
                    if ($fileInfo['filename'] === $url[0]) {
                        $mainDir = $dir;
                        $datasetDir = $dDir;
                            
                        $datasetUri = $file;
                        break;
                    }
                }
            }
        }
	}
	
	
	if ($datasetUri !== false) {
		$args['datasetUri'] = $datasetUri;
		
		$loadDataset = $datasetDir . "_main.php";
		if (file_exists($loadDataset)) {
			
			$logTime->_logTime("before `" . $loadDataset . "` dataset"); 
			
			$dataset = loadView($loadDataset, $args);
			
			$logTime->_logTime("after `" . $loadDataset . "` dataset"); 
					
			if (is_array($dataset)) {		
				$view = 'template';
				foreach ($dataset as $key => $value) {
					$args[$key] = $value;
					$$key = $value;
				}
			}
		}
		
		$loadDataset = $datasetDir . $datasetUri;
		if (file_exists($loadDataset)) {
			$logTime->_logTime("before `" . $loadDataset . "` dataset"); 
			
			$dataset = loadView($loadDataset, $args);
			
			$logTime->_logTime("after `" . $loadDataset . "` dataset"); 
			if (is_array($dataset)) {		
				$view = 'template';
				foreach ($dataset as $key => $value) {
					$args[$key] = $value;
					$$key = $value;
				}
			}
		}
	}
    
	if (isset($view)) {
		loadView($mainDir . $view . ".php", $args);
	}
	