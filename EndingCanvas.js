(function () {
    var gameOverPosition = -16;
    var wizard = -1;
    var frame = 4;

    var screenPainted = false;
    var repaintGameOver = false;
    var repaintWizard = false;

    var gameOverTimer = new Timer();
    var wizardTimer = new Timer();

    EndingCanvas = {
        paint: function (g) {
            if (!screenPainted) {
                g.drawImage(RuneWizard.graphics, 594, 0, 128, 128, 0, 0, 128, 128);
                screenPainted = true;
            }
            if (repaintGameOver) {
                g.drawImage(RuneWizard.graphics, 594, gameOverPosition - 1, 128, 16, 0, gameOverPosition - 1, 128, 16);
                g.drawImage(RuneWizard.graphics, 78, 146, 128, 16, 0, gameOverPosition, 128, 16);
                repaintGameOver = false;
            }
            if (repaintWizard) {
                g.drawImage(RuneWizard.graphics, 626, 53, 32, 27, 32, 53, 32, 27);
                g.drawImage(RuneWizard.graphics, frame << 5, 175 + wizard * 27, 32, 27, 32, 53, 32, 27);
                g.drawImage(RuneWizard.graphics, 658, 53, 32, 27, 64, 53, 32, 27);
                g.drawImage(RuneWizard.graphics, 320 + (frame << 5), 175 + wizard * 27, 32, 27, 64, 53, 32, 27);
                repaintWizard = false;
            }
        },
        
        run: function () {
            if (gameOverTimer.elapsed()) {
                gameOverTimer.start(180);
                if (gameOverPosition < 25) {
                    gameOverPosition++;
                    repaintGameOver = true;
                }
            }
            if (wizardTimer.elapsed()) {
                if (wizard < 8) {
                    frame++;
                    if (frame < 5) {
                        wizardTimer.start(100);
                        repaintWizard = true;
                    } else {
                        wizard++;
                        if (wizard < 8) {
                            wizardTimer.start(500);
                            frame = 0;
                        } else {
                            wizardTimer.start(5000);
                        }
                    }
                } else {
                    RuneWizardCanvas.stage = 1;
                    RuneWizard.setDisplay(RuneWizardCanvas);
                    return;
                }
            }
        },
        
        showNotify: function () {
            gameOverPosition = -16;
            wizard = -1;
            frame = 4;

            screenPainted = false;
            repaintGameOver = false;
            repaintWizard = false;

            gameOverTimer = new Timer();
            wizardTimer = new Timer();
            
            run();
        }
    }
})();