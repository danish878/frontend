(
	function () {
		var select = $("#orderRegisterOrLogin");
		var divs = [$("#orderRegister"), $("#orderLogin")];
		
		var change = function () {
			var index = select.prop("selectedIndex");
			for (var i = 0; i < divs.length; i++) {
				divs[i][((index === i)? "hide" : "show")]();
			}
		};
		
		select.on("change", change);
		change();
	}()
);

(
	function () {
		var registerOrLogin = $("#orderRegisterOrLogin");
		if (registerOrLogin[0]) {
			var registerOrLoginParent = $("#orderRegisterOrLogin").parent();
			
			
			var select = $("#orderRegisterAccount");
			var registerAccount = $("#registerAccount");
			
			var changeRegister = function () {
				if (select.val() === "y") {
					registerAccount.show();
					registerOrLogin[0].selectedIndex = 0;
					registerOrLogin.change();
					registerOrLoginParent.show();
				}
				else {
					registerAccount.hide();
					registerOrLogin[0].selectedIndex = 1;
					registerOrLogin.change();
					registerOrLoginParent.hide();
				}
			};
			
			select.on("change", changeRegister);
			changeRegister();
		}
	}()
);

(
	function () {
		$("input[name=postcode]").each(function () {
			var self = this;
			var formEl = $(this.form);
			
			var i = false;
			var keys = ["town", "street", "postcode"];
			var fields = [];
			for (var i2 = 0; i2 < keys.length; i2 ++) {
				fields.push(formEl.find("input[name=" + keys[i2] + "]"));
			}
			
			var prevVal = "";
			
			$(this).blur(function () {
				if (this.value !== prevVal) {
					if (this.value === "") {
						for (var i2 = 0; i2 < fields.length; i2 ++) {
							fields[i2].val("");
						}
					}
					else {
						for (var i2 = 0; i2 < fields.length; i2 ++) {
							fields[i2].prop('disabled', true);
						}
						
						$.getJSON("?postal=" + this.value, function (data) {
							for (var i2 = 0; i2 < fields.length; i2 ++) {
								fields[i2].prop('disabled', false);
								fields[i2].val(data[keys[i2]]);
							}
							
							prevVal = self.value;
						});
					}
				}
				prevVal = this.value;
			});
			
			
		});
	}()
);

