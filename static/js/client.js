let menuElem = document.getElementById('sweeties');
let titleElem = menuElem.querySelector('.title');

titleElem.onclick = function () {
    menuElem.classList.toggle('open');
};
$(document).ready(function() {
    $('i.fas').click( function(event){
        event.preventDefault();
        $('#myOverlay').fadeIn(297, function(){
            $('#myModal')
                .css('display', 'block')
                .animate({opacity: 1}, 198);
        });
    });

    $('#myModal__close, #myOverlay').click( function(){
        $('#myModal').animate({opacity: 0}, 198,
            function(){
                $(this).css('display', 'none');
                $('#myOverlay').fadeOut(297);
            });
    });
});
$('.ul-shopping-list').on('click','.li-shopping-list',function () {
    $(this).toggleClass('done');
});

$('.ul-shopping-list').on('click','.span-shopping-list',function (event) {
    event.stopPropagation();
    $(this).parent().fadeOut(function () {
        $(this).remove();
    });
});

$('input').keypress(function(event) {
    if(event.which === 13){

        var itemTextInput = $(this).val();
        $(this).val('');
        $('.ul-shopping-list').append('<li class="li-shopping-list">'+ itemTextInput +'<span class="span-shopping-list"><i class="fas fa-backspace"></i></span></li>')
    }
});

$('.h2-for-shopping-list .span-shopping-list').click(function () {
    $('input').fadeToggle();
});