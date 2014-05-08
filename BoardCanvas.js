(function () {
    var ignorePaint = false;
    var returnedToTitle = false;

    BoardCanvas = {
        keyPressed: function (keyCode) {
            if (keyCode == 48 || keyCode == 96) {
                returnedToTitle = true;
                RuneWizardCanvas.stage = 1;
                RuneWizard.setDisplay(RuneWizardCanvas);
            } else {
                BoardCanvas.gameAction = RuneWizard.getGameAction(keyCode);
            }
        },
        
        keyReleased: function (keyCode) {
            if (BoardCanvas.gameAction == RuneWizard.getGameAction(keyCode)) {
                BoardCanvas.gameAction = -1;
            }
        },
        
        paint: function (g) {
            if (!ignorePaint && !returnedToTitle) {
                Board.paint(g);
            }
        },
        
        run: function () {
            if (returnedToTitle) {
                return;
            }
            if (!Board.run()) {
                ignorePaint = true;
                return;
            }
        },
        
        showNotify: function () {
            Board.initialize();
            BoardCanvas.gameAction = -1;
            ignorePaint = false;
            returnedToTitle = false;
            BoardCanvas.run();
        }
    };
})();