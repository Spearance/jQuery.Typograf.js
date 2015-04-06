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
		options = $.extend({
			leftQuote: "«",
			rightQuote: "»",
			handler: "",
			restor: ""
		}, options);

		return this.each(function(){
			var $this = $(this),
			    obj = $this.get(0),
			    exclude = false,
			    selected = false,
			    caretPosition = 0,
			    original;

			// exist Typograf handler
			if (options.handler) {
				original = "";

				$(options.handler).click(function(){
					if (original == "") {
						original = $this.val();
					}

					if (original) {
						if (options.restore) {
							$(options.restore).removeAttr("disabled");
						}
						typograf($this);
					}
				});

				// exist Restore handler
				if (options.restore) {
					$(options.restore).click(function(){
						$(this).attr("disabled", "true");
						$this.val(original);
					});
				}
			} else {
				// auto
				$this
					.keydown(function(e){
						// check for Ctrl/⌘
						exclude = Boolean(
							(e.metaKey || e.ctrlKey) &&
							!(e.altKey && e.ctrlKey) // Do not exclude Alt Gr

						);
					})
					.keyup(function(e){
						// check for selected text
						selected = Boolean(getSelectionText() != "");

						// exclude arrows and Ctrl/⌘ + A/C/V/X/Z
						if (
							// home, end, page up, page down
							e.which != "33" &&
							e.which != "34" &&
							e.which != "35" &&
							e.which != "36" &&

							// arrows
							e.which != "37" &&
							e.which != "38" &&
							e.which != "39" &&
							e.which != "40" &&

							// single Shift
							e.which != "16" &&

							// select all, copy, paste, cut, undo
							!(exclude && (e.which == "65" ||
							              e.which == "67" ||
							              e.which == "86" ||
							              e.which == "88" ||
							              e.which == "90")) &&

							// selected text
							!selected
						){
							typograf($this);
						}
						return true;
					}
				);
			}

			function typograf (textField){
				var text = textField.val();
				caretPosition = getCaretPosition(obj);

				text = text
					// Dash
					.replace(/(^|\n|\s|>)\-(\s)/g, "$1—$2")

					// Double hyphen
					.replace(/\-{2} /g, function(){
						caretPosition--;
						return "— ";
					})

					// Multiple nbsp
					.replace(/ {2,}| \s|\s /g, function(str){
						caretPosition -= str.length - 1;
						return " ";
					})

					// HTML-comment
					.replace(/<!—/ig, function(){
						caretPosition++;
						return "<!--";
					})

					// Numerical interval
					.replace(/(\d)( )?[-—]( )?(\d)/g, function(str, $1, $2, $3, $4){
						if ($2 == " ") { caretPosition-- }
						if ($3 == " ") { caretPosition-- }
						return $1 + "–" + $4;
					})

					// Copyright
					.replace(/\([cс]\)/ig, function(){
						caretPosition -= 2;
						return "©";
					})

					// Registered trademark
					.replace(/\(r\)/ig, function(){
						caretPosition -= 2;
						return "®";
					})

					// Trademark
					.replace(/\(tm\)/ig, function(){
						caretPosition -= 2;
						return "™";
					})

					// Rouble
					.replace(/\([рp]\)/ig, function(){
						caretPosition -= 2;
						return "₽";
					})

					// Three dots
					.replace(/\.{3}/g, function(){
						caretPosition -= 2;
						return "…";
					})

					// Sizes
					.replace(/(\d)[xх](\d)/ig, "$1×$2")

					// Open quote
					.replace(/\"([a-zа-я0-9…])/ig,
					         options.leftQuote + "$1")

					// Close quote
					.replace(/([a-zа-я0-9…?!])\"/ig,
					         "$1" + options.rightQuote)

					// Open quote
					.replace(new RegExp("\"(" + options.leftQuote + "[a-zа-я0-9…])", "ig"),
					         options.leftQuote + "$1")

					// Close quote
					.replace(new RegExp("([a-zа-я0-9…?!]" + options.rightQuote + ")\"", "ig"),
					         "$1" + options.rightQuote)

					// Fix HTML open quotes
					.replace(new RegExp("([-a-z0-9]+=)" +
					                    "["   + options.leftQuote + options.rightQuote + "]" +
					                    "([^" + options.leftQuote + options.rightQuote + "]*?)", "ig"),
					         "$1\"$2")

					// Fix HTML close quotes
					.replace(new RegExp("([-a-z0-9]+=)[\"]" +
					                    "([^" + options.leftQuote + options.rightQuote + "]*?)" +
					                    "["   + options.leftQuote + options.rightQuote + "]", "ig"),
					         "$1\"$2\"");

				textField.val(text);

				if (!exclude) {
					setCaretPosition(obj, caretPosition);
				}
			}

		});

		function getCaretPosition(ctrl) {
			var CaretPos = 0, // IE Support
			    Sel;

			if (document.selection) {
				ctrl.focus();
				Sel = document.selection.createRange();
				Sel.moveStart('character', -ctrl.value.length);
				CaretPos = Sel.text.length;
			}

			// Firefox support
			else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
				CaretPos = ctrl.selectionStart;
			}

			return CaretPos;
		}

		function setCaretPosition(ctrl, pos){
			if (ctrl.setSelectionRange) {
				ctrl.focus();
				ctrl.setSelectionRange(pos, pos);
			} else if (ctrl.createTextRange) {
				var range = ctrl.createTextRange();
				range.collapse(true);
				range.moveEnd("character", pos);
				range.moveStart("character", pos);
				range.select();
			}
		}

		function getSelectionText(){
			var t = "";

			if (window.getSelection) {
				t = window.getSelection();
			} else if (document.getSelection) {
				t = document.getSelection();
			} else if (document.selection) {
				t = document.selection.createRange().text;
			}

			return t;
		}
	};
})(jQuery);