function adjustTryNowScroll() {
    $('.user-bot-chat').stop().animate({
        scrollTop: $(".user-bot-chat")[0].scrollHeight
    }, 800);
}

function changeRowBackgroundColor(chatRowIndex) {
    $('.action-message').css('background', 'white');
    $('.user-message').css('background', 'white');
    $('.bot-message').css('background', 'white');
    for (var i=0;i<=chatRowIndex;i++) {
        $('#chat-' + i).css('background', '#EEE');
    }
}