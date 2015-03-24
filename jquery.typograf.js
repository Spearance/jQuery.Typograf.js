/*
	jQuery.Typograf.js

	https://github.com/Spearance/jQuery.Typograf.js
	http://www.typograf.ru/

	Copyright 2015, Evgeniy Lepeshkin

	Released under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

	Version: v 0.1
	Date: Thu Mar 24, 2015
 */

(function($){
	$.fn.typograf = function(options){
		var options = $.extend({
			leftQuote: "«",
			rightQuote: "»",
			handler: "",
			restor: ""
	  	}, options);

		return this.each(function(){
			var $this = $(this),
				obj = $this.get(0),
				exclude = false,
				caretPosition = 0;
			
			// exist Typograf handler
			if(options.handler){
				var original = "";
				$(options.handler).click(function(){
					if(original == ""){
						original = $this.val();
					}
					if(original){
						if(options.restore){
							$(options.restore).removeAttr("disabled");
						}
						typograf($this);
					}
				});

				// exist Restore handler
				if(options.restore){
					//var original = $this.val(); 
					$(options.restore).click(function(){
						$(this).attr("disabled", "true");
						$this.val(original);
					});
				}
			} else {
				// auto
				$this.keydown(function(e){
					// exclude Ctrl/⌘
					if(e.metaKey || e.ctrlKey){
						exclude = true;
					} else {
						exclude = false;
					}
				}).keyup(function(e){
					// exclude arrows and Ctrl/⌘ + A/C/V/X/Z
					if(
						e.which != "37" && e.which != "38" && e.which != "39" && e.which != "40" && 
						!(exclude && (e.which == "65" || e.which == "67" || e.whitch == "86" || e.whitch == "88" || e.whitch == "90"))
					){
						typograf($this);
					}
					return true;
				});
			}

			function typograf(textField){
				caretPosition = getCaretPosition(obj);

				var r = textField.val().replace(/(^|\n|\s|>)\-(\s)/g,"$1—$2");
				r = r.replace(/\-{2} /g, function(){
					caretPosition -= 1;
					return "— ";
				});
				r = r.replace(/<!—/ig,function(){
					caretPosition += 1;
					return "<!--";
				});
				r = r.replace(/(\d)( )?[-—]( )?(\d)/g, function(str, $1, $2, $3, $4){
					if($2 == " "){ caretPosition = caretPosition - 1 };
					if($3 == " "){ caretPosition = caretPosition - 1 };
					return $1 + "–" + $4;
				});
				r = r.replace(/\([cс]\)/ig, function(){
					caretPosition -= 2;
					return "©";
				});
				r = r.replace(/\(r\)/ig, function(){
					caretPosition -= 2;
					return "®";
				});
				r = r.replace(/\(tm\)/ig, function(){
					caretPosition -= 2;
					return "™";
				});
				r = r.replace(/\([рp]\)/ig,	function(){
					caretPosition -= 2;
					return "₽";
				});
				r = r.replace(/\.{3}/g, function(){
					caretPosition -= 2;
					return "…";
				});
				r = r.replace(/(\d)[xх](\d)/ig,"$1×$2");
				r = r.replace(/\"([a-zа-я0-9…])/ig, options.leftQuote + "$1");
				r = r.replace(/([a-zа-я0-9…?!])\"/ig,"$1" + options.rightQuote);
				var re = new RegExp("\"(" + options.leftQuote + "[a-zа-я0-9…])","ig");
				r = r.replace(re, options.leftQuote + "$1");
				var re = new RegExp("([a-zа-я0-9…?!]" + options.rightQuote + ")\"","ig");
				r = r.replace(re,"$1" + options.rightQuote);
				var re = new RegExp("([-a-z0-9]+=)[" + options.leftQuote + options.rightQuote + "]([^" + options.leftQuote + options.rightQuote + "]*?)","ig");
				r = r.replace(re, "$1\"$2");
				var re = new RegExp("([-a-z0-9]+=)[\"]([^" + options.leftQuote + options.rightQuote + "]*?)[" + options.leftQuote + options.rightQuote + "]","ig");
				r = r.replace(re, "$1\"$2\"");
				 
				textField.val(r);

				if(!exclude){
					setCaretPosition(obj, caretPosition);
				}
			}

		});

		function getCaretPosition(ctrl){
			var CaretPos = 0;	// IE Support
			if (document.selection) {
				ctrl.focus();
				var Sel = document.selection.createRange();
				Sel.moveStart('character', -ctrl.value.length);
				CaretPos = Sel.text.length;
			}
			// Firefox support
			else if (ctrl.selectionStart || ctrl.selectionStart == '0')
				CaretPos = ctrl.selectionStart;
			return (CaretPos);
		}

		function setCaretPosition(ctrl, pos){
			if(ctrl.setSelectionRange){
				ctrl.focus();
				ctrl.setSelectionRange(pos,pos);
			} else if (ctrl.createTextRange) {
				var range = ctrl.createTextRange();
				range.collapse(true);
				range.moveEnd("character", pos);
				range.moveStart("character", pos);
				range.select();
			}
		}
	};
})(jQuery);