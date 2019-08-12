(
	function () {
		var result = $('#searchResult');
		result.hide();
		
		$("#searchForm").submit(function (ev) {
			ev.preventDefault();
			//TODO create ajax query here!
			
			var str = this["query"].value;
			if (str === "") {
				result.hide();
			}
			else {
				result.show();
			}
			
			return false;
		});
	}()
);
