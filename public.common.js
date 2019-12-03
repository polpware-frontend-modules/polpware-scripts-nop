/*
** nopCommerce custom js functions
*/

function OpenWindow(query, w, h, scroll) {
    var l = (screen.width - w) / 2;
    var t = (screen.height - h) / 2;

    winprops = 'resizable=0, height=' + h + ',width=' + w + ',top=' + t + ',left=' + l + 'w';
    if (scroll) winprops += ',scrollbars=1';
    var f = window.open(query, "_blank", winprops);
}

function setLocation(url) {
    window.location.href = url;
}

function displayAjaxLoading(display) {
    if (display) {
        $('.ajax-loading-block-window').show();
    }
    else {
        $('.ajax-loading-block-window').hide('slow');
    }
}

function displayPopupNotification(message, messagetype, modal) {
    //types: success, error, warning
    var containerId;
    if (messagetype == 'success') {
        //success
        containerId = 'notifications-success';
    }
    else if (messagetype == 'error') {
        //error
        containerId = 'notifications-error';
    }
    else if (messagetype == 'warning') {
        //warning
        containerId = 'notifications-warning';
    }
    else {
        //other
        containerId = 'notifications-success';
    }

    var isModal = (modal ? true : false);
    containerId = (isModal ? '#dialog-' : '#inline-') + containerId;

    var container = $(containerId);

    //we do not encode displayed message
    var htmlcode = '';
    if ((typeof message) == 'string') {
        htmlcode = '<p>' + message + '</p>';
    } else {
        for (var i = 0; i < message.length; i++) {
            htmlcode = htmlcode + '<p>' + message[i] + '</p>';
        }
    }

    container.find('.msg-content').html(htmlcode);

    if (isModal) {
        container.modal('show');
    } else {
        container.show();
        container.children().first().alert();
    }
}
function displayPopupContentFromUrl(url, title, modal, width) {
    var isModal = (modal ? true : false);
    var targetWidth = (width ? width : 550);
    var maxHeight = $(window).height() - 20;

    $('<div></div>').load(url)
        .dialog({
            modal: isModal,
            position: ['center', 20],
            width: targetWidth,
            maxHeight: maxHeight,
            title: title,
            close: function(event, ui) {
                $(this).dialog('destroy').remove();
            }
        });
}

var barNotificationTimeout;
function displayBarNotification(message, messagetype, timeout) {
    clearTimeout(barNotificationTimeout);

    //types: success, error, warning
    var cssclass = 'success';
    if (messagetype == 'success') {
        cssclass = 'success';
    }
    else if (messagetype == 'error') {
        cssclass = 'error';
    }
    else if (messagetype == 'warning') {
        cssclass = 'warning';
    }
    //remove previous CSS classes and notifications
    $('#bar-notification')
        .removeClass('success')
        .removeClass('error')
        .removeClass('warning');
    $('#bar-notification .content').remove();

    //we do not encode displayed message

    //add new notifications
    var htmlcode = '';
    if ((typeof message) == 'string') {
        htmlcode = '<p class="content">' + message + '</p>';
    } else {
        for (var i = 0; i < message.length; i++) {
            htmlcode = htmlcode + '<p class="content">' + message[i] + '</p>';
        }
    }
    $('#bar-notification').append(htmlcode)
        .addClass(cssclass)
        .fadeIn('slow')
        .mouseenter(function ()
            {
                clearTimeout(barNotificationTimeout);
            });

    $('#bar-notification .close').unbind('click').click(function () {
        $('#bar-notification').fadeOut('slow');
    });

    //timeout (if set)
    if (timeout > 0) {
        barNotificationTimeout = setTimeout(function () {
            $('#bar-notification').fadeOut('slow');
        }, timeout);
    }
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


// CSRF (XSRF) security
function addAntiForgeryToken(data) {
    //if the object is undefined, create a new one.
    if (!data) {
        data = {};
    }
    //add token
    var tokenInput = $('input[name=__RequestVerificationToken]');
    if (tokenInput.length) {
        data.__RequestVerificationToken = tokenInput.val();
    }
    return data;
};

function showToast(ele, header, body) {
    var $ele = $(ele);
    $ele.find('.toast-header strong').html(header);
    $ele.find('.toast-body').html(body);
    $ele.toast('show');
}

function showCustomBoxModal(target) {
    var config = {
        bounds: 100,
        debounce: 50,
        overlayOpacity: .48,
        overlayColor: '#000000',
        speed: 400,
        type: 'onscroll', // onscroll, beforeunload, hashlink, ontarget, aftersometime
        effect: 'fadein',
        onOpen: function () { },
        onClose: function () { },
        onComplete: function () { }
    };

    var effect = config['effect'];

    if (!target || !$(target).length) return;

    new Custombox.modal(
        {
            content: {
                target: target,
                effect: effect,
                onOpen: function () {
                    config['onOpen'].call($(target));
                },
                onClose: function () {
                    config['onClose'].call($(target));
                },
                onComplete: function () {
                    config['onComplete'].call($(target));
                }
            },
            overlay: {
                color: config['overlayColor'],
                opacity: config['overlayOpacity'],
                speedIn: config['speed'],
                speedOut: config['speed']
            }
        }
    ).open();
}