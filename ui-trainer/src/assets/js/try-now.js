function adjustTryNowScroll() {
    $('.user-bot-chat').stop().animate({
        scrollTop: $(".user-bot-chat")[0].scrollHeight
    }, 800);
}