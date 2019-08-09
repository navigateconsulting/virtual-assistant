function toggleElem() {
    var boxWidth = $("#box").width();
    console.log(boxWidth);
    if(boxWidth > 0) {
        $("#box").hide('slide', {
            direction: 'left'
        }, 300);
    } else {
        $("#box").show('slide', '', 300);
    }
}

function collapseClose(type, index) {
    if (type == 'intent') {
        $('#collapseIntent_' + index).collapse("hide");
    } else if (type == 'response') {
        $('#collapseResponse_' + index).collapse("hide");
    }
}

function adjustScroll() {
    $('.story-box').stop().animate({
        scrollTop: $(".story-box")[0].scrollHeight
    }, 800);
}