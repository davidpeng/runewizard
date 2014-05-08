(function () {
    Scene = {
        PLAYER_PERFORMING_UNIVERSAL_ATTACK_SKILL: 0,
        PLAYER_ATTACKING: 1,
        PLAYER_PERFORMING_SPECIFIC_SKILL: 2,
        PLAYER_PERFORMING_SPECIFIC_ATTACK_SKILL: 3,
        PLAYER_FALLING: 4,
        PLAYER_PROJECTILE_ENTERING: 5,
        PLAYER_PROJECTILE_LEAVING: 6,
        ENEMY_ATTACKING: 7,
        ENEMY_PERFORMING_SPECIFIC_SKILL: 8,
        ENEMY_PERFORMING_SPECIFIC_ATTACK_SKILL: 9,
        ENEMY_FALLING: 10,
        ENEMY_PROJECTILE_ENTERING: 11,
        ENEMY_PROJECTILE_LEAVING: 12,
        freezeLife: false
    };

    var animations = [
        [1, 5, -1, 1, 0],
        [0, 1, -1, 0, 2, 2, 0, 0, -1, 0, 0, 2, 8, 0, -1, 2, 16, 0, -1, 2, 24, 0, -1, 2, 32, 0, -1, 1, 5, 2, 0, -1, 4, 32, 0, -1, 1, 0, 4, 32, 1, -1, 4, 0, -1],
        [0, 3, -1, 0, 4, -1, 0, 0],
        [0, 3, -1, 0, 4, 2, 0, 1, -1, 0, 0, 2, 8, 1, -1, 2, 16, 1, -1, 2, 24, 1, -1, 2, 32, 1, -1, 1, 5, 2, 0, -1, 4, 32, 0, -1, 1, 0, 4, 32, 1, -1, 1, 5, 4, 0, -1, -1, 1, 0],
        [0, 5, -1, 0, 6, -1, 0, 7],
        [5, -24, -1, 5, -16, -1, 5, -8],
        [5, 0, -1, 5, 8, -1, 5, 16, -1, 5, 24, -1, 5, 32, -1, 5, 40, -1, 5, 48, -1, 5, 56, -1, 5, 64],
        [1, 1, -1, 1, 2, 3, 32, 0, -1, 1, 0, 3, 24, 0, -1, 3, 16, 0, -1, 3, 8, 0, -1, 3, 0, 0, -1, 0, 5, 3, 0, -1, 4, 0, 0, -1, 0, 0, 4, 0, 1, -1, 4, 0, -1],
        [1, 3, -1, 1, 4, -1, 1, 0],
        [1, 3, -1, 1, 4, 3, 32, 1, -1, 1, 0, 3, 24, 1, -1, 3, 16, 1, -1, 3, 8, 1, -1, 3, 0, 1, -1, 0, 5, 3, 0, -1, 4, 0, 0, -1, 0, 0, 4, 0, 1, -1, 0, 5, 4, 0, -1, -1, 0, 0],
        [1, 5, -1, 1, 6, -1, 1, 7],
        [6, 56, -1, 6, 48, -1, 6, 40],
        [6, 32, -1, 6, 24, -1, 6, 16, -1, 6, 8, -1, 6, 0, -1, 6, -8, -1, 6, -16, -1, 6, -24, -1, 6, -32]
    ];

    var timer;
    var queue;
    var animation;
    var frame;

    var playerFrame;
    var enemyFrame;
    var playerProjectilePosition;
    var playerProjectileFrame;
    var enemyProjectilePosition;
    var enemyProjectileFrame;
    var sparkPosition;
    var sparkFrame;
    var playerBirdPosition;
    var enemyBirdPosition;
    var repaint;

    var birdAltitude;

    Scene.initialize = function () {
        timer = new Timer();
        queue = [];
        animation = -1;
        frame = 0;
        
        playerFrame = 0;
        enemyFrame = 0;
        playerProjectilePosition = 0;
        playerProjectileFrame = -1;
        enemyProjectilePosition = 0;
        enemyProjectileFrame = -1;
        sparkPosition = 0;
        sparkFrame = -1;
        playerBirdPosition = -32;
        enemyBirdPosition = 64;
        repaint = true;
        
        birdAltitude = 0;
    };

    Scene.paint = function (g) {
        if (repaint)
        {
            g.save();
            g.translate(64, 40);
            g.beginPath();
            g.rect(0, 0, 64, 48);
            g.clip();
            g.drawImage(RuneWizard.graphics, (RuneWizard.enemy % 4) << 6, 391, 64, 48, 0, 0, 64, 48);
            g.drawImage(RuneWizard.graphics, playerFrame << 5, 175 + RuneWizard.player * 27, 32, 27, 0, 16, 32, 27);
            g.drawImage(RuneWizard.graphics, 320 + (enemyFrame << 5), 175 + RuneWizard.enemy * 27, 32, 27, 32, 16, 32, 27);
            if (playerProjectileFrame != -1) {
                g.drawImage(RuneWizard.graphics, 256 + (playerProjectileFrame << 5), 175 + RuneWizard.player * 27, 32, 27, playerProjectilePosition, 16, 32, 27);
            }
            if (enemyProjectileFrame != -1) {
                g.drawImage(RuneWizard.graphics, 576 + (enemyProjectileFrame << 5), 175 + RuneWizard.enemy * 27, 32, 27, enemyProjectilePosition, 16, 32, 27);
            }
            if (sparkFrame != -1) {
                g.drawImage(RuneWizard.graphics, 206 + (sparkFrame << 5), 128, 32, 27, sparkPosition, 16, 32, 27);
            }
            if (playerBirdPosition > -32 && playerBirdPosition < 64) {
                g.drawImage(RuneWizard.graphics, 288, 175 + RuneWizard.player * 27, 32, 27, playerBirdPosition, birdAltitude, 32, 27);
            }
            if (enemyBirdPosition > -32 && enemyBirdPosition < 64) {
                g.drawImage(RuneWizard.graphics, 608, 175 + RuneWizard.enemy * 27, 32, 27, enemyBirdPosition, birdAltitude, 32, 27);
            }
            g.restore();
            repaint = false;
        }
    };

    Scene.run = function () {
        if (timer.elapsed()) {
            timer.start(100);
            if (playerBirdPosition > -32 && playerBirdPosition < 64 || enemyBirdPosition > -32 && enemyBirdPosition < 64) {
                if (birdAltitude == 0) {
                    birdAltitude = 1;
                } else {
                    birdAltitude = 0;
                }
                repaint = true;
            }
            if (animation == -1 && queue.length > 0) {
                animation = queue.shift();
            }
            if (animation != -1) {
                while (frame < animations[animation].length && animations[animation][frame] != -1) {
                    switch (animations[animation][frame]) {
                        case 0:
                            playerFrame = animations[animation][frame + 1];
                            if (playerFrame == 1 || playerFrame == 3) {
                                Sounds.attacking.play();
                            } else if (playerFrame == 5) {
                                Sounds.attacked.play();
                            } else if (playerFrame == 7) {
                                Sounds.fallen.play();
                            }
                            frame = frame + 2;
                            break;
                        case 1:
                            enemyFrame = animations[animation][frame + 1];
                            if (enemyFrame == 1 || enemyFrame == 3) {
                                Sounds.attacking.play();
                            } else if (enemyFrame == 5) {
                                if (animation == Scene.PLAYER_ATTACKING) {
                                    Scene.freezeLife = false;
                                }
                                Sounds.attacked.play();
                            } else if (enemyFrame == 7) {
                                Sounds.fallen.play();
                            }
                            frame = frame + 2;
                            break;
                        case 2:
                            playerProjectilePosition = animations[animation][frame + 1];
                            playerProjectileFrame = animations[animation][frame + 2];
                            frame = frame + 3;
                            break;
                        case 3:
                            enemyProjectilePosition = animations[animation][frame + 1];
                            enemyProjectileFrame = animations[animation][frame + 2];
                            frame = frame + 3;
                            break;
                        case 4:
                            sparkPosition = animations[animation][frame + 1];
                            sparkFrame = animations[animation][frame + 2];
                            frame = frame + 3;
                            break;
                        case 5:
                            playerBirdPosition = animations[animation][frame + 1];
                            frame = frame + 2;
                            break;
                        case 6:
                            enemyBirdPosition = animations[animation][frame + 1];
                            frame = frame + 2;
                            break;
                    }
                }
                if (frame == animations[animation].length) {
                    animation = -1;
                    frame = 0;
                } else {
                    frame++;
                }
                repaint = true;
            }
        }
    };

    Scene.queueAnimation = function (animation) {
        if ((animation != Scene.PLAYER_PROJECTILE_ENTERING || playerBirdPosition != -8) && (animation != Scene.ENEMY_PROJECTILE_ENTERING || enemyBirdPosition != 40)) {
            queue.push(animation);
        }
    };
})();