<?php
	function getChildPageRows ($database, $pageId, $notCheckIds) {
		$where = array();
		$where['id'] = array("(" . implode(", ", $notCheckIds) . ")", "NOT IN", false);
		$where['parId'] = $pageId;
		
		$pageTable = $database->page;
		$pageIds = $pageTable->_query(false, false, array(), $where);
		
		$a = array();
		foreach ($pageIds as $pageId) {
			$a[$pageId] = $pageTable($pageId);
		} 
		return $a;
	}
	
	function fixPagesUri ($database, $rows) {
		$firstPage = false;
			
		$rowIds = array_keys($rows);
		
		foreach ($rowIds as $rowId) {
			$res = getChildPageRows($database, $rowId, $rowIds);
			foreach ($res as $id => $row) {
				$rows[$id] = $row; 
			}
		}
		
		$newUris = array();
		while (!empty($rows)) {
			$row = $rows[key($rows)];
			$parId = $row->_getParId();
			if (!isset($rows[$parId])) {
				$uriTitle = "";
				if ($row->_getSequence() === 0) {
					$firstPage = $row;
				}
					
				$uri = "";
				if ($parId != 0) {
					$parPage = $database->page($parId);
					$parUri = $parPage->uri->_getValue();
					if ($parPage->_getSequence() === 0) {
						$parUri = safeUrl($parPage->title->_getValue());
					}
					$uri = $parUri . "/";
				}
				
				$mainTitle = $uri . safeUrl($row->title->_getValue());
				$uriTitle = $mainTitle;
				$count = 1;
				
				while (isset($newUris[$uriTitle]) || $database->page->_getRowCount(array( "uri" => json_encode($uriTitle), "id" => array("" . $row->_getId(), "!="))) > 0) {
						
					$uriTitle = $mainTitle . "-" . $count;
					
					$count ++;
				}
				
				$newUris[$uriTitle] = true;
				$row->uri->_setValue($uriTitle);
			}
			else {
				unset($rows[$parId]);
				$rows[$parId] = $row;
			}
			
			unset($rows[key($rows)]);
		}

		if ($firstPage !== false) {
			$firstPage->uri->_setValue("");
		}
	}
	
	function tableedited_page ($database, $rows, $cols) {
		if (in_array("title", $cols) || in_array("parId", $cols)) {
			fixPagesUri($database, $rows);
		}
	}
	
	function tableadded_page ($database, $rows) {
		fixPagesUri($database, $rows);
	}
