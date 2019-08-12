<?php
	function checkIsValidData ($data, $validData) {
		if (!is_array($data)) {
			return false;
		}
		//TODO add validation function!
		foreach ($validData as $field => $validateData) {
			if (!isset($data[$field])) {
				return false;
			}
			
			if (is_array($validateData)) {
				if (!is_array($data[$field]) || empty($data[$field])) {
					return false;
				}
				
				foreach ($data[$field] as $row) {
					$res = checkIsValidData($row, $validateData);
					if ($res === false) {
						return false;
					}
				}
			}
			else {
				$func = "validation::" . $validateData;
				
				if (function_exists($func)) {
					if (call_user_func($func, $data[$field]) === false) {
						return false;
					}
				}
			}
		}
		return true;
	}