(function () {
    var canvas;
    var canvasContext;
    var scale;
    var controlSet;
    var keyCodeTouched = null;
    
    var resizeBuffer = $('<canvas width="128" height="128">')[0];
    var resizeBufferContext = resizeBuffer.getContext('2d');
    disableSmoothing(resizeBufferContext);

    RuneWizard.setDisplay(RuneWizardCanvas);
    
    $(window).resize(function () {
        var availableHeight = $(window).height() - $('#touchControls').height();
        var lesserDimension = Math.min($(window).width(), availableHeight);
        var newScale = 1;
        while ((newScale + 1) * 128 <= lesserDimension) {
            newScale++;
        }
        
        if (newScale != scale) {
            resizeBufferContext.save();
            resizeBufferContext.scale(1 / scale, 1 / scale);
            resizeBufferContext.drawImage(canvas, 0, 0);
            resizeBufferContext.restore();
        
            scale = newScale;
            canvas.width = 128 * scale;
            canvas.height = 128 * scale;
            canvasContext = canvas.getContext('2d');
            canvasContext.scale(scale, scale);
            disableSmoothing(canvasContext);
            canvasContext.drawImage(resizeBuffer, 0, 0);
        }
        
        canvas.style.left = ($(window).width() - canvas.width) / 2 + 'px';
        canvas.style.top = (availableHeight - canvas.height) / 2 + 'px';
    });
    
    function disableSmoothing(context) {
        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
    }

    $(window).load(function () {
        RuneWizard.graphics = $('#graphics')[0];

        canvas = $('canvas')[0];
        $(window).resize();
        
        $(document).keydown(function (event) {
            RuneWizard.display.keyPressed(event.which);
        });
        
        $(document).keyup(function (event) {
            if ('keyReleased' in RuneWizard.display) {
                RuneWizard.display.keyReleased(event.which);
            }
        });
        
        $('.control').on('mousedown touchstart', function (event) {
            event.preventDefault();
            if (typeof $(this).data('keycode') !== 'undefined') {
                $(this).addClass('pressed');
                keyCodeTouched = Canvas[$(this).data('keycode')];
                RuneWizard.display.keyPressed(keyCodeTouched);
            }
        });
        
        $(document).on('mouseup touchend', function () {
            $('#touchControls .control.pressed').removeClass('pressed');
            if ('keyReleased' in RuneWizard.display && keyCodeTouched != null) {
                RuneWizard.display.keyReleased(keyCodeTouched);
            }
            keyCodeTouched = null;
        });
        
        setInterval(function () {
            var newControlSet = 'disabled';
            if (RuneWizard.display == RuneWizardCanvas) {
                switch (RuneWizardCanvas.stage) {
                    case 0:
                    case 4:
                        newControlSet = 'disabled';
                        break;
                    case 1:
                        newControlSet = 'title';
                        break;
                    case 2:
                        newControlSet = 'howToPlay';
                        break;
                    case 3:
                        newControlSet = 'playerSelect';
                        break;
                }
            } else if (RuneWizard.display == BoardCanvas) {
                newControlSet = 'board';
            } else if (RuneWizard.display == EndingCanvas) {
                newControlSet = 'disabled';
            }
            if (newControlSet != controlSet) {
                $('#' + controlSet + 'ControlSet').hide();
                $('#' + newControlSet + 'ControlSet').show();
                controlSet = newControlSet;
            }

            RuneWizard.display.run();
            RuneWizard.display.paint(canvasContext);
        }, 33);
    });
})();