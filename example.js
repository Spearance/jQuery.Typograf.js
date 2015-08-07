$(document).ready(function(){
	$("input.typograf").typograf({
		leftQuote: "„",
		rightQuote: "“",
		handler: "#typograf",
		restore: "#restore"
	});
	
	$("textarea.typograf").typograf();

	// just for highlight
	$("textarea.typograf").keyup(function(){
		var text = $(this).val();
		
		text = text
			.replace(/\u00a0/g, "<span class=\"hlg\">&nbsp\;</span>")
			
			.replace(/([…©®™₽×—–„“«»″′])/g, "<span class=\"hlb\">$1</span>")
			
			.replace(/\n{2,}/g, "</p><p>")
			
			.replace(/\n/g, "<br />");
		
		$("#highlighted").empty().html("<p>" + text + "</p>");		
	});
	
	$("#example").click(function(){
		var text = $(this).prev("p").text();
		$(".typograf").val(text);
		$("textarea.typograf").trigger("keyup");
	});
	
});