(function () {
    var stage;

    var openingTimer;
    var animateTimer;
    var destroyTimer;
    var chargeTimer;
    var barTimer;
    var dropTimer;
    var elevateTimer;
    var gravitateTimer;
    var closingTimer;

    var boardPainted;
    var repaintNext;
    var repaintSecond;
    var repaint = new Array(6);
    var repaintAttack;
    var repaintLife;
    var repaintCharge;
    var secondFrame;

    var tiles = new Array(6);
    var destroy = new Array(6);
    var zaps = new Array(6);
    var animateFrame;
    var destroyFrame;

    var next = new Array(4);
    var deployedX;
    var deployedY;
    var satellitePosition;

    var skills = new Array(6);
    var attackMultiplier;
    var attack;

    var life;
    var maximumLife;
    var paintedLife;
    var scaledLife;

    var charge;
    var paintedCharge;

    var numberOfRunesEliminated;
    var someRunesDissimilar;

    var maximumCharge;

    var victorious;

    var xList = new Array(72);
    var yList = new Array(72);
    var listSize;

    var runeShields;
    var itemsTaken;

    var doubleChargeTimer;
    var reduceChargeTimer;
    var reduceAttackTimer;

    var doubleCharged;
    var hammered;

    for (var i = 0; i < 6; i++) {
        repaint[i] = new Array(24);
        tiles[i] = new Array(24);
        destroy[i] = new Array(24);
        zaps[i] = new Array(24);
    }

    function Tile() {
        this.type = 0;
        this.color = 0;
        this.freeze = -1;
    };

    Tile.prototype.paint = function (g, x, y, destroy, zaps, showBackground) {
        if (this.type != 0 || destroyFrame > 3) {
            if (showBackground) {
                g.drawImage(RuneWizard.graphics, x, y, 10, 10, x, y, 10, 10);
            } else {
                g.fillStyle = 'black';
                g.fillRect(x, y, 10, 10);
            }
        }
        if (this.type != -1) {
            if (destroy && destroyFrame > 3) {
                g.drawImage(RuneWizard.graphics, 288 + (destroyFrame - 4) * 10, 20, 10, 10, x, y, 10, 10);
            } else {
                if (this.type == 0) {
                    g.drawImage(RuneWizard.graphics, 128 + this.color * 10, 0, 10, 10, x, y, 10, 10);
                } else if (this.color != 4) {
                    if (this.freeze != -1) {
                        g.drawImage(RuneWizard.graphics, 178 + (this.type - 1) * 80 + this.color * 20, 0, 10, 10, x, y, 10, 10);
                    } else {
                        g.drawImage(RuneWizard.graphics, 178 + (this.type - 1) * 80 + ((this.color << 1) + animateFrame) * 10, 0, 10, 10, x, y, 10, 10);
                    }
                } else {
                    if (this.freeze != -1) {
                        g.drawImage(RuneWizard.graphics, 128 + RuneWizard.player * 20, 10, 10, 10, x, y, 10, 10);
                    } else {
                        g.drawImage(RuneWizard.graphics, 128 + ((RuneWizard.player << 1) + animateFrame) * 10, 10, 10, 10, x, y, 10, 10);
                    }
                }
                if (this.freeze != -1) {
                    if (this.type != 2) {
                        g.drawImage(RuneWizard.graphics, 128 + this.type * 10, 20, 10, 10, x, y, 10, 10);
                    } else if (this.color != 4) {
                        g.drawImage(RuneWizard.graphics, 148 + this.color * 10, 20, 10, 10, x, y, 10, 10);
                    } else {
                        g.drawImage(RuneWizard.graphics, 188 + RuneWizard.player * 10, 20, 10, 10, x, y, 10, 10);
                    }
                }
                if (destroy && destroyFrame < 4) {
                    var offset;
                    if (destroyFrame != 3) {
                        offset = destroyFrame * 6;
                    } else {
                        offset = 6;
                    }
                    for (var i = 0; i < 6; i++) {
                        if ((zaps & (1 << i)) != 0) {
                            g.drawImage(RuneWizard.graphics, 128 + (i + offset) * 10, 30, 10, 10, x, y, 10, 10);
                        }
                    }
                }
            }
        }
    };

    Board = {
        initialize: function () {
            stage = 0;

            openingTimer = new Timer();
            animateTimer = new Timer();
            destroyTimer = new Timer();
            chargeTimer = new Timer();
            barTimer = new Timer();
            dropTimer = new Timer();
            elevateTimer = new Timer();
            gravitateTimer = new Timer();
            closingTimer = new Timer();

            boardPainted = false;
            repaintNext = true;
            repaintSecond = false;
            repaintAttack = true;
            repaintLife = true;
            repaintCharge = true;
            secondFrame = -1;

            animateFrame = 0;
            destroyFrame = -2;

            deployedX = 0;
            deployedY = 0;
            satellitePosition = 0;

            attackMultiplier = 1;
            attack = 0;

            life = 0;
            maximumLife = 0;
            paintedLife = 40;
            scaledLife = 40;

            charge = 0;
            paintedCharge = 0;

            numberOfRunesEliminated = 0;
            someRunesDissimilar = false;

            maximumCharge = 0;

            victorious = false;

            listSize = 0;

            runeShields = 0;
            itemsTaken = 0;

            doubleChargeTimer = new Timer();
            reduceChargeTimer = new Timer();
            reduceAttackTimer = new Timer();

            doubleCharged = false;
            hammered = false;

            Scene.initialize();
            
            for (var x = 0; x < 6; x++) {
                for (var y = 0; y < 24; y++) {
                    repaint[x][y] = false;
                    
                    tiles[x][y] = new Tile();
                    tiles[x][y].type = -1;
                    
                    destroy[x][y] = false;
                    zaps[x][y] = 0;
                }
            }
            
            for (var i = 0; i < 4; i++) {
                next[i] = null;
            }
            
            for (var i = 0; i < 6; i++) {
                skills[i] = 0;
            }
            
            for (var i = 0; i < 72; i++) {
                xList[i] = 0;
                yList[i] = 0;
            }
            
            deployNext();
            if (RuneWizard.wins < 5) {
                maximumLife = 40 + RuneWizard.wins * 20;
            } else {
                maximumLife = 160 + (RuneWizard.wins - 5) * 40;
            }
            life = maximumLife;
            openingTimer.start(1000);
        },

        paint: function (g) {
            if (!boardPainted) {
                g.drawImage(RuneWizard.graphics, 0, 0, 128, 128, 0, 0, 128, 128);
                boardPainted = true;
            }

            Scene.paint(g);

            var repaintAnimated = false;
            if (animateTimer.elapsed()) {
                animateTimer.start(1000);
                if (animateFrame == 0) {
                    animateFrame = 1;
                } else {
                    animateFrame = 0;
                }
                repaintAnimated = true;
            }

            var repaintDestroyed = false;
            if (destroyFrame != -2 && destroyTimer.elapsed()) {
                if (destroyFrame < 6) {
                    destroyTimer.start(100);
                    if (hammered && destroyFrame == 3) {
                        Sounds.elevationChanged.play();
                        hammered = false;
                    }
                    destroyFrame++;
                } else {
                    destroyFrame = -2;
                }
                repaintDestroyed = true;
            }

            for (var y = 0; y < 24; y++) {
                for (var x = 0; x < 6; x++) {
                    if (repaint[x][y] || repaintAnimated && tiles[x][y].type > 0 && tiles[x][y].freeze == -1 && (!destroy[x][y] || destroyFrame < 4) || repaintDestroyed && destroy[x][y]) {
                        if (repaintDestroyed && destroyFrame == -2 && destroy[x][y]) {
                            tiles[x][y].type = -1;
                            tiles[x][y].freeze = -1;
                            destroy[x][y] = false;
                            zaps[x][y] = 0;
                        }
                        if (y > 11) {
                            tiles[x][y].paint(g, 2 + x * 10, 6 + (y - 12) * 10, destroy[x][y], zaps[x][y], true);
                        }
                        repaint[x][y] = false;
                    }
                }
            }

            for (var i = 0; i < 2; i++) {
                if (repaintNext || repaintAnimated && next[i].type > 0) {
                    next[i].paint(g, 68, 11 + i * 10, false, 0, true);
                }
            }
            if (repaintSecond) {
                if (secondFrame != -1) {
                    g.drawImage(RuneWizard.graphics, 0, 128, 14, 33, 82, 1, 14, 33);
                } else {
                    g.drawImage(RuneWizard.graphics, 82, 1, 14, 33, 82, 1, 14, 33);
                }
                repaintNext = true;
                repaintSecond = false;
            }
            if (secondFrame != -1) {
                for (var i = 2; i < 4; i++) {
                    if (repaintNext || repaintAnimated && next[i].type > 0) {
                        next[i].paint(g, 84, 11 + (i - 2) * 10, false, 0, false);
                    }
                }
            }
            repaintNext = false;

            if (repaintAttack) {
                var string;
                if (-attack <= 0) {
                    string = '00';
                } else if (-attack < 10) {
                    string = '0' + (-attack).toString();
                } else if (-attack < 99) {
                    string = (-attack).toString();
                } else {
                    string = '99';
                }
                g.fillStyle = 'black';
                g.fillRect(103, 11, 21, 20);
                g.drawImage(RuneWizard.graphics, 128 + (string.charCodeAt(0) - '0'.charCodeAt(0)) * 10, 40, 10, 20, 103, 11, 10, 20);
                g.drawImage(RuneWizard.graphics, 128 + (string.charCodeAt(1) - '0'.charCodeAt(0)) * 10, 40, 10, 20, 114, 11, 10, 20);
                repaintAttack = false;
            }

            if (stage == 3 && closingTimer.millisUntilElapse() < 3000) {
                if (victorious) {
                    g.drawImage(RuneWizard.graphics, 78, 128, 64, 18, 0, 58, 64, 18);
                    g.drawImage(RuneWizard.graphics, 228 + RuneWizard.wins * 10, 40, 6, 7, 43, 69, 6, 7);
                } else {
                    if (RuneWizard.continues > 0) {
                        g.drawImage(RuneWizard.graphics, 142, 128, 64, 18, 0, 58, 64, 18);
                        g.drawImage(RuneWizard.graphics, 228 + RuneWizard.continues * 10, 40, 6, 7, 54, 69, 6, 7);
                    } else {
                        g.drawImage(RuneWizard.graphics, 78, 146, 128, 16, 0, 58, 128, 16);
                    }
                }
            } else if (chargeTimer.elapsed()) {
                if (!doubleChargeTimer.elapsed() && reduceChargeTimer.elapsed()) {
                    chargeTimer.start(500);
                } else if (doubleChargeTimer.elapsed() && !reduceChargeTimer.elapsed()) {
                    chargeTimer.start(2000);
                } else {
                    chargeTimer.start(1000);
                }
                charge++;
                var action = 0;
                if (charge == 10) {
                    action = Random.nextInt(0, 1);
                } else if (charge == 20) {
                    action = Random.nextInt(0, 2);
                } else if (charge == 30) {
                    action = Random.nextInt(0, 3);
                } else if (charge >= 40) {
                    action = Random.nextInt(1, 3);
                }
                switch (action) {
                    case 1:
                        attack = attack + Random.nextInt(1, 3);
                        repaintAttack = true;
                        break;
                    case 2:
                        attack = attack + Random.nextInt(4, 6);
                        repaintAttack = true;
                        break;
                    case 3:
                        skills[5]++;
                        break;
                }
                charge = charge - action * 10;
                repaintCharge = true;
            }

            if (life > maximumLife) {
                life = maximumLife;
            }
            if (charge > 40) {
                charge = 40;
            }
            if (paintedLife < scaledLife) {
                paintedLife = scaledLife;
                repaintLife = true;
            }
            if (paintedCharge < charge) {
                paintedCharge = charge;
                repaintCharge = true;
            }
            if (barTimer.elapsed()) {
                barTimer.start(100);
                if (!Scene.freezeLife && paintedLife > scaledLife) {
                    paintedLife--;
                    repaintLife = true;
                }
                if (paintedCharge > charge) {
                    paintedCharge--;
                    repaintCharge = true;
                }
            }

            if (repaintLife && !Scene.freezeLife) {
                g.save();
                g.beginPath();
                g.rect(71, 93, 40, 6);
                g.clip();
                g.fillStyle = 'black';
                g.fillRect(71, 93, 40 - paintedLife, 6);
                if (paintedLife > life) {
                    g.fillStyle = '#a00000';
                    g.fillRect(111 - paintedLife, 93, paintedLife, 6);
                }
                g.fillStyle = '#f00000';
                g.fillRect(111 - scaledLife, 93, scaledLife, 6);
                g.restore();
                repaintLife = false;
            }

            if (repaintCharge) {
                g.save();
                g.beginPath();
                g.rect(71, 107, 40, 6);
                g.clip();
                g.fillStyle = 'black';
                g.fillRect(71, 107, 40 - paintedCharge, 6);
                if (paintedCharge > charge) {
                    g.fillStyle = '#be7800';
                    g.fillRect(111 - paintedCharge, 107, paintedCharge - charge, 6);
                }
                g.fillStyle = '#fab400';
                g.fillRect(111 - charge, 107, charge, 6);
                g.restore();
                repaintCharge = false;
            }
        }
    };

    function deployNext() {
        if (next[0] != null) {
            deployedX = 3;
            deployedY = 12;
            satellitePosition = 0;
            for (var i = 0; i < 2; i++) {
                tiles[deployedX][i + deployedY - 1] = next[i];
                next[i] = next[i + 2];
                next[i + 2] = null;
            }
            repaint[3][12] = true;
            dropTimer.start(1000);
        }
        for (var i = 0; i < 4; i++) {
            if (next[i] == null) {
                next[i] = new Tile();
                var random = Random.nextInt(0, 99);
                if (random < 98) {
                    next[i].type = Math.floor(random / 45);
                    next[i].color = Random.nextInt(0, 3);
                } else {
                    next[i].type = 2;
                    next[i].color = 4;
                }
            }
        }
        repaintNext = true;
    }

    function swap(x1, y1, x2, y2) {
        var temp = tiles[x1][y1];
        tiles[x1][y1] = tiles[x2][y2];
        tiles[x2][y2] = temp;
        repaint[x1][y1] = true;
        repaint[x2][y2] = true;
    }

    function move(x1, y1, x2, y2) {
        tiles[x2][y2] = tiles[x1][y1];
        repaint[x2][y2] = true;
    }

    function isEliminated(x, y, deltaX, deltaY, desiredColor) {
        if (x < 0 || x > 5 || y < 0 || y > 23) {
            return false;
        }
        switch (tiles[x][y].type) {
            case 0:
                if (isEliminated(x + deltaX, y + deltaY, deltaX, deltaY, desiredColor)) {
                    if (tiles[x][y].color != 4) {
                        numberOfRunesEliminated++;
                    }
                    if (tiles[x][y].color != desiredColor) {
                        someRunesDissimilar = true;
                    }
                    zaps[x][y] = zaps[x][y] | (1 << (deltaY * 3 + 1));
                    destroy[x][y] = true;
                    return true;
                }
                return false;
            case 1:
                if (tiles[x][y].color == desiredColor) {
                    zaps[x][y] = zaps[x][y] | (1 << (deltaY * 3 + 2));
                    destroy[x][y] = true;
                    return true;
                }
                return false;
            case 2:
                if (isEliminated(x + deltaX, y + deltaY, deltaX, deltaY, desiredColor)) {
                    zaps[x][y] = zaps[x][y] | (1 << (deltaY * 3 + 1));
                    destroy[x][y] = true;
                    return true;
                }
                return false;
            default:
                return false;
        }
    }

    function eliminate(x, y, deltaX, deltaY) {
        numberOfRunesEliminated = 0;
        someRunesDissimilar = false;
        if (isEliminated(x + deltaX, y + deltaY, deltaX, deltaY, tiles[x][y].color)) {
            attack = attack - attackMultiplier;
            if (someRunesDissimilar) {
                attack = attack - numberOfRunesEliminated * attackMultiplier;
            } else {
                for (numberOfRunesEliminated++; numberOfRunesEliminated > 1; numberOfRunesEliminated--) {
                    attack = attack - numberOfRunesEliminated * attackMultiplier;
                }
            }
            zaps[x][y] = zaps[x][y] | (1 << (deltaY * 3));
            destroy[x][y] = true;
        }
    }

    Board.run = function () {
        Scene.run();

        if (doubleCharged && doubleChargeTimer.elapsed()) {
            Scene.queueAnimation(Scene.ENEMY_PROJECTILE_LEAVING);
            doubleCharged = false;
        }

        switch (stage) {
            case 0:
                if (openingTimer.elapsed()) {
                    elevateTimer.start(30000);
                    for (var y = 16; y < 20; y++) {
                        for (var x = 0; x < 6; x++) {
                            repaint[x][y] = true;
                        }
                    }
                    deployNext();
                    stage = 1;
                }
                break;
            case 1:
                var gameAction = BoardCanvas.gameAction;
                if (gameAction == -1 && dropTimer.elapsed()) {
                    gameAction = Canvas.DOWN;
                }
                switch (gameAction) {
                    case Canvas.UP:
                        switch (satellitePosition) {
                            case 0:
                                if (deployedX < 5 && tiles[deployedX + 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY - 1, deployedX + 1, deployedY);
                                    satellitePosition = 1;
                                } else if (deployedX > 0 && tiles[deployedX - 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY, deployedX - 1, deployedY);
                                    swap(deployedX, deployedY - 1, deployedX, deployedY);
                                    deployedX--;
                                    satellitePosition = 1;
                                } else {
                                    swap(deployedX, deployedY - 1, deployedX, deployedY);
                                }
                                break;
                            case 1:
                                if (deployedY < 23 && tiles[deployedX][deployedY + 1].type == -1) {
                                    swap(deployedX + 1, deployedY, deployedX, deployedY + 1);
                                    satellitePosition = 2;
                                } else if (tiles[deployedX][deployedY - 1].type == -1) {
                                    swap(deployedX, deployedY, deployedX, deployedY - 1);
                                    swap(deployedX + 1, deployedY, deployedX, deployedY);
                                    deployedY--;
                                    satellitePosition = 2;
                                } else {
                                    swap(deployedX + 1, deployedY, deployedX, deployedY);
                                }
                                break;
                            case 2:
                                if (deployedX > 0 && tiles[deployedX - 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY + 1, deployedX - 1, deployedY);
                                    satellitePosition = 3;
                                } else if (deployedX < 5 && tiles[deployedX + 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY, deployedX + 1, deployedY);
                                    swap(deployedX, deployedY + 1, deployedX, deployedY);
                                    deployedX++;
                                    satellitePosition = 3;
                                } else {
                                    swap(deployedX, deployedY + 1, deployedX, deployedY);
                                }
                                break;
                            case 3:
                                if (tiles[deployedX][deployedY - 1].type == -1) {
                                    swap(deployedX - 1, deployedY, deployedX, deployedY - 1);
                                    satellitePosition = 0;
                                } else {
                                    swap(deployedX - 1, deployedY, deployedX, deployedY);
                                }
                                break;
                        }
                        break;
                    case Canvas.FIRE:
                        switch (satellitePosition) {
                            case 0:
                                if (deployedX > 0 && tiles[deployedX - 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY - 1, deployedX - 1, deployedY);
                                    satellitePosition = 3;
                                } else if (deployedX < 5 && tiles[deployedX + 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY, deployedX + 1, deployedY);
                                    swap(deployedX, deployedY - 1, deployedX, deployedY);
                                    deployedX++;
                                    satellitePosition = 3;
                                } else {
                                    swap(deployedX, deployedY - 1, deployedX, deployedY);
                                }
                                break;
                            case 1:
                                if (tiles[deployedX][deployedY - 1].type == -1) {
                                    swap(deployedX + 1, deployedY, deployedX, deployedY - 1);
                                    satellitePosition = 0;
                                } else {
                                    swap(deployedX + 1, deployedY, deployedX, deployedY);
                                }
                                break;
                            case 2:
                                if (deployedX < 5 && tiles[deployedX + 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY + 1, deployedX + 1, deployedY);
                                    satellitePosition = 1;
                                } else if (deployedX > 0 && tiles[deployedX - 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY, deployedX - 1, deployedY);
                                    swap(deployedX, deployedY + 1, deployedX, deployedY);
                                    deployedX--;
                                    satellitePosition = 1;
                                } else {
                                    swap(deployedX, deployedY + 1, deployedX, deployedY);
                                }
                                break;
                            case 3:
                                if (deployedY < 23 && tiles[deployedX][deployedY + 1].type == -1) {
                                    swap(deployedX - 1, deployedY, deployedX, deployedY + 1);
                                    satellitePosition = 2;
                                } else if (tiles[deployedX][deployedY - 1].type == -1) {
                                    swap(deployedX, deployedY, deployedX, deployedY - 1);
                                    swap(deployedX - 1, deployedY, deployedX, deployedY);
                                    deployedY--;
                                    satellitePosition = 2;
                                } else {
                                    swap(deployedX - 1, deployedY, deployedX, deployedY);
                                }
                                break;
                        }
                        break;
                    case Canvas.DOWN:
                        var oldY = deployedY;
                        switch (satellitePosition) {
                            case 0:
                                if (deployedY < 23 && tiles[deployedX][deployedY + 1].type == -1) {
                                    swap(deployedX, deployedY, deployedX, deployedY + 1);
                                    swap(deployedX, deployedY - 1, deployedX, deployedY);
                                    deployedY++;
                                }
                                break;
                            case 1:
                                if (deployedY < 23 && tiles[deployedX][deployedY + 1].type == -1 && tiles[deployedX + 1][deployedY + 1].type == -1) {
                                    swap(deployedX + 1, deployedY, deployedX + 1, deployedY + 1);
                                    swap(deployedX, deployedY, deployedX, deployedY + 1);
                                    deployedY++;
                                }
                                break;
                            case 2:
                                if (deployedY < 22 && tiles[deployedX][deployedY + 2].type == -1) {
                                    swap(deployedX, deployedY + 1, deployedX, deployedY + 2);
                                    swap(deployedX, deployedY, deployedX, deployedY + 1);
                                    deployedY++;
                                }
                                break;
                            case 3:
                                if (deployedY < 23 && tiles[deployedX][deployedY + 1].type == -1 && tiles[deployedX - 1][deployedY + 1].type == -1) {
                                    swap(deployedX - 1, deployedY, deployedX - 1, deployedY + 1);
                                    swap(deployedX, deployedY, deployedX, deployedY + 1);
                                    deployedY++;
                                }
                                break;
                        }
                        if (oldY == deployedY) {
                            Sounds.gravitated.play();
                            for (var y = 0; y < 24; y++) {
                                for (var x = 0; x < 6; x++) {
                                    if (tiles[x][y].freeze != -1) {
                                        tiles[x][y].freeze++;
                                        if (tiles[x][y].freeze == 10) {
                                            tiles[x][y].freeze = -1;
                                            repaint[x][y] = true;
                                        }
                                    }
                                }
                            }
                            if (elevateTimer.elapsed()) {
                                elevateTimer.start(30000);
                                for (var x = 0; x < 6; x++) {
                                    var y = 23;
                                    for ( ; y > 0 && tiles[x][y].type != -1; y--);
                                    for ( ; y < 23; y++) {
                                        move(x, y + 1, x, y);
                                    }
                                    var unavailable = [false, false, false, false];
                                    if (x != 0) {
                                        unavailable[tiles[x - 1][23].color] = true;
                                    }
                                    for ( ; y >= 0; y--) {
                                        if (tiles[x][y].type == 1) {
                                            unavailable[tiles[x][y].color] = true;
                                            break;
                                        }
                                    }
                                    var color = Random.nextInt(0, 3);
                                    while (unavailable[color]) {
                                        color++;
                                        if (color == 4) {
                                            color = 0;
                                        }
                                    }
                                    tiles[x][23] = new Tile();
                                    tiles[x][23].type = 1;
                                    tiles[x][23].color = color;
                                    repaint[x][23] = true;
                                }
                                Sounds.elevationChanged.play();
                            }
                            if (secondFrame != -1) {
                                secondFrame--;
                                if (secondFrame == -1) {
                                    Scene.queueAnimation(Scene.PLAYER_PROJECTILE_LEAVING);
                                    repaintSecond = true;
                                }
                            }
                            BoardCanvas.gameAction = -1;
                            stage = 2;
                        } else {
                            dropTimer.start(1000);
                        }
                        break;
                    case Canvas.LEFT:
                        switch (satellitePosition) {
                            case 0:
                                if (deployedX > 0 && tiles[deployedX - 1][deployedY].type == -1 && tiles[deployedX - 1][deployedY - 1].type == -1) {
                                    swap(deployedX, deployedY - 1, deployedX - 1, deployedY - 1);
                                    swap(deployedX, deployedY, deployedX - 1, deployedY);
                                    deployedX--;
                                }
                                break;
                            case 1:
                                if (deployedX > 0 && tiles[deployedX - 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY, deployedX - 1, deployedY);
                                    swap(deployedX + 1, deployedY, deployedX, deployedY);
                                    deployedX--;
                                }
                                break;
                            case 2:
                                if (deployedX > 0 && tiles[deployedX - 1][deployedY].type == -1 && tiles[deployedX - 1][deployedY + 1].type == -1) {
                                    swap(deployedX, deployedY + 1, deployedX - 1, deployedY + 1);
                                    swap(deployedX, deployedY, deployedX - 1, deployedY);
                                    deployedX--;
                                }
                                break;
                            case 3:
                                if (deployedX > 1 && tiles[deployedX - 2][deployedY].type == -1) {
                                    swap(deployedX - 1, deployedY, deployedX - 2, deployedY);
                                    swap(deployedX, deployedY, deployedX - 1, deployedY);
                                    deployedX--;
                                }
                                break;
                        }
                        break;
                    case Canvas.RIGHT:
                        switch (satellitePosition) {
                            case 0:
                                if (deployedX < 5 && tiles[deployedX + 1][deployedY].type == -1 && tiles[deployedX + 1][deployedY - 1].type == -1) {
                                    swap(deployedX, deployedY - 1, deployedX + 1, deployedY - 1);
                                    swap(deployedX, deployedY, deployedX + 1, deployedY);
                                    deployedX++;
                                }
                                break;
                            case 1:
                                if (deployedX < 4 && tiles[deployedX + 2][deployedY].type == -1) {
                                    swap(deployedX + 1, deployedY, deployedX + 2, deployedY);
                                    swap(deployedX, deployedY, deployedX + 1, deployedY);
                                    deployedX++;
                                }
                                break;
                            case 2:
                                if (deployedX < 5 && tiles[deployedX + 1][deployedY].type == -1 && tiles[deployedX + 1][deployedY + 1].type == -1) {
                                    swap(deployedX, deployedY + 1, deployedX + 1, deployedY + 1);
                                    swap(deployedX, deployedY, deployedX + 1, deployedY);
                                    deployedX++;
                                }
                                break;
                            case 3:
                                if (deployedX < 5 && tiles[deployedX + 1][deployedY].type == -1) {
                                    swap(deployedX, deployedY, deployedX + 1, deployedY);
                                    swap(deployedX - 1, deployedY, deployedX, deployedY);
                                    deployedX++;
                                }
                                break;
                        }
                        break;
                }
                if (BoardCanvas.gameAction != Canvas.DOWN) {
                    BoardCanvas.gameAction = -1;
                }
                break;
            case 2:
                if (destroyFrame == -2 && gravitateTimer.elapsed()) {
                    gravitateTimer.start(100);
                    var gravitated = false;
                    for (var x = 0; x < 6; x++) {
                        for (var y = 22; y >= 0; y--) {
                            if (tiles[x][y + 1].type == -1 && tiles[x][y].type != -1 && tiles[x][y].freeze == -1) {
                                swap(x, y, x, y + 1);
                                gravitated = true;
                                if (y == 23 || y < 22 && tiles[x][y + 2].type != -1) {
                                    Sounds.gravitated.play();
                                }
                            }
                        }
                    }
                    if (!gravitated) {
                        for (var y = 0; y < 24; y++) {
                            for (var x = 0; x < 6; x++) {
                                if (tiles[x][y].type == 1) {
                                    eliminate(x, y, 1, 0);
                                    eliminate(x, y, 0, 1);
                                }
                            }
                        }
                        var eliminated = false;
                        for (var y = 0; y < 24; y++) {
                            for (var x = 0; x < 6; x++) {
                                if (destroy[x][y]) {
                                    if (tiles[x][y].type == 2) {
                                        skills[tiles[x][y].color]++;
                                    }
                                    eliminated = true;
                                }
                            }
                        }
                        if (eliminated) {
                            destroyFrame = -1;
                            attackMultiplier++;
                            repaintAttack = true;
                            Sounds.eliminated.play();
                        } else {
                            if (attack == 0 && skills[0] == 0 && skills[1] == 0 && skills[2] == 0 && skills[3] == 0 && skills[4] == 0 && skills[5] == 0) {
                                if (life <= 0) {
                                    victorious = true;
                                    Scene.queueAnimation(Scene.ENEMY_FALLING);
                                    RuneWizard.grey[RuneWizard.enemy] = true;
                                    RuneWizard.wins++;
                                    closingTimer.start(5000);
                                    stage = 3;
                                } else if (tiles[3][12].type != -1) {
                                    victorious = false;
                                    Scene.queueAnimation(Scene.PLAYER_FALLING);
                                    RuneWizard.continues--;
                                    closingTimer.start(5000);
                                    stage = 3;
                                } else {
                                    attackMultiplier = 1;
                                    deployNext();
                                    stage = 1;
                                }
                            } else {
                                applySkills();
                                if (attack < 0) {
                                    Scene.queueAnimation(Scene.PLAYER_ATTACKING);
                                    Scene.freezeLife = true;
                                    life = life + attack;
                                    scaledLife = Math.floor(40 * life / maximumLife);
                                    repaintLife = true;
                                    attack = 0;
                                } else if (attack > 0) {
                                    Scene.queueAnimation(Scene.ENEMY_ATTACKING);
                                    if (!reduceAttackTimer.elapsed()) {
                                        attack = 1;
                                    } else if (runeShields > 0 && attack > 3) {
                                        attack = 3;
                                        runeShields--;
                                    }
                                    releaseDamageAsSpacers();
                                }
                                if (RuneWizard.player == 2 && itemsTaken > 0) {
                                    releaseItemsTaken();
                                }
                                repaintAttack = true;
                            }
                        }
                    }
                }
                break;
            case 3:
                if (closingTimer.elapsed()) {
                    if (victorious) {
                        if (RuneWizard.wins < 8) {
                            RuneWizardCanvas.stage = 4;
                            RuneWizard.setDisplay(RuneWizardCanvas);
                        } else {
                            RuneWizard.setDisplay(EndingCanvas);
                        }
                    } else {
                        if (RuneWizard.continues > 0) {
                            RuneWizardCanvas.stage = 3;
                        } else {
                            RuneWizardCanvas.stage = 0;
                        }
                        RuneWizard.setDisplay(RuneWizardCanvas);
                    }
                    return false;
                }
                break;
        }

        return true;
    }

    function fillList(type, color, mustNotBeFrozen) {
        listSize = 0;
        for (var y = 12; y < 24; y++) {
            for (var x = 0; x < 6; x++) {
                if (tiles[x][y].type != -1 && (type == -1 || tiles[x][y].type == type) && (color == -1 || tiles[x][y].color == color) && (!mustNotBeFrozen || tiles[x][y].freeze == -1) && !destroy[x][y]) {
                    xList[listSize] = x;
                    yList[listSize] = y;
                    listSize++;
                }
            }
        }
    }

    function transformList(numberOfElements, type, color, freeze, shouldDestroy) {
        if (numberOfElements == -1 || listSize <= numberOfElements) {
            for (var i = 0; i < listSize; i++) {
                if (type != -1) {
                    tiles[xList[i]][yList[i]].type = type;
                }
                if (color != -1) {
                    tiles[xList[i]][yList[i]].color = color;
                }
                if (freeze) {
                    tiles[xList[i]][yList[i]].freeze = 0;
                }
                if (shouldDestroy) {
                    destroy[xList[i]][yList[i]] = true;
                }
                repaint[xList[i]][yList[i]] = true;
            }
        } else {
            var used = new Array(listSize);
            for (var i = 0; i < listSize; i++) {
                used[i] = false;
            }
            while (numberOfElements > 0) {
                var i = Random.nextInt(0, listSize - 1);
                for (var j = i + 1; j != i; j++) {
                    if (j == listSize) {
                        j = 0;
                    }
                    if (!used[j]) {
                        if (type != -1) {
                            tiles[xList[j]][yList[j]].type = type;
                        }
                        if (color != -1) {
                            tiles[xList[j]][yList[j]].color = color;
                        }
                        if (freeze) {
                            tiles[xList[j]][yList[j]].freeze = 0;
                        }
                        if (shouldDestroy) {
                            destroy[xList[j]][yList[j]] = true;
                        }
                        repaint[xList[j]][yList[j]] = true;
                        numberOfElements--;
                        used[j] = true;
                        break;
                    }
                }
            }
        }
        if (shouldDestroy) {
            destroyFrame = -1;
        }
    }

    function applySkills() {
        for ( ; skills[0] > 0; skills[0]--) {
            for (var x = 0; x < 6; x++) {
                if (tiles[x][24 - skills[0]].type != -1) {
                    destroy[x][24 - skills[0]] = true;
                    destroyFrame = -1;
                    hammered = true;
                }
            }
        }

        if (skills[1] > 0) {
            fillList(0, 4, false);
            transformList(Random.nextInt(3 * skills[1], 6 * skills[1]), -1, Random.nextInt(0, 3), false, false);
            skills[1] = 0;
            Sounds.transformed.play();
        }

        if (skills[2] > 0) {
            Scene.queueAnimation(Scene.PLAYER_PERFORMING_UNIVERSAL_ATTACK_SKILL);
            attack = attack - Random.nextInt(5 * skills[2], 10 * skills[2]);
            repaintAttack = true;
            skills[2] = 0;
        }

        if (skills[3] > 0) {
            Scene.queueAnimation(Scene.PLAYER_PERFORMING_UNIVERSAL_ATTACK_SKILL);
            runeShields = runeShields + skills[3];
            skills[3] = 0;
            Sounds.shielded.play();
        }

        if (skills[4] > 0) {
            switch (RuneWizard.player) {
                case 0:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_SKILL);
                    Scene.queueAnimation(Scene.PLAYER_PROJECTILE_ENTERING);
                    secondFrame = secondFrame + 10 * skills[4];
                    repaintSecond = true;
                    break;
                case 1:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    reduceChargeTimer.extend(15000 * skills[4]);
                    break;
                case 2:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    charge = charge - Random.nextInt(15 * skills[4], 20 * skills[4]);
                    itemsTaken++;
                    break;
                case 3:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    charge = charge - Random.nextInt(15 * skills[4], 20 * skills[4]);
                    attack = attack - Random.nextInt(15 * skills[4], 20 * skills[4]);
                    repaintAttack = true;
                    break;
                case 4:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_SKILL);
                    fillList(0, 4, false);
                    transformList(Random.nextInt(6 * skills[4], 9 * skills[4]), -1, -1, false, true);
                    break;
                case 5:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    reduceAttackTimer.extend(15000 * skills[4]);
                    break;
                case 6:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    attack = attack - Random.nextInt(15 * skills[4], 25 * skills[4]);
                    repaintAttack = true;
                    break;
                case 7:
                    Scene.queueAnimation(Scene.PLAYER_PERFORMING_SPECIFIC_SKILL);
                    var previousListSize = 0;
                    var leastCommonColor = -1;
                    for (var i = 0; i < 4; i++) {
                        fillList(0, i, false);
                        var currentListSize = listSize;
                        fillList(1, i, false);
                        currentListSize = currentListSize + listSize;
                        if (currentListSize > previousListSize) {
                            previousListSize = currentListSize;
                            leastCommonColor = i;
                        }
                    }
                    fillList(0, leastCommonColor, false);
                    transformList(-1, -1, -1, false, true);
                    fillList(1, leastCommonColor, false);
                    transformList(-1, -1, -1, false, true);
            }
            skills[4] = 0;
        }

        if (skills[5] > 0) {
            switch (RuneWizard.enemy) {
                case 0:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_SKILL);
                    Scene.queueAnimation(Scene.ENEMY_PROJECTILE_ENTERING);
                    doubleChargeTimer.extend(15000 * skills[5]);
                    doubleCharged = true;
                    break;
                case 1:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    fillList(-1, -1, true);
                    transformList(Random.nextInt(6 * skills[5], 9 * skills[5]), -1, -1, true, false);
                    break;
                case 2:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    fillList(2, 4, false);
                    if (listSize > 0) {
                        transformList(skills[5], -1, -1, false, true);
                        charge = charge + 20 * skills[5];
                    } else {
                        fillList(2, -1, false);
                        transformList(skills[5], -1, -1, false, true);
                        charge = charge + 10 * skills[5];
                    }
                    break;
                case 3:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    fillList(2, -1, false);
                    transformList(Random.nextInt(1 * skills[5], 2 * skills[5]), 0, 4, false, false);
                    break;
                case 4:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_SKILL);
                    life = life + Random.nextInt(15 * skills[5], 25 * skills[5]);
                    scaledLife = Math.floor(40 * life / maximumLife);
                    repaintLife = true;
                    break;
                case 5:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    fillList(Random.nextInt(0, 1), -1, false);
                    transformList(Random.nextInt(6 * skills[5], 9 * skills[5]), 0, 4, false, false);
                    break;
                case 6:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    attack = attack + Random.nextInt(6 * skills[5], 9 * skills[5]);
                    repaintAttack = true;
                    break;
                case 7:
                    Scene.queueAnimation(Scene.ENEMY_PERFORMING_SPECIFIC_ATTACK_SKILL);
                    attack = attack + Random.nextInt(1 * skills[5], 6 * skills[5]);
                    repaintAttack = true;
                    life = life + Random.nextInt(10 * skills[5], 15 * skills[5]);
                    scaledLife = Math.floor(40 * life / maximumLife);
                    repaintLife = true;
                    break;
            }
            skills[5] = 0;
        }
    }

    function releaseItemsTaken() {
        if (itemsTaken > 6) {
            itemsTaken = 6;
        }
        var used = new Array(6);
        for (var i = 0; i < 6; i++) {
            used[i] = false;
        }
        while (itemsTaken > 0) {
            var x = Random.nextInt(0, 5);
            for (var x2 = x + 1; x2 != x; x2++) {
                if (x2 == 6) {
                    x2 = 0;
                }
                if (!used[x2]) {
                    tiles[x][11].type = 2;
                    tiles[x][11].color = Random.nextInt(0, 4);
                    tiles[x][11].freeze = -1;
                    itemsTaken--;
                    used[x2] = true;
                    break;
                }
            }
        }
        itemsTaken = 0;
    }

    function releaseDamageAsSpacers() {
        for (var y = 10; y >= 0 && attack > 0; y--) {
            if (attack < 6) {
                var used = new Array(6);
                for (var i = 0; i < 6; i++) {
                    used[i] = false;
                }
                while (attack > 0) {
                    var x = Random.nextInt(0, 5);
                    for (var x2 = x + 1; x2 != x; x2++) {
                        if (x2 == 6) {
                            x2 = 0;
                        }
                        if (!used[x2]) {
                            tiles[x2][y].type = 0;
                            tiles[x2][y].color = 4;
                            tiles[x2][y].freeze = -1;
                            used[x2] = true;
                            attack--;
                            break;
                        }
                    }
                }
            } else {
                for (var x = 0; x < 6; x++) {
                    tiles[x][y].type = 0;
                    tiles[x][y].color = 4;
                    tiles[x][y].freeze = -1;
                }
                attack = attack - 6;
            }
        }
    }
})();