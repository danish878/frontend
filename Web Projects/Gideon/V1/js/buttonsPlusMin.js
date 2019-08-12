(
    function () {
        var fixEl = function (el, plus) {
            var input = el.parentNode.parentNode.children[0];
			
            $(el).click(function () {
                var newValue = parseInt(input.value);
                if (isNaN(newValue)) {
                    newValue = 1;
                }

                newValue += plus;

                if (newValue < 1) {
                    newValue = 1;
                }
                
                
				$(input).val(newValue);
				$(input).trigger("change");

                return false;
            });
        };
               
        $(".btnPlus").each(function () {
            fixEl(this, 1);
        });
        $(".btnMinus").each(function () {
            fixEl(this, -1);
        });
    }()
);