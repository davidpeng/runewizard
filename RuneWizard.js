RuneWizard = {
    grey: new Array(8),
    player: 0,
    enemy: 0,
    wins: 0,
    continues: 0,
    
    setDisplay: function (canvas) {
        RuneWizard.display = canvas;
        canvas.showNotify();
    },
    
    getGameAction: function (keyCode) {
        return keyCode;
    }
};