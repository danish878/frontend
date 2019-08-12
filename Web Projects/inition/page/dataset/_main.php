<?php
	$return = array();
	$return['view'] = "template";
	$return['activePage'] = false;
	$return['pageType'] = "404";
	
	$pagePrepare = array("title", "type");
	
	$pageTable = $database->page;
	$activePageIds = $pageTable->_query(0, 1, $pagePrepare, array(
		"uri" => json_encode(implode("/", $url))
	));
	
	if (!empty($activePageIds)) {
		$activePage = $pageTable($activePageIds[0]);
		
		$return['activePage'] = $activePage;
	}
	
	if (isset($return['activePage']) && $return['activePage'] !== false) {
		$return["datasetUri"] = "type/" . $return['activePage']->type->_getValue() . ".php";
		$return['pageType'] = $return['activePage']->type->_getValue();
	}
	
	return $return;
	