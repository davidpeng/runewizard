(function () {
    var logoTimer;
    var selection;
    var howToPlay;

    var titlePainted;
    var playerSelectPainted;
    var repaintPortraits;
    var repaintPlayer;
    var repaintEnemy;
    var repaintRequested;

    var playerSelected;
    var enemySelected;

    var selectTimer;
    var choicesLeft;

    var keepEnemy;
        
    RuneWizardCanvas = {
        stage: 0,
        
        keyPressed: function (keyCode) {
            if (keyCode == 48 || keyCode == 96) {
                RuneWizardCanvas.stage = 1;
                RuneWizard.setDisplay(RuneWizardCanvas);
                return;
            }
            switch (RuneWizardCanvas.stage) {
                case 1:
                    switch (RuneWizard.getGameAction(keyCode)) {
                        case Canvas.UP:
                            if (selection > 0) {
                                selection--;
                                repaintRequested = true;
                                Sounds.selectionChanged.play();
                            }
                            break;
                        case Canvas.DOWN:
                            if (selection < 1) {
                                selection++;
                                repaintRequested = true;
                                Sounds.selectionChanged.play();
                            }
                            break;
                        default:
                            if (selection == 0) {
                                for (var i = 0; i < 8; i++) {
                                    RuneWizard.grey[i] = false;
                                }
                                RuneWizard.player = 0;
                                RuneWizard.enemy = 0;
                                RuneWizard.wins = 0;
                                RuneWizard.continues = 3;
                                RuneWizardCanvas.stage = 3;
                                repaintRequested = true;
                                Sounds.selected.play();
                            } else if (selection == 1) {
                                howToPlay = 0;
                                RuneWizardCanvas.stage = 2;
                                repaintRequested = true;
                                Sounds.selected.play();
                            }
                            break;
                    }
                    break;
                case 2:
                    switch (RuneWizard.getGameAction(keyCode)) {
                        case Canvas.UP:
                            if (howToPlay > 0) {
                                howToPlay--;
                                repaintRequested = true;
                                Sounds.pageChanged.play();
                            }
                            break;
                        case Canvas.DOWN:
                            if (howToPlay < 4) {
                                howToPlay++;
                                repaintRequested = true;
                                Sounds.pageChanged.play();
                            }
                            break;
                        default:
                            RuneWizardCanvas.stage = 1;
                            titlePainted = false;
                            repaintRequested = true;
                            Sounds.pageChanged.play();
                            break;
                    }
                    break;
                case 3:
                    switch (RuneWizard.getGameAction(keyCode)) {
                        case Canvas.UP:
                            if (RuneWizard.player > 3) {
                                RuneWizard.player = RuneWizard.player - 4;
                                repaintPortraits = true;
                                repaintPlayer = true;
                                repaintRequested = true;
                                Sounds.selectionChanged.play();
                            }
                            break;
                        case Canvas.RIGHT:
                            if (RuneWizard.player != 3 && RuneWizard.player != 7) {
                                RuneWizard.player++;
                                repaintPortraits = true;
                                repaintPlayer = true;
                                repaintRequested = true;
                                Sounds.selectionChanged.play();
                            }
                            break;
                        case Canvas.DOWN:
                            if (RuneWizard.player < 4) {
                                RuneWizard.player = RuneWizard.player + 4;
                                repaintPortraits = true;
                                repaintPlayer = true;
                                repaintRequested = true;
                                Sounds.selectionChanged.play();
                            }
                            break;
                        case Canvas.LEFT:
                            if (RuneWizard.player != 0 && RuneWizard.player != 4) {
                                RuneWizard.player--;
                                repaintPortraits = true;
                                repaintPlayer = true;
                                repaintRequested = true;
                                Sounds.selectionChanged.play();
                            }
                            break;
                        default:
                            playerSelected = true;
                            repaintPortraits = true;
                            selectTimer.start(500);
                            repaintRequested = true;
                            Sounds.selected.play();
                            break;
                    }
                    break;
            }
        },
        
        paint: function (g) {
            if (repaintRequested) {
                switch (RuneWizardCanvas.stage) {
                    case 0:
                        g.drawImage(RuneWizard.graphics, 594, 0, 128, 128, 0, 0, 128, 128);
                        break;
                    case 1:
                        if (!titlePainted) {
                            g.drawImage(RuneWizard.graphics, 338, 0, 128, 128, 0, 0, 128, 128);
                            titlePainted = true;
                        }
                        g.drawImage(RuneWizard.graphics, 370, 55, 64, 24, 32, 55, 64, 24);
                        g.drawImage(RuneWizard.graphics, 338 + (selection << 6), 128, 64, 24, 32, 55, 64, 24);
                        break;
                    case 2:
                        g.fillStyle = '#000050';
                        g.fillRect(0, 0, 128, 128);
                        g.drawImage(RuneWizard.graphics, 128, 66, 66, 10, 31, 6, 66, 10);
                        switch (howToPlay) {
                            case 0:
                                g.drawImage(RuneWizard.graphics, 224, 66, 56, 62, 4, 31, 56, 62);
                                drawString(g, 44, 32, 'ROTATE TILES\nCLOCKWISE');
                                drawString(g, 64, 52, 'MOVE TILES\nLEFT/RIGHT');
                                drawString(g, 44, 76, 'DROP TILES');
                                drawString(g, 16, 92, 'ROTATE TILES\nCOUNTERCLOCKWISE');
                                break;
                            case 1:
                                drawTiles(g, 3, 28, 'AA');
                                drawString(g, 17, 23, 'LINE 2 LIKE SPELLS\nTO UNLEASH THEIR\nMAGIC AND HURL IT\nTOWARD ENEMIES.');
                                drawTiles(g, 3, 52, 'BcB');
                                drawString(g, 17, 58, 'PLACE RUNES IN\nBETWEEN FOR ADDED\nDAMAGE!');
                                drawTiles(g, 3, 85, 'DdD');
                                drawString(g, 17, 86, 'UNIFORM COLOR FOR\nMASSIVE ATTACKS.\nMORE RUNES EQUATE\nMORE DAMAGE!');
                                break;
                            case 2:
                                drawTiles(g, 3, 26, 'AFA');
                                drawString(g, 17, 27, 'SET MYSTICAL ITEMS\nBETWEEN SPELLS TO\nSUMMON A MYRIAD\nOF POWERS!');
                                drawTiles(g, 3, 65, 'E');
                                drawString(g, 17, 67, 'CRUSH BOTTOM ROW');
                                drawTiles(g, 3, 77, 'F');
                                drawString(g, 17, 79, 'TRANSFORM SPACERS');
                                drawTiles(g, 3, 89, 'G');
                                drawString(g, 17, 91, 'ZAP ENEMY VITALITY');
                                drawTiles(g, 3, 101, 'H');
                                drawString(g, 17, 103, 'LESSEN DAMAGE');
                                break;
                            case 3:
                                drawTiles(g, 3, 21, '0');
                                drawString(g, 17, 23, 'BOOST FORESIGHT');
                                drawTiles(g, 3, 33, '1');
                                drawString(g, 17, 35, 'SLOW THE ENEMY');
                                drawTiles(g, 3, 45, '2');
                                drawString(g, 17, 47, 'STEAL AN ITEM');
                                drawTiles(g, 3, 57, '3');
                                drawString(g, 17, 59, 'WEAKEN THE ENEMY');
                                drawTiles(g, 3, 69, '4');
                                drawString(g, 17, 71, 'DESTROY SPACERS');
                                drawTiles(g, 3, 81, '5');
                                drawString(g, 17, 83, 'MINIFY DAMAGE');
                                drawTiles(g, 3, 93, '6');
                                drawString(g, 17, 95, 'PUMMEL THE ENEMY');
                                drawTiles(g, 3, 105, '7');
                                drawString(g, 17, 107, 'ELIMINATE A COLOR');
                                break;
                            case 4:
                                drawTiles(g, 3, 32, 'e');
                                drawString(g, 17, 23, 'WATCH OUT FOR\nSPACERS, SENT BY\nENEMIES TO HINDER\nYOUR EFFORTS!');
                                drawString(g, 11, 58, 'CHAIN YOUR ATTACKS');
                                drawString(g, 14, 65, 'TO DEVASTATE YOUR');
                                drawString(g, 14, 72, 'ENEMIES. BUT FILL');
                                drawString(g, 5, 79, 'THE BOARD TO THE TOP');
                                drawString(g, 26, 86, 'AND YOU LOSE.');
                                drawString(g, 8, 100, 'MASTER THE MOVES OF');
                                drawString(g, 5, 107, 'THE WIZARDS AND WIN!');
                                break;
                        }
                        if (howToPlay == 0) {
                            g.drawImage(RuneWizard.graphics, 194, 66, 10, 5, 59, 120, 10, 5);
                        } else if (howToPlay == 4) {
                            g.drawImage(RuneWizard.graphics, 214, 66, 10, 5, 59, 120, 10, 5);
                        } else {
                            g.drawImage(RuneWizard.graphics, 204, 66, 10, 5, 59, 120, 10, 5);
                        }
                        break;
                    case 3:
                    case 4:
                        if (!playerSelectPainted) {
                            g.drawImage(RuneWizard.graphics, 466, 0, 128, 128, 0, 0, 128, 128);
                            playerSelectPainted = true;
                        }

                        if (repaintPortraits) {
                            g.drawImage(RuneWizard.graphics, 494, 84, 71, 37, 28, 84, 71, 37);
                            for (var i = 0; i < 8; i++) {
                                if (RuneWizard.grey[i] && (RuneWizardCanvas.stage != 3 || RuneWizard.player != i)) {
                                    g.drawImage(RuneWizard.graphics, 467 + i % 4 * 17, 131 + Math.floor(i / 4) * 17, 16, 16, 30 + i % 4 * 17, 86 + Math.floor(i / 4) * 17, 16, 16);
                                }
                            }
                            if (RuneWizardCanvas.stage == 3) {
                                if (!playerSelected) {
                                    g.drawImage(RuneWizard.graphics, 553, 128, 20, 20, 28 + RuneWizard.player % 4 * 17, 84 + Math.floor(RuneWizard.player / 4) * 17, 20, 20);
                                } else {
                                    g.drawImage(RuneWizard.graphics, 573, 128, 20, 20, 28 + RuneWizard.player % 4 * 17, 84 + Math.floor(RuneWizard.player / 4) * 17, 20, 20);
                                }
                            } else {
                                if (!enemySelected) {
                                    g.drawImage(RuneWizard.graphics, 553, 148, 20, 20, 28 + RuneWizard.enemy % 4 * 17, 84 + Math.floor(RuneWizard.enemy / 4) * 17, 20, 20);
                                } else {
                                    g.drawImage(RuneWizard.graphics, 573, 148, 20, 20, 28 + RuneWizard.enemy % 4 * 17, 84 + Math.floor(RuneWizard.enemy / 4) * 17, 20, 20);
                                    g.drawImage(RuneWizard.graphics, 466, 167, 43, 8, 41, 98, 43, 8);
                                }
                            }
                            repaintPortraits = false;
                        }

                        if (repaintPlayer) {
                            g.drawImage(RuneWizard.graphics, 468, 40, 32, 27, 2, 40, 32, 27);
                            g.drawImage(RuneWizard.graphics, 0, 175 + RuneWizard.player * 27, 32, 27, 2, 40, 32, 27);
                            repaintPlayer = false;
                        }

                        if (repaintEnemy) {
                            g.drawImage(RuneWizard.graphics, 560, 40, 32, 27, 94, 40, 32, 27);
                            g.drawImage(RuneWizard.graphics, 320, 175 + RuneWizard.enemy * 27, 32, 27, 94, 40, 32, 27);
                            repaintEnemy = false;
                        }
                        break;
                }
                repaintRequested = false;
            }
        },
        
        run: function () {
            switch (RuneWizardCanvas.stage) {
                case 0:
                    if (logoTimer.elapsed()) {
                        RuneWizardCanvas.stage = 1;
                        repaintRequested = true;
                    }
                    break;
                case 3:
                    if (playerSelected && selectTimer.elapsed()) {
                        if (!keepEnemy) {
                            RuneWizardCanvas.stage = 4;
                            repaintEnemy = true;
                            repaintPortraits = true;
                            selectTimer.start(100);
                            repaintRequested = true;
                        } else {
                            RuneWizard.setDisplay(BoardCanvas);
                            return;
                        }
                    }
                    break;
                case 4:
                    if (selectTimer.elapsed()) {
                        if (!enemySelected) {
                            if (choicesLeft > 0) {
                                do {
                                    RuneWizard.enemy++;
                                    if (RuneWizard.enemy > 7) {
                                        RuneWizard.enemy = 0;
                                    }
                                } while (RuneWizard.grey[RuneWizard.enemy]);
                                repaintEnemy = true;
                                choicesLeft--;
                                if (choicesLeft > 0) {
                                    selectTimer.start(100);
                                    Sounds.selectionChanged.play();
                                } else {
                                    selectTimer.start(500);
                                }
                            } else {
                                enemySelected = true;
                                selectTimer.start(1000);
                                Sounds.selected.play();
                            }
                            repaintPortraits = true;
                            repaintRequested = true;
                        } else {
                            RuneWizard.setDisplay(BoardCanvas);
                            return;
                        }
                    }
                    break;
            }
        },
        
        showNotify: function () {
            logoTimer = new Timer();
            selection = 0;
            howToPlay = 0;

            titlePainted = false;
            playerSelectPainted = false;
            repaintPortraits = true;
            repaintPlayer = true;
            repaintEnemy = false;
            repaintRequested = true;

            playerSelected = false;
            enemySelected = false;

            selectTimer = new Timer();

            keepEnemy = false;
        
            if (RuneWizardCanvas.stage == 0) {
                logoTimer.start(2000);
            } else if (RuneWizardCanvas.stage == 3) {
                keepEnemy = true;
            } else if (RuneWizardCanvas.stage == 4) {
                repaintEnemy = true;
                selectTimer.start(100);
            }
            choicesLeft = Random.nextInt(8, 16);
            RuneWizardCanvas.run();
        }
    };

    function drawString(g, x, y, string) {
        var start = x;
        for (var i = 0; i < string.length; i++) {
            var character = string[i];
            if (character >= 'A' && character <= 'Z') {
                g.drawImage(RuneWizard.graphics, 128 + (character.charCodeAt(0) - 'A'.charCodeAt(0)) * 5, 60, 5, 6, x, y, 5, 6);
            } else if (character == '\n') {
                x = start - 6;
                y = y + 7;
            } else if (character == '!') {
                g.drawImage(RuneWizard.graphics, 258, 60, 5, 6, x, y, 5, 6);
            } else if (character == '.') {
                g.drawImage(RuneWizard.graphics, 263, 60, 5, 6, x, y, 5, 6);
            } else if (character == ',') {
                g.drawImage(RuneWizard.graphics, 268, 60, 5, 6, x, y, 5, 6);
            } else if (character == '2') {
                g.drawImage(RuneWizard.graphics, 273, 60, 5, 6, x, y, 5, 6);
            } else if (character == '/') {
                g.drawImage(RuneWizard.graphics, 278, 60, 5, 6, x, y, 5, 6);
            } else if (character == '0') {
                g.drawImage(RuneWizard.graphics, 283, 60, 5, 6, x, y, 5, 6);
            } else if (character == '1') {
                g.drawImage(RuneWizard.graphics, 288, 60, 5, 6, x, y, 5, 6);
            } else if (character == '4') {
                g.drawImage(RuneWizard.graphics, 293, 60, 5, 6, x, y, 5, 6);
            }
            x = x + 6;
        }
    }

    function drawTiles(g, x, y, tiles) {
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile >= 'a' && tile <= 'e') {
                g.drawImage(RuneWizard.graphics, 128 + (tile.charCodeAt(0) - 'a'.charCodeAt(0)) * 10, 0, 10, 10, x, y, 10, 10);
            } else if (tile >= 'A' && tile <= 'H') {
                g.drawImage(RuneWizard.graphics, 178 + (tile.charCodeAt(0) - 'A'.charCodeAt(0)) * 20, 0, 10, 10, x, y, 10, 10);
            } else if (tile >= '0' && tile <= '7') {
                g.drawImage(RuneWizard.graphics, 128 + (tile.charCodeAt(0) - '0'.charCodeAt(0)) * 20, 10, 10, 10, x, y, 10, 10);
            }
            y = y + 10;
        }
    }
})();