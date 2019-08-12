<?php
	function createUrl ($page) {
		$uri = $page->uri->_getValue();
		if ($uri !== "") {
			$uri .= "/";
		}
		
		return baseUrl . $uri;
	}
