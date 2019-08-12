/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

function loadApi (_class, _method, _args, onload, onerror) {
	var args = {
		"apiMethodArgs": _args
	};
	
	loadJson(baseUrl + "api/" + _class + "/" + _method + "/", args, function (res) {
		onload(res);
	}, onerror);
}
function loadJson (url, param, onload, onerror) {
	return loadXhr(url, param, function (txt) {
		var json = undefined;
		try {
			json = JSON.parse(txt);
		}
		catch (e) {
			onerror();
			return;
		}
		onload(json);
	}, onerror);
};
function loadPostal (str, onload, onerror) {
	loadApi("geoCode", "getPostalLocation", [str], function (res) {
		if (res === false)
			{ onerror(); }
		else {
			onload(res);
		}
	}, onerror);
}

function loadPostalDe(str, onload, onerror) {
	loadApi("geoCode", "getGeoLocation", [str + " Germany"], function (res) {
		if (res === false)
			{ onerror(); }
		else {
			onload(res);
		}
	}, onerror);
}
function loadXhr (url, args, onload, onerror) {
	var http;
	if (window.XMLHttpRequest) {              
    	http = new XMLHttpRequest();              
    } else {                                  
    	http = new ActiveXObject("Microsoft.XMLHTTP");
    }
	
	
	var interval = true;
	var active = true;
	
	var checkState = function () {
		if(http.readyState == 4 && active) {
			if (http.status == 200) 
				{ onload(http.responseText); }
			else if (http.status !== 0)
				{ onerror(); }
		}
	};

	var param = [];
	if (args !== undefined) {
		for (var i in args) { 
			param.push(encodeURIComponent(i) + "=" + encodeURIComponent(JSON.stringify(args[i]))); 
		}
	}
	
	if (param.length > 0) {
		http.open("POST", url, true);
		
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = checkState;
		http.send(param.join("&"));
	}
	else {
		http.open("GET", url, true);
		http.onreadystatechange = checkState;
		http.send();
	}
	
	return {
		"abort": function () {
			active = false;
			http.abort();
		}
	};
};
/*  
  Animator.js 1.1.11
  
  This library is released under the BSD license:

  Copyright (c) 2006, Bernard Sumption. All rights reserved.
  
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
  
  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer. Redistributions in binary
  form must reproduce the above copyright notice, this list of conditions and
  the following disclaimer in the documentation and/or other materials
  provided with the distribution. Neither the name BernieCode nor
  the names of its contributors may be used to endorse or promote products
  derived from this software without specific prior written permission. 
  
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
  OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
  DAMAGE.

*/


// Applies a sequence of numbers between 0 and 1 to a number of subjects
// construct - see setOptions for parameters


function Animator(options) {
    this.setOptions(options);
    var _this = this;
    this.timerDelegate = function() {
        _this.onTimerEvent();
    };
    this.subjects = [];
    this.target = 0;
    this.state = 0;
    this.lastTime = null;
};
Animator.prototype = {
    // apply defaults
    setOptions: function(options) {
        this.options = Animator.applyDefaults({
            interval: 20,
            // time between animation frames
            duration: 400,
            // length of animation
            onComplete: function() {},
            onStep: function() {},
            transition: Animator.tx.easeInOut
        }, options);
    },
    setOnComplete: function (callback) {
    	if (callback !== undefined) 
    		{ this.options.onComplete = callback; }
    },
    // animate from the current state to provided value
    seekTo: function(to) {
        this.seekFromTo(this.state, to);
    },
    // animate from the current state to provided value
    seekFromTo: function(from, to) {
        
        this.target = Math.max(0, Math.min(1, to));
        
       	if (isSlowBrowser) {
            this.state = to;
            this.intervalId = 0;
            
            try {
                this.propagate();
            } finally {
                this.options.onStep.call(this);
                if (this.target == this.state) {
                    this.options.onComplete.call(this);
                }
            }
        } else {
            
            this.state = Math.max(0, Math.min(1, from));
            this.lastTime = new Date().getTime();
            
            if (!this.intervalId) {
                this.intervalId = window.setInterval(this.timerDelegate, this.options.interval);
            }
        }

    },
    // animate from the current state to provided value
    jumpTo: function(to) {
        this.target = this.state = Math.max(0, Math.min(1, to));
        this.propagate();
    },
    // seek to the opposite of the current target
    toggle: function() {
    	this.seekTo(1 - this.target);
        
        return ((1 - this.target) === 0);
    },
    // add a function or an object with a method setState(state) that will be called with a number
    // between 0 and 1 on each frame of the animation
    addSubject: function(subject) {
        this.subjects[this.subjects.length] = subject;
        return this;
    },
    // remove all subjects
    clearSubjects: function() {
        this.subjects = [];
    },
    // forward the current state to the animation subjects
    propagate: function() {
        var value = this.options.transition(this.state);
        for (var i = 0; i < this.subjects.length; i++) {
            if (this.subjects[i].setState) {
                this.subjects[i].setState(value);
            } else {
                this.subjects[i](value);
            }
        }
    },
    // called once per frame to update the current state
    onTimerEvent: function() {
        var now = new Date().getTime();
        var timePassed = now - this.lastTime;
        this.lastTime = now;
        var movement = (timePassed / this.options.duration) * (this.state < this.target ? 1 : -1);
        if (Math.abs(movement) >= Math.abs(this.state - this.target)) {
            this.state = this.target;
        } else {
            this.state += movement;
        }

        try {
            this.propagate();
        } finally {
            this.options.onStep.call(this);
            if (this.target == this.state) {
                this.stop();
            }
        }
    },
    stop: function() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
            this.options.onComplete.call(this);
        }
    },
    // shortcuts
    play: function() {
        this.seekFromTo(0, 1);
    },
    reverse: function() {
        this.seekFromTo(1, 0);
    },
    // return a string describing this Animator, for debugging
    inspect: function() {
        var str = "#<Animator:\n";
        for (var i = 0; i < this.subjects.length; i++) {
            str += this.subjects[i].inspect();
        }
        str += ">";
        return str;
    }
};
// merge the properties of two objects
Animator.applyDefaults = function(defaults, prefs) {
    prefs = prefs || {};
    var prop, result = {};
    for (prop in defaults) result[prop] = prefs[prop] !== undefined ? prefs[prop] : defaults[prop];
    return result;
};
// make an array from any object
Animator.makeArrayOfElements = function(o) {
    var typeOf = typeof o;

    if (o == null) return [];
    if ("string" == typeOf) {
        return [document.getElementById(o)];
    }
    if (!o.length) {
    	return [o];
    }

    var result = [];
    for (var i = 0; i < o.length; i++) {
        if ("string" == typeof o[i]) {
            result[i] = document.getElementById(o[i]);
        } else {
            result[i] = o[i];
        }
    }
    return result;
};
// convert a dash-delimited-property to a camelCaseProperty (c/o Prototype, thanks Sam!)
Animator.camelize = function(string) {
    var oStringList = string.split('-');
    if (oStringList.length == 1) return oStringList[0];

    var camelizedString = string.indexOf('-') == 0 ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];

    for (var i = 1, len = oStringList.length; i < len; i++) {
        var s = oStringList[i];
        camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
    }
    return camelizedString;
};
// syntactic sugar for creating CSSStyleSubjects
Animator.apply = function(el, style, options) {
    if (style instanceof Array) {
        return new Animator(options).addSubject(new CSSStyleSubject(el, style[0], style[1]));
    }
    return new Animator(options).addSubject(new CSSStyleSubject(el, style));
};
// make a transition function that gradually accelerates. pass a=1 for smooth
// gravitational acceleration, higher values for an exaggerated effect
Animator.makeEaseIn = function(a) {
    return function(state) {
        return Math.pow(state, a * 2);
    };
};
// as makeEaseIn but for deceleration
Animator.makeEaseOut = function(a) {
    return function(state) {
        return 1 - Math.pow(1 - state, a * 2);
    };
};
// make a transition function that, like an object with momentum being attracted to a point,
// goes past the target then returns
Animator.makeElastic = function(bounces) {
    return function(state) {
        state = Animator.tx.easeInOut(state);
        return ((1 - Math.cos(state * Math.PI * bounces)) * (1 - state)) + state;
    };
};
// make an Attack Decay Sustain Release envelope that starts and finishes on the same level
// 
Animator.makeADSR = function(attackEnd, decayEnd, sustainEnd, sustainLevel) {
    if (sustainLevel == null) sustainLevel = 0.5;
    return function(state) {
        if (state < attackEnd) {
            return state / attackEnd;
        }
        if (state < decayEnd) {
            return 1 - ((state - attackEnd) / (decayEnd - attackEnd) * (1 - sustainLevel));
        }
        if (state < sustainEnd) {
            return sustainLevel;
        }
        return sustainLevel * (1 - ((state - sustainEnd) / (1 - sustainEnd)));
    };
};
// make a transition function that, like a ball falling to floor, reaches the target and/
// bounces back again
Animator.makeBounce = function(bounces) {
    var fn = Animator.makeElastic(bounces);
    return function(state) {
        state = fn(state);
        return state <= 1 ? state : 2 - state;
    };
};

// pre-made transition functions to use with the 'transition' option
Animator.tx = {
    easeInOut: function(pos) {
        return ((-Math.cos(pos * Math.PI) / 2) + 0.5);
    },
    linear: function(x) {
        return x;
    },
    easeIn: Animator.makeEaseIn(1.5),
    easeOut: Animator.makeEaseOut(1.5),
    strongEaseIn: Animator.makeEaseIn(2.5),
    strongEaseOut: Animator.makeEaseOut(2.5),
    elastic: Animator.makeElastic(1),
    veryElastic: Animator.makeElastic(3),
    bouncy: Animator.makeBounce(1),
    veryBouncy: Animator.makeBounce(3)
};

// animates a pixel-based style property between two integer values

function NumericalStyleSubject(els, property, from, to, units) {
    this.els = Animator.makeArrayOfElements(els);
    if (property == 'opacity' && window.ActiveXObject) {
        this.property = 'filter';
    } else {
        this.property = Animator.camelize(property);
    }
    this.from = parseFloat(from);
    this.to = parseFloat(to);
    this.units = units != null ? units : 'px';
};
NumericalStyleSubject.prototype = {
    setState: function(state) {
        var style = this.getStyle(state);
        var visibility = (this.property == 'opacity' && state == 0) ? 'hidden' : '';
        var j = 0;
        for (var i = 0; i < this.els.length; i++) {
            try {
                this.els[i].style[this.property] = style;
            } catch (e) {
                // ignore fontWeight - intermediate numerical values cause exeptions in firefox
                if (this.property != 'fontWeight') throw e;
            }
            if (j++ > 20) return;
        }
    },
    getStyle: function(state) {
        state = this.from + ((this.to - this.from) * state);
        if (this.property == 'filter') return "alpha(opacity=" + Math.round(state * 100) + ")";
        if (this.property == 'opacity') return state;
        return Math.round(state) + this.units;
    },
    inspect: function() {
        return "\t" + this.property + "(" + this.from + this.units + " to " + this.to + this.units + ")\n";
    }
};

// animates a colour based style property between two hex values

function ColorStyleSubject(els, property, from, to) {
    this.els = Animator.makeArrayOfElements(els);
    this.property = Animator.camelize(property);
    this.to = this.expandColor(to);
    this.from = this.expandColor(from);
    this.origFrom = from;
    this.origTo = to;
}

ColorStyleSubject.prototype = {
    // parse "#FFFF00" to [256, 256, 0]
    expandColor: function(color) {
        var hexColor, red, green, blue;
        hexColor = ColorStyleSubject.parseColor(color);
        if (hexColor) {
            red = parseInt(hexColor.slice(1, 3), 16);
            green = parseInt(hexColor.slice(3, 5), 16);
            blue = parseInt(hexColor.slice(5, 7), 16);
            return [red, green, blue];
        }
        if (window.ANIMATOR_DEBUG) {
            alert("Invalid colour: '" + color + "'");
        }
    },
    getValueForState: function(color, state) {
        return Math.round(this.from[color] + ((this.to[color] - this.from[color]) * state));
    },
    setState: function(state) {
        var color = '#' + ColorStyleSubject.toColorPart(this.getValueForState(0, state)) + ColorStyleSubject.toColorPart(this.getValueForState(1, state)) + ColorStyleSubject.toColorPart(this.getValueForState(2, state));
        for (var i = 0; i < this.els.length; i++) {
            this.els[i].style[this.property] = color;
        }
    },
    inspect: function() {
        return "\t" + this.property + "(" + this.origFrom + " to " + this.origTo + ")\n";
    }
};

// return a properly formatted 6-digit hex colour spec, or false
ColorStyleSubject.parseColor = function(string) {
    var color = '#',
        match;
    if (match = ColorStyleSubject.parseColor.rgbRe.exec(string)) {
        var part;
        for (var i = 1; i <= 3; i++) {
            part = Math.max(0, Math.min(255, parseInt(match[i])));
            color += ColorStyleSubject.toColorPart(part);
        }
        return color;
    }
    if (match = ColorStyleSubject.parseColor.hexRe.exec(string)) {
        if (match[1].length == 3) {
            for (var i = 0; i < 3; i++) {
                color += match[1].charAt(i) + match[1].charAt(i);
            }
            return color;
        }
        return '#' + match[1];
    }
    return false;
};
// convert a number to a 2 digit hex string
ColorStyleSubject.toColorPart = function(number) {
    if (number > 255) number = 255;
    var digits = number.toString(16);
    if (number < 16) return '0' + digits;
    return digits;
};
ColorStyleSubject.parseColor.rgbRe = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
ColorStyleSubject.parseColor.hexRe = /^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// Animates discrete styles, i.e. ones that do not scale but have discrete values
// that can't be interpolated

function DiscreteStyleSubject(els, property, from, to, threshold) {
    this.els = Animator.makeArrayOfElements(els);
    this.property = Animator.camelize(property);
    this.from = from;
    this.to = to;
    this.threshold = threshold || 0.5;
}

DiscreteStyleSubject.prototype = {
    setState: function(state) {
        var j = 0;
        for (var i = 0; i < this.els.length; i++) {
            this.els[i].style[this.property] = state <= this.threshold ? this.from : this.to;
        }
    },
    inspect: function() {
        return "\t" + this.property + "(" + this.from + " to " + this.to + " @ " + this.threshold + ")\n";
    }
};

// animates between two styles defined using CSS.
// if style1 and style2 are present, animate between them, if only style1
// is present, animate between the element's current style and style1

function CSSStyleSubject(els, style1, style2) {
    els = Animator.makeArrayOfElements(els);
    this.subjects = [];
    if (els.length == 0) return;
    var prop, toStyle, fromStyle;
    if (style2) {
        fromStyle = this.parseStyle(style1, els[0]);
        toStyle = this.parseStyle(style2, els[0]);
    } else {
        toStyle = this.parseStyle(style1, els[0]);
        fromStyle = {};
        for (prop in toStyle) {
            fromStyle[prop] = CSSStyleSubject.getStyle(els[0], prop);
        }
    }
    // remove unchanging properties
    var prop;
    for (prop in fromStyle) {
        if (fromStyle[prop] == toStyle[prop]) {
            delete fromStyle[prop];
            delete toStyle[prop];
        }
    }
    // discover the type (numerical or colour) of each style
    var prop, units, match, type, from, to;
    for (prop in fromStyle) {
        var fromProp = String(fromStyle[prop]);
        var toProp = String(toStyle[prop]);
        if (toStyle[prop] == null) {
            if (window.ANIMATOR_DEBUG) alert("No to style provided for '" + prop + '"');
            continue;
        }

        if (from = ColorStyleSubject.parseColor(fromProp)) {
            to = ColorStyleSubject.parseColor(toProp);
            type = ColorStyleSubject;
        } else if (fromProp.match(CSSStyleSubject.numericalRe) && toProp.match(CSSStyleSubject.numericalRe)) {
            from = parseFloat(fromProp);
            to = parseFloat(toProp);
            type = NumericalStyleSubject;
            match = CSSStyleSubject.numericalRe.exec(fromProp);
            var reResult = CSSStyleSubject.numericalRe.exec(toProp);
            if (match[1] != null) {
                units = match[1];
            } else if (reResult[1] != null) {
                units = reResult[1];
            } else {
                units = reResult;
            }
        } else if (fromProp.match(CSSStyleSubject.discreteRe) && toProp.match(CSSStyleSubject.discreteRe)) {
            from = fromProp;
            to = toProp;
            type = DiscreteStyleSubject;
            units = 0; // hack - how to get an animator option down to here
        } else {
            if (window.ANIMATOR_DEBUG) {
                alert("Unrecognised format for value of " + prop + ": '" + fromStyle[prop] + "'");
            }
            continue;
        }
        this.subjects[this.subjects.length] = new type(els, prop, from, to, units);
    }
}

CSSStyleSubject.prototype = {
    // parses "width: 400px; color: #FFBB2E" to {width: "400px", color: "#FFBB2E"}
    parseStyle: function(style, el) {
        var rtn = {};
        // if style is a rule set
        if (style.indexOf(":") != -1) {
            var styles = style.split(";");
            for (var i = 0; i < styles.length; i++) {
                var parts = CSSStyleSubject.ruleRe.exec(styles[i]);
                if (parts) {
                    rtn[parts[1]] = parts[2];
                }
            }
        }
        // else assume style is a class name
        else {
            var prop, value, oldClass;
            oldClass = el.className;
            el.className = style;
            for (var i = 0; i < CSSStyleSubject.cssProperties.length; i++) {
                prop = CSSStyleSubject.cssProperties[i];
                value = CSSStyleSubject.getStyle(el, prop);
                if (value != null) {
                    rtn[prop] = value;
                }
            }
            el.className = oldClass;
        }
        return rtn;

    },
    setState: function(state) {
        for (var i = 0; i < this.subjects.length; i++) {
            this.subjects[i].setState(state);
        }
    },
    inspect: function() {
        var str = "";
        for (var i = 0; i < this.subjects.length; i++) {
            str += this.subjects[i].inspect();
        }
        return str;
    }
};
// get the current value of a css property, 
CSSStyleSubject.getStyle = function(el, property) {
    var style;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        style = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
        if (style) {
            return style;
        }
    }
    property = Animator.camelize(property);
    if (el.currentStyle) {
        style = el.currentStyle[property];
    }
    return style || el.style[property];
};


CSSStyleSubject.ruleRe = /^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/;
CSSStyleSubject.numericalRe = /^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/;
CSSStyleSubject.discreteRe = /^\w+$/;

// required because the style object of elements isn't enumerable in Safari
/*
CSSStyleSubject.cssProperties = ['background-color','border','border-color','border-spacing',
'border-style','border-top','border-right','border-bottom','border-left','border-top-color',
'border-right-color','border-bottom-color','border-left-color','border-top-width','border-right-width',
'border-bottom-width','border-left-width','border-width','bottom','color','font-size','font-size-adjust',
'font-stretch','font-style','height','left','letter-spacing','line-height','margin','margin-top',
'margin-right','margin-bottom','margin-left','marker-offset','max-height','max-width','min-height',
'min-width','orphans','outline','outline-color','outline-style','outline-width','overflow','padding',
'padding-top','padding-right','padding-bottom','padding-left','quotes','right','size','text-indent',
'top','width','word-spacing','z-index','opacity','outline-offset'];*/


CSSStyleSubject.cssProperties = ['azimuth', 'background', 'background-attachment', 'background-color', 'background-image', 'background-position', 'background-repeat', 'border-collapse', 'border-color', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-width', 'bottom', 'clear', 'clip', 'color', 'content', 'cursor', 'direction', 'display', 'elevation', 'empty-cells', 'css-float', 'font', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'height', 'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'max-height', 'max-width', 'min-height', 'min-width', 'orphans', 'outline', 'outline-color', 'outline-style', 'outline-width', 'overflow', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'pause', 'position', 'right', 'size', 'table-layout', 'text-align', 'text-decoration', 'text-indent', 'text-shadow', 'text-transform', 'top', 'vertical-align', 'visibility', 'white-space', 'width', 'word-spacing', 'z-index', 'opacity', 'outline-offset', 'overflow-x', 'overflow-y'];


// chains several Animator objects together

function AnimatorChain(animators, options) {
    this.animators = animators;
    this.setOptions(options);
    for (var i = 0; i < this.animators.length; i++) {
        this.listenTo(this.animators[i]);
    }
    this.forwards = false;
    this.current = 0;
}

AnimatorChain.prototype = {
    // apply defaults
    setOptions: function(options) {
        this.options = Animator.applyDefaults({
            // by default, each call to AnimatorChain.play() calls jumpTo(0) of each animator
            // before playing, which can cause flickering if you have multiple animators all
            // targeting the same element. Set this to false to avoid this.
            resetOnPlay: true
        }, options);
    },
    // play each animator in turn
    play: function() {
        this.forwards = true;
        this.current = -1;
        if (this.options.resetOnPlay) {
            for (var i = 0; i < this.animators.length; i++) {
                this.animators[i].jumpTo(0);
            }
        }
        this.advance();
    },
    // play all animators backwards
    reverse: function() {
        this.forwards = false;
        this.current = this.animators.length;
        if (this.options.resetOnPlay) {
            for (var i = 0; i < this.animators.length; i++) {
                this.animators[i].jumpTo(1);
            }
        }
        this.advance();
    },
    // if we have just play()'d, then call reverse(), and vice versa
    toggle: function() {
        if (this.forwards) {
            this.seekTo(0);
        } else {
            this.seekTo(1);
        }
    },
    // internal: install an event listener on an animator's onComplete option
    // to trigger the next animator
    listenTo: function(animator) {
        var oldOnComplete = animator.options.onComplete;
        var _this = this;
        animator.options.onComplete = function() {
            if (oldOnComplete) oldOnComplete.call(animator);
            _this.advance();
        };
    },
    // play the next animator
    advance: function() {
        if (this.forwards) {
            if (this.animators[this.current + 1] == null) return;
            this.current++;
            this.animators[this.current].play();
        } else {
            if (this.animators[this.current - 1] == null) return;
            this.current--;
            this.animators[this.current].reverse();
        }
    },
    // this function is provided for drop-in compatibility with Animator objects,
    // but only accepts 0 and 1 as target values
    seekTo: function(target) {
        if (target <= 0) {
            this.forwards = false;
            this.animators[this.current].seekTo(0);
        } else {
            this.forwards = true;
            this.animators[this.current].seekTo(1);
        }
    }
};
function createOpacityAnimation (container, transitionOptions, timeInterval) {
	var events = {
		"onComplete": function () { },
		"onStart": function () { }
	};
	var items = container.children;
	var activeIndex = 0;
	var animating = false;
	
	if (!timeInterval) {
		timeInterval = 4000;
	}
	
	if (transitionOptions === undefined) {
		transitionOptions = {};
	}
	
	
	var goToIndex = function (i) {
		if (animating === false && i !== activeIndex) {
			animating = true;
			
			var from = items[activeIndex];
			var to = items[i];
			
			from.style.zIndex = 2;
			to.style.zIndex = 1;
			
			setAlpha(from, 100);
			setAlpha(to, 100);
			
			from.style.visibility = '';
			to.style.visibility = '';
			
			events['onStart'](i, activeIndex);
			
			transitionOptions['onComplete'] = function () {
				activeIndex = i;
				onComplete(timeInterval);
			};
			
			var a = new Animator(transitionOptions);
				a.addSubject(function (r) {
					setAlpha(from, (100 - (100 * r)));
				});
				a.play();
		}
	};
	
	var onComplete = function (time) {
		for (var i = 0; i < items.length; i ++) {
			var active = (i === activeIndex);
			
			items[i].style.visibility = (active)? "" : "hidden";
			setAlpha(items[i], (active? 100 : 0));
			
			items[i].style.zIndex = 1;
		}
		
		animating = false;
		events['onComplete']();
		setTimer(time);
	};
	
	var timer;
	var setTimer = function (time) {
		clearTimer();
		
		timer = window.setTimeout(function () {
			goNext();
		}, time);
	};
	
	var clearTimer = function () {
		if (timer !== undefined) {
			window.clearTimeout(timer);
			timer = undefined;
		}
	};
	
	var goNext = function () {
		var i = activeIndex;
			i ++;
		if (i === items.length) {
			i = 0;
		}
		
		goToIndex(i);
	};
	
	var goBack = function () {
		var i = activeIndex;
			i --;
		if (i < 0) {
			i = items.length - 1;
		}
		
		goToIndex(i);
	};
	
	var rand = timeInterval * Math.random();
	
	onComplete(rand);
	
	return {
		"getActiveIndex": function () {
			return activeIndex + 0;
		},
		"goToIndex": function (i) {
			goToIndex(i);
		},
		"next": function () {
			return goNext();
		},
		"back": function () {
			return goBack();
		}, 
		"setEvent": function(ev, func) {
			if (events[ev] !== undefined) {
				events[ev] = func;
				return true;
			}
			return false;
		}
	};
};
function createSliderAnimation (container, transitionOptions, timer) {
	var events = {
		"onComplete": function () { }
	};
	var items = container.children;
	var activeIndex = 0;
	var animating = false;
	
	if (!timer) {
		timer = 4000;
	}
	
	if (transitionOptions === undefined) {
		transitionOptions = {
			"duration": 750
		};
	}
	
	
	var goToIndex = function (i, goLeft) {		
		if (animating === false && i !== activeIndex) {
			animating = true;
			
			var from = items[activeIndex];
			var to = items[i];
			
			from.style.visibility = '';
			to.style.visibility = '';
			
			to.style.marginLeft = 9999 + "px";
			to.style.zIndex = 2;
			
			if (goLeft === undefined) {
				goLeft = (i > activeIndex);
			}
			
			transitionOptions['onComplete'] = function () {
				activeIndex = i;
				onComplete(timer);
			};
			
			var a = new Animator(transitionOptions);
				a.addSubject(function (r) {
					var toWidth = to.offsetWidth;
					
					var left = toWidth * (1 - r);
					if (!goLeft) {
						left *= -1;
					}
					
					to.style.marginLeft = left + "px";
				});
				a.play();
				
		}
	};
	
	var onComplete = function (time) {
		for (var i = 0; i < items.length; i ++) {
			var active = (i === activeIndex);
			
			items[i].style.visibility = (active)? "" : "hidden";
			items[i].style.zIndex = 1;
		}
		
		animating = false;
		events['onComplete']();
		setTimer(time);
	};
	
	var i;
	var setTimer = function (time) {
		clearTimer();
		
		i = window.setTimeout(function () {
			goNext(true);
		}, time);
	};
	
	var clearTimer = function () {
		if (i !== undefined) {
			window.clearTimeout(i);
			i = undefined;
		}
	};
	
	var goNext = function (goLeft) {
		var i = activeIndex;
			i ++;
		if (i === items.length) {
			i = 0;
		}
		
		goToIndex(i, goLeft);
	};
	
	var goBack = function () {
		var i = activeIndex;
			i --;
		if (i < 0) {
			i = items.length - 1;
		}
		
		goToIndex(i);
	};
	
	var rand = 4000 * Math.random();
	
	onComplete(rand);
	
	return {
		"getActiveIndex": function () {
			return activeIndex + 0;
		},
		"goToIndex": function (i) {
			goToIndex(i);
		},
		"next": function () {
			return goNext();
		},
		"back": function () {
			return goBack();
		}, 
		"setEvent": function(ev, func) {
			if (events[ev] !== undefined) {
				events[ev] = func;
				return true;
			}
			return false;
		}
	};
};
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

var isSlowBrowser = ((BrowserDetect.browser == "Explorer")? (BrowserDetect.version < 9) : false);
function createMonthArray (month, year) {
	var a = [];
	
	var startDay = 0;
	var endDay = 6;
	
	var nextMonth = month + 1;
	if (nextMonth === 13) 
		{ nextMonth = 1; }
	
	var currentDate = new Date(year, month - 1, 1);
	while (currentDate.getDay() !== startDay) {
		currentDate.setDate(currentDate.getDate() - 1);
	}
	
	
	while (currentDate.getMonth() !== (nextMonth - 1)) {
		a.push(currentDate.getTime());
		
		currentDate.setDate(currentDate.getDate() + 1);
	}
	
	while (currentDate.getDay() !== startDay) {
		a.push(currentDate.getTime());
		
		currentDate.setDate(currentDate.getDate() + 1);
	}
	
	return a;
}
function element (appendTo, type) {
	var e = document.createElement(type);
		appendTo.appendChild(e);
		
	return e;
};

function createInput (appendTo, type) {
	var e = document.createElement("input");
		e.type = type;
		
		appendTo.appendChild(e);
		
	return e;
};

function createScroll (appendTo, scrollChange) {
	if (scrollChange === undefined)
		{ scrollChange = function () { }; }
		
	var container = element(appendTo, "div" );
		container.className = 'scrollContainer';
	
	var overflow = element(container, "div");
		overflow.className = 'scrollContentContainer';
		
	var content = element(overflow, "div");
		content.className = 'scrollContent';
		
	var html = element(content, "div");
			
	if (!navigator.userAgent.match(/iPhone|iPad|Android/)) {
		content.style.right = '-17px';
	}
		
	var bar = element(container, "div");
		bar.className = 'scrollBar';
	
	var barSlider = element(bar, "div");
		barSlider.className = 'scrollBarSlider';
		
	
	var startPoint;
	bar.onmousedown = function (e) {
		e = (e || window.event);
		
		startPoint = {
			"clientY": e.clientY,
			"startPos": parseFloat(barSlider.style.top)
		};
		
		return false;
	};
	
	events.mouseMove.addEvent(function (e) {
		e = (e || window.event);
		if (startPoint !== undefined) {
			var pos = e.clientY - startPoint.clientY;
			
			var newSliderPos = startPoint.startPos + pos;
			var maxHeight = bar.offsetHeight - barSlider.offsetHeight;
			
			var r = newSliderPos / maxHeight;
			if (r <= 0)
				{ r = 0; }
			else if (r >= 1)
				{ r = 1; }
			
			setScrollPosRatio(r);
		}
	});
	
	events.mouseUp.addEvent(function () {
		startPoint = undefined;
	});
		
	var setScrollPosRatio = function (r) {
		var height = content.scrollHeight - content.offsetHeight;
		
		content.scrollTop = height * r;
	};
		
	var getScrollPosRatio = function () {
		var position = content.scrollTop;
		var height = content.scrollHeight - content.offsetHeight;
		if (height === 0) 
			{ return 0; }
		
		return position / height;
	};
	
	var getScrollSizeRatio = function () {
		var maskHeight = content.offsetHeight;
		if (maskHeight === 0)
			{ return 0; }
		var contentHeight = html.offsetHeight;
		if (contentHeight === 0)
			{ return 1; }
		
		
		
		var r = maskHeight / contentHeight;
		if (r > 1)
			{ r = 1; }
		return r;
	};
	
	var onUpdate = function () {
		var barHeight = bar.offsetHeight;
		
		bar.style.visibility = ((scrollSize === 1)? "hidden" : "");
		
		barSlider.style.height = (barHeight * scrollSize) + "px";
		
		var top = ((barHeight - barSlider.offsetHeight) * scrollPos);
		
		barSlider.style.top = top + "px";
	};
		
	var scrollPos = getScrollPosRatio();
	var scrollSize = getScrollSizeRatio();
	
	window.setInterval(function () {
		var _scrollPos = getScrollPosRatio();
		var _scrollSize = getScrollSizeRatio();
		
		var changed = false;
		if (_scrollPos !== scrollPos) {
			scrollPos = _scrollPos;
			changed = true;
		}
		
		if (_scrollSize !== scrollSize) {
			scrollSize = _scrollSize;
			changed = true;
		}
		
		
		if (changed) {
			onUpdate();
			scrollChange(content.scrollTop);
		}
		
	}, 30);
	
	onUpdate();
		
	return html;
};
(
	new function () {
		var obj = function (el, onChange) {
			var timer;
			var self = this;
			
			this.init = function () {
				var onchange = function () {
					self.setTimer();
				};
				
				el.onkeyup = onchange;
				el.onkeydown = onchange;
			};
			
			this.setTimer = function () {
				if (timer ) {
					window.clearTimeout(timer);
				}
				
				timer = window.setTimeout(function () {
					onChange();
				}, 500);
			};
			
			this.init();
		};
		
		
		window.createInputTimerChange = function (input, change) {
			new obj(input, change);
		};
	}()
);
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className) {// Get a list of all elements in the document
	    // For IE    
	    if (document.all) {
	        var allElements = document.all;
	    } else {
	        var allElements = document.getElementsByTagName("*");
	    }
	 
	    // Empty placeholder to put in the found elements with the class name
	    var foundElements = [];  
	 
	    for (var i = 0, ii = allElements.length; i < ii; i++) {
	        if (allElements[i].className == className) {
	            foundElements[foundElements.length] = allElements[i];
	        }
	    }
	 
	    return foundElements;
	 
	};
};

function getElementsByClassName (el, className) {
	if (el.getElementsByClassName !== undefined) {
		return el.getElementsByClassName(className);
	}
	else {
		var a = [];
		
		var allEl = el.all;
		for (var i = 0; i < allEl.length; i++) {
			var split = allEl[i].className.split(" ");
			for (var i2 = 0; i2 < split.length; i2++) {
				if (split[i2] === className) {
					a.push(allEl[i]);
					break;
				}
			}
		}
		
		return a;
	}
};

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
};
Date.prototype.getRealMonth = function() {
    return this.getMonth() + 1;
};
Date.prototype.setRealMonth = function(month) {
    return this.setMonth((month -1));
};
/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

var events = {};
function customEvent () {
	var a = [];
	this.addEvent = function(func) {
		a.push(func);
	};
	
	this.delEvent = function (func) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] === func) {
				a.splice(i, 1);
				break;
			}
		}
		return true;
	};
	
	this.callEvent = function (a1, a2, a3, a4, a5, a6, a7, a8, a9) {
		for (var i = 0; i < a.length; i++) { 
			a[i](a1, a2, a3, a4, a5, a6, a7, a8, a9); 
		}
		return i;
	};
};
(
	new function () {
		var ev = {
			"mouseUp": "onmouseup",
			"mouseMove": "onmousemove",
			"mouseDown": "onmousedown"
		};
		
		var closure = function (key, ev) {
			window.events[key] = new customEvent();
			
			document.body[ev] = function (e) {
				e = (e || window.event);
				if (window.events[key] !== undefined) {
					window.events[key].callEvent(e);
				}
			};
		};
		
		for (var i in ev) 
			{ closure(i, ev[i]); }
	}()
);
(
    new function () {
        var ev  = new customEvent();
		
        window.setInterval(function () {
            ev.callEvent();
        }, 30);
		
        window.events.update = ev;	
    }()
);

(
	new function () {
		var ev  = new customEvent();
            ev.getUriSegments = function () {
                var parts = getStr().split("&");
                
                var obj = {};
                for (var i = 0; i < parts.length; i++) {
                    var split = parts[i].split("=");
                    
                    obj[split[0]] = decodeURIComponent(split[1]);
                }
                return obj;
            };
            ev.getUriSegmentCount = function () {
                var parts = this.location.split("&");
                
                return parts.length;
            };
            ev.createUriSegmentUrl = function (obj) {
                var uri = [];
                for (var i in obj) {
                    if (i !== "" && obj[i] !== "") {
                        uri.push(i + "=" + encodeURIComponent(obj[i]));
                    }
                }
                return "#" + uri.join("&");
            };
            ev.getUriSegment = function (key) {
                var segments = this.getUriSegments();
                
                return segments[key];
            };
            ev.setUriSegment = function (key, value) {
                var segments = this.getUriSegments();
                
                segments[key] = value;
                
                ev.setLocation(this.createUriSegmentUrl(segments));
            };
            ev.setUriSegments = function (obj) {
            	var segments = this.getUriSegments();
                
                for (var key in obj) 
                	{ segments[key] = obj[key]; }
                
                ev.setLocation(this.createUriSegmentUrl(segments));
            };
            ev.setLocation = function (location) {
            	if (ev.location === location.substr(1)) {
            		callChange();
            	}
            	else {
            		window.location = location;
            	}
            };
                
		var getStr = function () {
			var str = window.location.toString().split("#")[1];
			
			return ((str === undefined)? "" : str);
		};
		
		var callChange = function () {
			ev.callEvent(ev.location);
		};
		
		ev.location = getStr();
		window.events.update.addEvent(function () {
			var str = getStr();
			if (str !== ev.location) {
				ev.location = str;
				
				callChange();
			}
		});
		
		
		window.events.urlChange = ev;	
	}()
);
function setChildIndex (el, index) {
	var parent = el.parentNode;
	
	if (index < 0)
		{ index = 0; }
	var prevChild = parent.children[index];
	
	if (prevChild === undefined) 
		{ parent.insertBefore(el, prevChild); }
	else 
		{ parent.appendChild(el); }
	return true;
}

function getChildIndex (el) {
	//currently only for tables!
	return el.rowIndex;
}

function get_selection(e) {

    //Mozilla and DOM 3.0
    if('selectionStart' in e)
    {
        var l = e.selectionEnd - e.selectionStart;
        return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
    }
    //IE
    else if(document.selection)
    {
        e.focus();
        var r = document.selection.createRange();
        var tr = e.createTextRange();
        var tr2 = tr.duplicate();
        tr2.moveToBookmark(r.getBookmark());
        tr.setEndPoint('EndToStart',tr2);
        if (r == null || tr == null) return { start: e.value.length, end: e.value.length, length: 0, text: '' };
        var text_part = r.text.replace(/[\r\n]/g,'.'); //for some reason IE doesn't always count the \n and \r in the length
        var text_whole = e.value.replace(/[\r\n]/g,'.');
        var the_start = text_whole.indexOf(text_part,tr.text.length);
        return { start: the_start, end: the_start + text_part.length, length: text_part.length, text: r.text };
    }
    //Browser not supported
    else return { start: e.value.length, end: e.value.length, length: 0, text: '' };
}
(
	new function () {
		var count = 0;
		window.getTargetId = function () {
			count++;
			
			return "uniqueTargetId" + count;
		};
	}
)

if (document.all) {
	function setAlpha (dom, value) {
		dom.style.filter = 'alpha(opacity =' + value + ')';
	};
}
else {
	function setAlpha (dom, value) {
		dom.style.opacity = value * .01;
	};
}
function targetIsLink (e) {
	var srcElement = e.srcElement || e.target;

        while(srcElement !== document.body) {
            if (srcElement.tagName === "A") 
                { return true; }
            srcElement = srcElement.parentNode;
        }
        
        
	return false;
};

function getFieldPath (myPath, fieldPath) {
	var a = [];
	
	var newPath = fieldPath.split("/");
	
	if (newPath[0] === "") {
		a = newPath;
	}
	else {
		a = myPath.split("/").slice(0, -1);
		
		for (var i = 0; i < newPath.length; i++) {
			if (newPath[i] === "." || newPath[i] === "") 
				{ }
			else if (newPath[i] === "..") 
				{ a = a.slice(0, -1); }
			else {
				a.push(newPath[i]);
			}
		}
	}
	return a.join("/");
};

function htmlspecialchars (string, quote_style, charset, double_encode) {
  // http://kevin.vanzonneveld.net
  // +   original by: Mirek Slugen
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Nathan
  // +   bugfixed by: Arno
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Ratheous
  // +      input by: Mailfaker (http://www.weedem.fr/)
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +      input by: felix
  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: charset argument not supported
  // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
  // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
  // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
  // *     returns 2: 'ab"c&#039;d'
  // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
  // *     returns 3: 'my &quot;&entity;&quot; is still here'
  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined' || quote_style === null) {
    quote_style = 2;
  }
  string = string.toString();
  if (double_encode !== false) { // Put this first to avoid double-encoding
    string = string.replace(/&/g, '&amp;');
  }
  string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      }
      else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/'/g, '&#039;');
  }
  if (!noquotes) {
    string = string.replace(/"/g, '&quot;');
  }

  return string;
}

function str_replace (str, obj) {
	for (var i in obj) {
		str = str.split(i).join(obj[i]);
	}
	return str;
}

function cloneObject(obj) {
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); // changed (twice)
    for(var key in obj)
        temp[key] = cloneObject(obj[key]);

    return temp;
}
function compareObjects(v1, v2) {
	var type1 = typeof(v1);
	
	if (type1 !== typeof(v2)) {
		return false;
	}
	else if (type1 === "function") {
		return v1.toString() === v2.toString();
	}
	else if (type1 === "object") {
		var KeyCount = 0;
		
		for (var i in v1) { 
			KeyCount++;
		}
		
		for (var i in v2) {
			if (KeyCount === 0) 
				{ return false; }
			else if (compareObjects(v1[i], v2[i]) === false) 
				{ return false; }
			KeyCount--; 
		}
		
		if (KeyCount !== 0)
			{ return false; }
			
		return true;
	}
	return (v1 === v2);
}
function object_get_key_number (a, k) {
	var c = 0;
	for (var i in a) {
		if (i === k) 
			{ return c; }
		c++;
	}
	return -1;
}

function htmlEntities(str) {
	var val = str;
	if (val !== null) 
		{ val = str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    return val;
}
function uploadRectangle (appendTo, url, width, height) {
	var self = this;
	var form;
	this.init = function () {
		var container = element(appendTo, "div");
			container.className = "uploadRectangle";
		
		var id = getTargetId();
		var formId = id + "Form";
		
		var uri = url;
		
		var styles = [];
			styles.push('width:' + width + "px");
			styles.push('height:' + height + "px");
			styles.push('overflow: hidden');
		
		var html = [];
		
		html.push('<form enctype="multipart/form-data" action="' + uri + '" target="' + id + '" id="' + formId + '" method="post" style="' + styles.join("; ") + ';">');
			
  		html.push('<input type="file" size="50000" style="font-size:50000px; cursor:pointer; width:100%; display:block;" name="file">');
			 
		html.push('</form>');
		
		html.push('<iframe name="' + id + '" id="' + id + '" class="loadIframe"></iframe>');
		
		container.innerHTML = html.join("");
		
		var frame = document.getElementById(id);
		
		var getContent = function () {
			return frame.contentWindow.document.body.innerHTML;
		};
		
		frame.onload = function () {
			var c = getContent(); 
			if (c !== '') 
				{ self.onload(c); }
			form.reset(); 
		};
		
		form = document.getElementById(formId);
		form['file'].onchange = function () {
			if (this.value !== "") {
				self.onstart(); 
				
				var frameFallBack = true;
				if (XMLHttpRequest) {
					var xhr = new XMLHttpRequest();
					if (this.files !== undefined && xhr.upload) {
						var file = this.files[0];
						
						xhr.open("POST", form.action, true);
						
						var formData = new FormData();
							formData.append("file", file);
							
							
						xhr.upload.onprogress = function(e) {
					        var done = e.position || e.loaded, total = e.totalSize || e.total;
					        
					        self.onprogress(done/total);
					    };
					    
					    xhr.onreadystatechange = function () {
							if(xhr.readyState == 4) {
								if (xhr.status == 200) 
									{ self.onload(xhr.responseText); form.reset(); }
								else if (xhr.status !== 0)
									{ self.onerror(); }
							}
						};
						
						xhr.send(formData);
						
						frameFallBack = false;
					}
				}
				
				if (frameFallBack) {
					form.submit();
				}
			}
			
			
		};
		
		form['file'].onmouseover = function () 
			{ self.onmouseover(); };
		form['file'].onmouseout = function () 
			{ self.onmouseout(); };
	};
	
	this.setWidth = function (w) {
		form.style.width = w + 'px';
	};
	
	this.setHeight = function (h) {
		form.style.height = h + 'px';
	};
	
	this.onload = function () { };
	this.onerror = function () { };
	this.onstart = function () { };
	this.onprogress = function () { };
	this.onmouseover = function () { };
	this.onmouseout = function () { };
	
	this.init();
};



