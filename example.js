$(document).ready(function(){
	$("input.typograf").typograf({
		leftQuote: "„",
		rightQuote: "“",
		handler: "#typograf",
		restore: "#restore"
	});
	
	$("textarea.typograf").typograf();
	
	$("#example").click(function(){
		var text = $(this).prev("p").text();
		$(".typograf").val(text);
		$("textarea.typograf").trigger("keyup");
	});
});