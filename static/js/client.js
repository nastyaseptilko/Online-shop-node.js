let menuElem = document.getElementById('sweeties');
let titleElem = menuElem.querySelector('.title');

titleElem.onclick = function () {
    menuElem.classList.toggle('open');
};
$(document).ready(function () {
    $('i.fas').click(function (event) {
        event.preventDefault();
        $('.myOverlay').fadeIn(297, function () {
            $('.myModal')
                .css('display', 'block')
                .animate({opacity: 1}, 198);
        });
    });

    $('.myModal__close, .myOverlay').click(function () {
        $('.myModal').animate({opacity: 0}, 198,
            function () {
                $(this).css('display', 'none');
                $('.myOverlay').fadeOut(297);
            });
    });


    let chatOpened = false;
    let assistantSocket;

    $('.online-assistant').click(function () {
        if (!chatOpened) {
            chatOpened = true;
            assistantSocket = new WebSocket('ws://localhost:3001/');
            assistantSocket.onmessage = function (event) {
                createNewMessage('agent', event.data);
            };

            assistantSocket.onopen = function() {
                $('.send-message-button').click(function () {
                    const newMessageInput = $('.new-message');
                    const message = newMessageInput.val();
                    newMessageInput.val('');

                    assistantSocket.send(message);
                    createNewMessage('client', message);
                });
            };
        }

        $('.online-assistant').fadeIn(297, function () {
            $('.assistant')
                .css('display', 'block')
                .animate({opacity: 1}, 198);
        });
    });
    $('.assistant-close').click(function () {
        $('.assistant').animate({opacity: 0}, 198,
            function () {
                $(this).css('display', 'none');
            });
    });
    $('.online-assistant').click(function () {
        $(this).removeClass("animated");
    });
});

$('.ul-shopping-list').on('click', '.li-shopping-list', function () {
    $(this).toggleClass('done');
});

$('.ul-shopping-list').on('click', '.span-shopping-list', function (event) {
    event.stopPropagation();
    $(this).parent().fadeOut(function () {
        $(this).remove();
    });
});

$('.input-add-item').keypress(function (event) {
    if (event.which === 13) {

        var itemTextInput = $(this).val();
        $(this).val('');
        $('.ul-shopping-list').append('<li class="li-shopping-list">' + itemTextInput + '<span class="span-shopping-list"><i class="fas fa-backspace"></i></span></li>')
    }
});

$('.h2-for-shopping-list .span-shopping-list').click(function () {
    $('.input-add-item').fadeToggle();
});


function createNewMessage(sender, message) {
    const messageContainer = $('.messages');
    messageContainer.append(`
        <div class="alert alert-primary ${sender}-message" role="alert">
            ${message}
        </div>
    `);
}
