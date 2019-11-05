function unhighlightText(text_id) {
    var inputText = document.getElementById(text_id);
    var innerHTML = text = inputText.innerHTML;
    var newString = stripHtml(innerHTML);
    inputText.innerHTML = newString;
}
function highlightText(text_id, start, end) {
    var inputText = document.getElementById(text_id);
    var innerHTML = text = inputText.textContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    innerHTML = innerHTML.substring(0,start) + "<span class='highlight'>" + innerHTML.substring(start,end) + "</span>" + innerHTML.substring(end,text.length);
    inputText.innerHTML = innerHTML;
}

function selectText(event) {
    selection = window.getSelection();
    if (selection.getRangeAt(0).startOffset === selection.getRangeAt(0).endOffset) {
        return 0
    } else {
        var inputText = document.getElementById(event.target.id);
        var innerHTML = text = inputText.textContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        selected_text = innerHTML.substring(selection.getRangeAt(0).startOffset,selection.getRangeAt(0).endOffset);
        var entity = {"start": selection.getRangeAt(0).startOffset, "end": selection.getRangeAt(0).endOffset, "value": selected_text, "text_id": event.target.id}
        return entity;
    }
}

function toggleIntentEntity(intent_text_index) {
    setTimeout(function(){ 
        var id = 'intentText_' + intent_text_index;
        $('#' + id).collapse("toggle");
    }, 100);
}

function stripHtml(html){
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}