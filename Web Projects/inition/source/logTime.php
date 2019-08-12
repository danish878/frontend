<?php
	class logTime {
		private $startTime, $times = array();
		public function __construct () {
			$this->startTime = microtime(true);
		}
		
		public function _logTime ($str) {
			$this->times[] = array(
				"str" 	=> $str,
				"time" 	=> microtime(true)
			);
		}
		
		public function _output ($returnContent = false) {
			return;
			//ob_clean();
			
			$prevTime = $this->startTime;
			foreach ($this->times as $timeData) {
				echo $timeData['str'] . " &gt; ". intval(($timeData['time'] - $prevTime) * 1000) . "ms<br />";
				$prevTime = $timeData['time'];
			}
			
			echo "TOTAL: " . intval(($prevTime - $this->startTime) * 1000) . "ms";
		}
	}
