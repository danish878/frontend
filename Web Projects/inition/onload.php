<?php
	loadFilesInFolder("./source/");

	$ssoId = 0;
	if (defined("ssoId")) { 
		$ssoId = ssoId; 
	}

	$adminRights = true;
	if ($ssoId !== 0) {
		$adminRights = false;
		
		$sso = new peerSso();
		
		$adminRights = $sso->_loadMethod("auth", "ActiveUserHasWebsite", array(
			"websiteId" => $ssoId
		));
	}
	
	define("isAdmin", $adminRights);
	
	return array(
		"logTime" => new logTime()
	);
