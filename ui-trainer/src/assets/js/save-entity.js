function adjustEntityScroll() {
    $('.entity-chip').stop().animate({
        scrollTop: $(".entity-chip")[0].scrollHeight
    }, 800);
}