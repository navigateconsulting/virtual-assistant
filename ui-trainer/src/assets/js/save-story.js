function save_diagram(element) {
    var diagram_id = $(element).attr('id');
    var conversation = {'story_file': [{'story_name': 'story_1', 'story_data': []}]};
    var story_file = conversation['story_file'][0];
    var index = 0;
    var utterance = 0;
    var response = 0;
    var resp_recv_flag = 0;
    var old_index = index;
    var prev_component = 0;
    var curr_component = 0;
    $('#' + diagram_id).children('g').each(function () {
        if (old_index == index) {
            story_file['story_data'][index] = {'utterance_key': '', 'utterance_value': '', 'utterance_response': []};
        }
        if($(this).attr('id').indexOf("process") >= 0) {
            curr_component = 1;
            if (prev_component == curr_component) {
                index += 1;
                story_file['story_data'][index] = {'utterance_key': '', 'utterance_value': '', 'utterance_response': []};
            }
            utterance += 1;
            story_file['story_data'][index]['utterance_key'] = 'utterance_'+utterance;
            story_file['story_data'][index]['utterance_value'] = $(this).children().children()[2].textContent;
        }
        if($(this).attr('id').indexOf("Rectangle") >= 0) {
            curr_component = 2;
            response += 1;
            if (prev_component == curr_component) {
                story_file['story_data'].splice(index, 1);
                index -= 1;
                story_file['story_data'][index]['utterance_response'].push({'response_key': 'response_'+response, 'response_value': $(this).children().children()[2].textContent});
            } else {
                story_file['story_data'][index]['utterance_response'].push({'response_key': 'response_'+response, 'response_value': $(this).children().children()[2].textContent});
            }
            resp_recv_flag = 1;
        }
        if (resp_recv_flag == 1) {
            index += 1;
            old_index = index;
            resp_recv_flag = 0;
        } else {
            old_index += 1;
        }
        prev_component = curr_component;
    });
    console.log(conversation);
    return conversation;
}

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