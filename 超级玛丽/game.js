/ 游戏主类
class Game {
    constructor() {
        // 获取画布和上下文
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 游戏基本配置
        this.canvasWidth = 960;
        this.canvasHeight = 640;
        this.gravity = 0.6;
        this.friction = 0.8;
        this.camera = { x: 0, y: 0 };

        // 设置画布尺寸
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        // 游戏状态
        this.gameState = 'start'; // start, playing, gameOver, win
        this.score = 0;
        this.lives = 3;

        // 输入状态
        this.keys = {};

        // 游戏对象数组
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.questionBlocks = [];
        this.particles = [];
        this.flagPole = null;

        // 初始化游戏
        this.init();
        this.bindEvents();
        this.gameLoop();
    }

    // 初始化游戏
    init() {
        this.createPlayer();
        this.createLevel();
        this.updateHUD();
    }

    // 绑定事件监听
    bindEvents() {
        // 键盘按下事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
            }
        });

        // 键盘释放事件
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
    }

    // 开始游戏
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startScreen').classList.add('hidden');
    }

    // 重新开始游戏
    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.init();
        this.gameState = 'playing';
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('winScreen').classList.add('hidden');
    }

    // 游戏结束
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    // 游戏胜利
    gameWin() {
        this.gameState = 'win';
        document.getElementById('winScore').textContent = this.score;
        document.getElementById('winScreen').classList.remove('hidden');
    }

    // 更新HUD显示
    updateHUD() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
    }

    // 创建玩家角色
    createPlayer() {
        this.player = {
            x: 100,
            y: 400,
            width: 32,
            height: 48,
            vx: 0,
            vy: 0,
            speed: 5,
            jumpForce: 15,
            onGround: false,
            canDoubleJump: true,
            hasDoubleJumped: false,
            facingRight: true,
            state: 'idle', // idle, walking, jumping, falling
            animFrame: 0,
            animTimer: 0
        };
    }

    // 创建关卡
    createLevel() {
        // 清空数组
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.questionBlocks = [];
        this.particles = [];

        // 地面平台
        for (let i = 0; i < 50; i++) {
            this.platforms.push({
                x: i * 64,
                y: 550,
                width: 64,
                height: 90,
                type: 'ground'
            });
        }

        // 悬浮平台
        this.platforms.push({ x: 300, y: 450, width: 128, height: 32, type: 'brick' });
        this.platforms.push({ x: 550, y: 400, width: 192, height: 32, type: 'brick' });
        this.platforms.push({ x: 850, y: 350, width: 128, height: 32, type: 'brick' });
        this.platforms.push({ x: 1100, y: 420, width: 160, height: 32, type: 'brick' });
        this.platforms.push({ x: 1400, y: 380, width: 128, height: 32, type: 'brick' });
        this.platforms.push({ x: 1700, y: 350, width: 192, height: 32, type: 'brick' });
        this.platforms.push({ x: 2000, y: 400, width: 128, height: 32, type: 'brick' });

        // 问号砖块
        this.questionBlocks.push({ x: 400, y: 380, width: 48, height: 48, used: false, bounceY: 0 });
        this.questionBlocks.push({ x: 650, y: 320, width: 48, height: 48, used: false, bounceY: 0 });
        this.questionBlocks.push({ x: 950, y: 270, width: 48, height: 48, used: false, bounceY: 0 });
        this.questionBlocks.push({ x: 1500, y: 300, width: 48, height: 48, used: false, bounceY: 0 });

        // 金币
        this.coins.push({ x: 350, y: 400, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 600, y: 350, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 650, y: 350, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 700, y: 350, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 900, y: 300, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 1150, y: 370, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 1200, y: 370, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 1450, y: 330, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 1750, y: 300, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 1800, y: 300, width: 24, height: 24, collected: false, animFrame: 0 });
        this.coins.push({ x: 1850, y: 300, width: 24, height: 24, collected: false, animFrame: 0 });

        // 敌人
        this.enemies.push({ x: 500, y: 510, width: 32, height: 32, vx: 1, alive: true, animFrame: 0 });
        this.enemies.push({ x: 900, y: 510, width: 32, height: 32, vx: -1, alive: true, animFrame: 0 });
        this.enemies.push({ x: 1200, y: 510, width: 32, height: 32, vx: 1, alive: true, animFrame: 0 });
        this.enemies.push({ x: 1550, y: 510, width: 32, height: 32, vx: -1, alive: true, animFrame: 0 });
        this.enemies.push({ x: 1850, y: 510, width: 32, height: 32, vx: 1, alive: true, animFrame: 0 });

        // 终点旗杆
        this.flagPole = {
            x: 2300,
            y: 300,
            width: 20,
            height: 250,
            flagY: 300,
            flagRaised: false
        };
    }

    // 更新玩家
    updatePlayer() {
        if (!this.player) return;

        const player = this.player;

        // 水平移动
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            player.vx = -player.speed;
            player.facingRight = false;
        } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            player.vx = player.speed;
            player.facingRight = true;
        } else {
            player.vx *= this.friction;
        }

        // 跳跃
        if (this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']) {
            if (player.onGround) {
                player.vy = -player.jumpForce;
                player.onGround = false;
                player.hasDoubleJumped = false;
            } else if (player.canDoubleJump && !player.hasDoubleJumped) {
                player.vy = -player.jumpForce * 0.8;
                player.hasDoubleJumped = true;
            }
            // 防止持续按键触发多次跳跃
            this.keys['Space'] = false;
            this.keys['ArrowUp'] = false;
            this.keys['KeyW'] = false;
        }

        // 应用重力
        player.vy += this.gravity;

        // 更新位置
        player.x += player.vx;
        player.y += player.vy;

        // 更新状态
        if (player.vy < 0) {
            player.state = 'jumping';
        } else if (player.vy > 0.5) {
            player.state = 'falling';
        } else if (Math.abs(player.vx) > 0.5) {
            player.state = 'walking';
        } else {
            player.state = 'idle';
        }

        // 动画帧更新
        player.animTimer++;
        if (player.animTimer > 8) {
            player.animTimer = 0;
            player.animFrame = (player.animFrame + 1) % 4;
        }

        // 检查掉落
        if (player.y > this.canvasHeight + 100) {
            this.playerHit();
        }

        // 更新相机
        this.camera.x = player.x - this.canvasWidth / 3;
        if (this.camera.x < 0) this.camera.x = 0;
    }

    // 更新敌人
    updateEnemies() {
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;

            // 移动
            enemy.x += enemy.vx;

            // 检查是否碰到平台边缘
            let onPlatform = false;
            this.platforms.forEach(platform => {
                if (this.checkCollision(
                    { x: enemy.x + enemy.vx, y: enemy.y, width: enemy.width, height: enemy.height + 10 },
                    platform
                )) {
                    onPlatform = true;
                }
            });

            // 如果不在平台上或碰到墙壁，则转向
            if (!onPlatform || enemy.x < 50) {
                enemy.vx *= -1;
            }

            // 动画更新
            enemy.animFrame = (enemy.animFrame + 0.1) % 2;
        });
    }

    // 更新金币动画
    updateCoins() {
        this.coins.forEach(coin => {
            if (!coin.collected) {
                coin.animFrame = (coin.animFrame + 0.15) % 4;
            }
        });
    }

    // 更新问号砖块
    updateQuestionBlocks() {
        this.questionBlocks.forEach(block => {
            if (block.bounceY > 0) {
                block.bounceY -= 2;
            }
        });
    }

    // 更新粒子效果
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3;
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 更新终点旗杆
    updateFlagPole() {
        if (!this.flagPole || this.flagPole.flagRaised) return;

        // 检查玩家是否到达旗杆
        if (this.player && this.checkCollision(this.player, this.flagPole)) {
            this.flagPole.flagRaised = true;
            // 计算旗杆高度奖励
            const heightBonus = Math.floor((this.flagPole.y + this.flagPole.height - this.player.y) / 10) * 10;
            this.score += heightBonus + 1000;
            this.updateHUD();
            setTimeout(() => this.gameWin(), 1000);
        }
    }

    // 碰撞检测
    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    // 处理平台碰撞
    handlePlatformCollisions() {
        if (!this.player) return;

        const player = this.player;
        player.onGround = false;

        this.platforms.forEach(platform => {
            if (this.checkCollision(player, platform)) {
                // 从上方碰撞
                if (player.vy > 0 && player.y + player.height - player.vy <= platform.y + 5) {
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    player.onGround = true;
                    player.hasDoubleJumped = false;
                }
                // 从下方碰撞
                else if (player.vy < 0 && player.y - player.vy >= platform.y + platform.height - 5) {
                    player.y = platform.y + platform.height;
                    player.vy = 0;
                }
                // 从左侧碰撞
                else if (player.vx > 0 && player.x + player.width - player.vx <= platform.x + 5) {
                    player.x = platform.x - player.width;
                    player.vx = 0;
                }
                // 从右侧碰撞
                else if (player.vx < 0 && player.x - player.vx >= platform.x + platform.width - 5) {
                    player.x = platform.x + platform.width;
                    player.vx = 0;
                }
            }
        });

        // 问号砖块碰撞
        this.questionBlocks.forEach(block => {
            const blockWithBounce = { ...block, y: block.y - block.bounceY };
            if (this.checkCollision(player, blockWithBounce)) {
                // 从下方碰撞
                if (player.vy < 0 && player.y - player.vy >= blockWithBounce.y + blockWithBounce.height - 5) {
                    player.y = blockWithBounce.y + blockWithBounce.height;
                    player.vy = 0;
                    if (!block.used) {
                        block.used = true;
                        block.bounceY = 10;
                        this.spawnCoin(block.x + block.width / 2, block.y - 30);
                        this.score += 100;
                        this.updateHUD();
                    }
                }
                // 从上方碰撞
                else if (player.vy > 0 && player.y + player.height - player.vy <= blockWithBounce.y + 5) {
                    player.y = blockWithBounce.y - player.height;
                    player.vy = 0;
                    player.onGround = true;
                    player.hasDoubleJumped = false;
                }
                // 侧面碰撞
                else if (player.vx > 0) {
                    player.x = blockWithBounce.x - player.width;
                    player.vx = 0;
                } else if (player.vx < 0) {
                    player.x = blockWithBounce.x + blockWithBounce.width;
                    player.vx = 0;
                }
            }
        });
    }

    // 处理敌人碰撞
    handleEnemyCollisions() {
        if (!this.player) return;

        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;

            if (this.checkCollision(this.player, enemy)) {
                // 从上方踩踏
                if (this.player.vy > 0 && this.player.y + this.player.height - this.player.vy <= enemy.y + 10) {
                    enemy.alive = false;
                    this.player.vy = -10;
                    this.score += 200;
                    this.updateHUD();
                    // 创建粒子效果
                    for (let i = 0; i < 8; i++) {
                        this.particles.push({
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height / 2,
                            vx: (Math.random() - 0.5) * 8,
                            vy: (Math.random() - 0.5) * 8 - 5,
                            life: 30,
                            color: '#8B4513'
                        });
                    }
                }
                // 侧面碰撞
                else {
                    this.playerHit();
                }
            }
        });
    }

    // 处理金币收集
    handleCoinCollisions() {
        if (!this.player) return;

        this.coins.forEach(coin => {
            if (!coin.collected && this.checkCollision(this.player, coin)) {
                coin.collected = true;
                this.score += 100;
                this.updateHUD();
                // 创建粒子效果
                for (let i = 0; i < 6; i++) {
                    this.particles.push({
                        x: coin.x + coin.width / 2,
                        y: coin.y + coin.height / 2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6 - 3,
                        life: 25,
                        color: '#FFD700'
                    });
                }
            }
        });
    }

    // 玩家受伤
    playerHit() {
        this.lives--;
        this.updateHUD();
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.createPlayer();
        }
    }

    // 生成金币（从问号砖块）
    spawnCoin(x, y) {
        const coin = {
            x: x - 12,
            y: y,
            width: 24,
            height: 24,
            collected: false,
            animFrame: 0,
            spawned: true,
            vy: -8
        };
        this.coins.push(coin);
        // 模拟金币弹出动画
        const interval = setInterval(() => {
            coin.vy += 0.5;
            coin.y += coin.vy;
            if (coin.vy > 0 && coin.y > y + 50) {
                clearInterval(interval);
                coin.collected = true;
            }
        }, 16);
    }

    // 绘制玩家
    drawPlayer() {
        if (!this.player) return;

        const ctx = this.ctx;
        const p = this.player;
        const drawX = p.x - this.camera.x;
        const drawY = p.y - this.camera.y;

        ctx.save();

        // 如果面向左边，翻转画布
        if (!p.facingRight) {
            ctx.translate(drawX + p.width, drawY);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(drawX, drawY);
        }

        // 绘制身体（蓝色工装裤）
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(4, 28, 24, 20);

        // 绘制皮肤
        ctx.fillStyle = '#FFCC99';
        // 头部
        ctx.fillRect(8, 8, 16, 20);
        // 手臂
        const armOffset = p.state === 'walking' ? Math.sin(p.animFrame * Math.PI / 2) * 4 : 0;
        ctx.fillRect(0, 28 + armOffset, 8, 12);
        ctx.fillRect(24, 28 - armOffset, 8, 12);

        // 绘制腿
        const legOffset = p.state === 'walking' ? Math.sin(p.animFrame * Math.PI / 2) * 4 : 0;
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(6, 44, 8, 4);
        ctx.fillRect(18, 44, 8, 4);

        // 绘制红色帽子
        ctx.fillStyle = '#E52521';
        ctx.fillRect(4, 0, 24, 12);
        ctx.fillRect(0, 8, 32, 4);

        // 绘制眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(18, 14, 4, 4);

        // 绘制胡子
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(14, 20, 10, 4);
        ctx.fillRect(12, 22, 14, 2);

        ctx.restore();
    }

    // 绘制平台
    drawPlatforms() {
        const ctx = this.ctx;

        this.platforms.forEach(platform => {
            const drawX = platform.x - this.camera.x;
            const drawY = platform.y - this.camera.y;

            if (platform.type === 'ground') {
                // 绿色草地
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(drawX, drawY, platform.width, 20);
                // 棕色土壤
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(drawX, drawY + 20, platform.width, platform.height - 20);
                // 草地纹理
                ctx.fillStyle = '#388E3C';
                for (let i = 0; i < platform.width; i += 16) {
                    ctx.fillRect(drawX + i, drawY, 2, 8);
                    ctx.fillRect(drawX + i + 8, drawY + 4, 2, 6);
                }
            } else {
                // 砖块
                ctx.fillStyle = '#C84C0C';
                ctx.fillRect(drawX, drawY, platform.width, platform.height);
                // 砖块纹理
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                for (let i = 0; i < platform.width; i += 32) {
                    ctx.strokeRect(drawX + i, drawY, 32, 16);
                    ctx.strokeRect(drawX + i + 16, drawY + 16, 32, 16);
                }
            }
        });
    }

    // 绘制问号砖块
    drawQuestionBlocks() {
        const ctx = this.ctx;

        this.questionBlocks.forEach(block => {
            const drawX = block.x - this.camera.x;
            const drawY = block.y - this.camera.y - block.bounceY;

            if (block.used) {
                // 已使用的砖块
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(drawX, drawY, block.width, block.height);
                ctx.strokeStyle = '#5D3A1A';
                ctx.lineWidth = 2;
                ctx.strokeRect(drawX + 2, drawY + 2, block.width - 4, block.height - 4);
            } else {
                // 问号砖块
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(drawX, drawY, block.width, block.height);
                // 边框
                ctx.strokeStyle = '#C84C0C';
                ctx.lineWidth = 4;
                ctx.strokeRect(drawX, drawY, block.width, block.height);
                // 问号
                ctx.fillStyle = '#C84C0C';
                ctx.font = 'bold 32px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', drawX + block.width / 2, drawY + block.height / 2);
            }
        });
    }

    // 绘制金币
    drawCoins() {
        const ctx = this.ctx;

        this.coins.forEach(coin => {
            if (coin.collected) return;

            const drawX = coin.x - this.camera.x;
            const drawY = coin.y - this.camera.y;
            const frame = Math.floor(coin.animFrame);

            ctx.save();

            // 金币主体
            ctx.fillStyle = '#FFD700';
            const scale = 1 - Math.abs(frame - 1.5) * 0.2;
            ctx.fillRect(drawX + (24 - 24 * scale) / 2, drawY, 24 * scale, 24);

            // 金币高光
            ctx.fillStyle = '#FFF';
            ctx.fillRect(drawX + 4, drawY + 4, 6, 6);

            ctx.restore();
        });
    }

    // 绘制敌人
    drawEnemies() {
        const ctx = this.ctx;

        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;

            const drawX = enemy.x - this.camera.x;
            const drawY = enemy.y - this.camera.y;
            const frame = Math.floor(enemy.animFrame);

            // 蘑菇身体
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(drawX, drawY + 8, 32, 24);

            // 蘑菇头
            ctx.fillStyle = '#A0522D';
            ctx.beginPath();
            ctx.arc(drawX + 16, drawY + 12, 14, Math.PI, 0);
            ctx.fill();

            // 眼睛
            ctx.fillStyle = '#FFF';
            ctx.fillRect(drawX + 6, drawY + 14, 6, 8);
            ctx.fillRect(drawX + 20, drawY + 14, 6, 8);

            // 瞳孔
            ctx.fillStyle = '#000';
            ctx.fillRect(drawX + 8, drawY + 18, 3, 4);
            ctx.fillRect(drawX + 21, drawY + 18, 3, 4);

            // 脚（动画）
            ctx.fillStyle = '#5D3A1A';
            const footOffset = frame === 0 ? 0 : 4;
            ctx.fillRect(drawX + 4 - footOffset, drawY + 28, 10, 4);
            ctx.fillRect(drawX + 18 + footOffset, drawY + 28, 10, 4);
        });
    }

    // 绘制终点旗杆
    drawFlagPole() {
        if (!this.flagPole) return;

        const ctx = this.ctx;
        const pole = this.flagPole;
        const drawX = pole.x - this.camera.x;
        const drawY = pole.y - this.camera.y;

        // 旗杆
        ctx.fillStyle = '#228B22';
        ctx.fillRect(drawX + 8, drawY, 4, pole.height);

        // 顶部球
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(drawX + 10, drawY, 8, 0, Math.PI * 2);
        ctx.fill();

        // 旗帜
        const flagY = pole.flagRaised ? drawY : pole.flagY - this.camera.y;
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.moveTo(drawX + 12, flagY);
        ctx.lineTo(drawX + 60, flagY + 20);
        ctx.lineTo(drawX + 12, flagY + 40);
        ctx.closePath();
        ctx.fill();
    }

    // 绘制粒子
    drawParticles() {
        const ctx = this.ctx;

        this.particles.forEach(p => {
            const drawX = p.x - this.camera.x;
            const drawY = p.y - this.camera.y;
            ctx.globalAlpha = p.life / 30;
            ctx.fillStyle = p.color;
            ctx.fillRect(drawX - 4, drawY - 4, 8, 8);
        });
        ctx.globalAlpha = 1;
    }

    // 绘制背景
    drawBackground() {
        const ctx = this.ctx;

        // 绘制云朵（视差滚动）
        ctx.fillStyle = '#FFF';
        const cloudOffset = this.camera.x * 0.3;
        this.drawCloud(ctx, 100 - cloudOffset % 1200, 80);
        this.drawCloud(ctx, 400 - cloudOffset % 1200, 120);
        this.drawCloud(ctx, 700 - cloudOffset % 1200, 60);
        this.drawCloud(ctx, 1000 - cloudOffset % 1200, 100);
        this.drawCloud(ctx, 1300 - cloudOffset % 1200, 70);

        // 绘制远山（视差滚动）
        const mountainOffset = this.camera.x * 0.5;
        ctx.fillStyle = '#228B22';
        this.drawMountain(ctx, 200 - mountainOffset % 1500, 450, 200, 150);
        this.drawMountain(ctx, 600 - mountainOffset % 1500, 480, 150, 120);
        this.drawMountain(ctx, 1000 - mountainOffset % 1500, 460, 180, 140);
    }

    // 绘制云朵
    drawCloud(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 30, y - 10, 30, 0, Math.PI * 2);
        ctx.arc(x + 60, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 30, y + 10, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制山
    drawMountain(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width / 2, y - height);
        ctx.lineTo(x + width, y);
        ctx.closePath();
        ctx.fill();
    }

    // 游戏主循环
    gameLoop() {
        if (this.gameState === 'playing') {
            this.updatePlayer();
            this.updateEnemies();
            this.updateCoins();
            this.updateQuestionBlocks();
            this.updateParticles();
            this.updateFlagPole();
            this.handlePlatformCollisions();
            this.handleEnemyCollisions();
            this.handleCoinCollisions();
        }

        // 绘制
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawPlatforms();
        this.drawQuestionBlocks();
        this.drawCoins();
        this.drawEnemies();
        this.drawFlagPole();
        this.drawPlayer();
        this.drawParticles();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// 等待DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
