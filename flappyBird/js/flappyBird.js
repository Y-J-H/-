var game = new Phaser.Game(288, 505, Phaser.AUTO, '#flappy-bird');

// 正在加载的场景
function boot() {

    this.init = function() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    };

    this.preload = function() {
        game.load.image('Progress-bar', 'images/preloader.gif');
    };

    this.create = function() {
        game.state.start('gameInitInterface');
    };
}

// 游戏初始界面
function gameInitInterface() {

    this.preload = function() {
        var progressImg = game.add.image(36, game.height / 2, 'Progress-bar');
        //progressImg.anchor.set(0.5);                               // 设置中心点为锚点
        game.load.setPreloadSprite(progressImg);                     // 根据已经加载的完成项来动态设置加载条的宽度

        game.load.image('background', 'images/background.png');       // 游戏的背景图
        game.load.spritesheet('bird', 'images/bird.png', 34, 24);     // 加载鸟的图集
        game.load.audio('flap', 'images/flap.wav');                   // 加载鸟拍打翅膀的声音
        game.load.image('gameover', 'images/gameover.png');           // 加载游戏结束的图片
        game.load.image('get-ready', 'images/get-ready.png');         // 加载准备游戏的图片
        game.load.image('ground', 'images/ground.png');               // 加载地面
        game.load.image('ground-hit', 'images/ground-hit.wav');       // 加载鸟撞到地面的声音
        game.load.image('instructions', 'images/instructions.png');   // 加载点击开始的图片
        game.load.image('medals', 'images/medals.png');               // 加载勋章图片
        game.load.audio('ouch', 'images/ouch.wav');                   // ???
        game.load.audio('pipe-hit', 'images/pipe-hit.wav');           // 加载撞击到管道的声音
        game.load.spritesheet('pipes', 'images/pipes.png',54,320);          // 加载管道
        game.load.audio('score', 'images/score.wav');                 // 加载得分的声音
        game.load.image('scoreboard', 'images/scoreboard.png');       // 加载最终分数的图片
        game.load.image('start-button', 'images/start-button.png');   // 加载开始按钮
        game.load.image('title', 'images/title.png');                 // 加载标题
        game.load.spritesheet('yb', 'images/yuebing.png',96,98);                  // 加载月饼图片

        // 加载自己制作的图片字体
        game.load.bitmapFont('flappyFont', 'images/fonts/flappyfont/flappyfont.png',
            'images/fonts/flappyfont/flappyfont.fnt');
    };

    // 预加载完成后向当前页面上添加东西
    this.create = function() {

        // 添加一张背景,因为地面和背景都是一直在运动的所以,地面和背景应该是利用了瓦片精灵来制作的
        var tileBg = game.add.tileSprite(0, 0, game.width, game.height, 'background');
        tileBg.autoScroll(-20, 0);

        // 添加地面,这里的112能不能写成一个变量呢
        var tileGround = game.add.tileSprite(0, game.height - 112, game.width, 112, 'ground');
        tileGround.autoScroll(-100, 0);

        //  添加一个标题和小鸟, 因为小鸟和标题是一起动的所以添加在了同一个组中
        var birdTitleGroup = game.add.group();
        var titleImg = game.add.image(0, 0, 'title', null, birdTitleGroup);
        var bird = game.add.sprite(190, 12, 'bird', 0, birdTitleGroup);
        birdTitleGroup.position.x = 35;
        birdTitleGroup.position.y = 80;

        // 给小鸟添加动画(逐帧动画)
        bird.animations.add('fly', [0, 1, 2]);

        // 播放小鸟的动画
        bird.animations.play('fly', 30, true);

        // 给整个组添加补间动画
        var birdTitleGroupTween = game.add.tween(birdTitleGroup);
        birdTitleGroupTween.to({y: birdTitleGroup.position.y + 30}, 1000, null, true, 0, -1, true);

        // 添加一个按钮
        var startButton = game.add.button(0, 0, 'start-button');
        startButton.position.x = game.width / 2;
        startButton.position.y = game.height / 2;
        startButton.anchor.set(0.5);

        // 给按钮添加一个事件监听,首先开启输入事件
        startButton.inputEnabled = true;
        //console.log(startButton);
        startButton.onInputDown.add(function() {

            // 到游戏开始界面
            game.state.start('startGame');
        }, this);
    };
}

// 游戏开始界面
function startGame() {

    this.create = function() {
        game.tileBg = game.add.tileSprite(0, 0, game.width, game.height, 'background');           // 添加背景
        game.pipeGroup = game.add.group();                                                        // 设置一个组用于存放管道 让组在地面的后面添加这样就能让地面盖住下方管道了
        game.tileGround = game.add.tileSprite(0, game.height - 112, game.width, 112, 'ground');   // 添加地面
        game.getReady = game.add.image(52, 60, 'get-ready');                                      // 添加准备标题
        game.beginImg = game.add.image(87, game.height - 112 - 98, 'instructions');               // 添加提示开始的图片
        game.bird = game.add.sprite(62, 162, 'bird');                                             // 添加小鸟
        game.bird.anchor.setTo(0.5, 0.5);                                                         // 设置鸟的中心点
        game.bird.animations.add('fly');                                                          // 给小鸟添加动画(逐帧动画)
        game.bird.animations.play('fly', 12, true);                                               // 播放小鸟的动画
        game.ybGroup = game.add.group();

        game.ybGroup.enableBody = true;                                                           // 为月饼组中元素开启物理引擎
        game.pipeGroup.enableBody = true;                                                         // 为管道组中元素开启物理引擎
        game.physics.enable(game.bird, Phaser.Physics.ARCADE);                                    // 开启鸟的物理引擎
        game.physics.enable(game.tileGround, Phaser.Physics.ARCADE);                              // 开启地面的物理引擎
        game.tileGround.body.immovable = true;                                                    // 设置地面固定

        game.isBegin = false;                                                                     // 判断游戏是否已启动
        game.tileBg.inputEnabled = true;
        game.time.events.loop(1200, createPipe,this);                                            // 利用时钟对象产生管道和月饼
        game.time.events.stop(false);
        // 点击tileBg对象开始游戏
        game.tileBg.events.onInputDown.addOnce(beginGame, this);                                  // addOnce:只会触发一次的事件
    };

    this.update = function() {
        if (!game.isBegin) {
            return '';
        }

        if(game.input.activePointer.isDown){
            birdFly();
        }

        if(game.bird.angle < 90){
            game.bird.angle += 2.2;
        }

        isOver();
        gemaOver();
    };

    // 开始游戏的函数
    function beginGame() {
        game.score = 0;                                        // 统计得分
        game.groundAndPipeSpeed = 200;                         // 设定管道和地面的运动速度
        game.bird.speed = 200;                                 // 设定鸟的运动速度(鸟下坠的速度)
        game.bird.body.velocity.y = - game.bird.speed;
        game.isOver = false;                                   // 判断游戏是否结束
        game.bird.body.gravity.y = 1200;                       // 给鸟添加一个重力(给鸟添加一个重力,鸟就会向下运动,那么此时鸟就会产生一个向下的加速度(个人理解))
        console.log(game.bird.body);
        game.pipeDis = 100;                                    // 设置两个管道之间的间距
        game.i = 1;                                            // 控制gemaOver()只运行一次,否则的话图片上会有明显的黑边
        game.showScoreTxt = game.add.bitmapText(30, 38, 'flappyFont', game.score+'', 40);      // 显示分数
        game.tileBg.autoScroll(-20,0);                         // 让背景和地面自动滚动
        game.tileGround.autoScroll(-game.groundAndPipeSpeed,0);
        game.isBegin = true;
        game.time.events.start();
        // 隐藏标题和提示的图片(销毁标题和提示的图片对象)
        game.getReady.destroy();
        game.beginImg.destroy();
    }

    // 让鸟飞的方法
    function birdFly(){

        // 如果游戏结束那么在点击鼠标应该是没有效果的
        if(game.isOver){
            return '';
        }
        game.bird.body.velocity.y = - game.bird.speed;
        game.add.tween(game.bird).to({angle : -30},180,null,true,0,0,true);      // 设置鸟头能向上翘
    }

    // 产生管道和月饼的方法
    function createPipe(){

        // console.log(game.height - 112 - game.pipeDis);        剩余上管道加下管道的高度加空白
        // 随机产生上管道的高度, 下管道是由上管道来决定的,并不需要求出下管道的高度
        var topPipeH = (game.height - 112 - game.pipeDis) * Math.random();

        // 控制上管道的最小高度和最大高度
        if(topPipeH < 120){         // 最小高度
            topPipeH = 120;
        }
        if(topPipeH > 180){         // 最大高度
            topPipeH = 180;
        }

        // 添加上方管道和下方管道
        game.topPipe = game.add.sprite(game.width, topPipeH - 320 ,'pipes',0,game.pipeGroup);
        game.bottomPipe = game.add.sprite(game.width, topPipeH + game.pipeDis,'pipes',1,game.pipeGroup);
        game.yb = game.add.sprite(game.width + 16 , topPipeH + 20 + parseInt(Math.random() * (game.pipeDis - 40)),'yb',0, game.ybGroup);
        game.yb.scale.x = 0.25;
        game.yb.scale.y = 0.25;

        // 让管道组向左运动
        game.pipeGroup.setAll('body.velocity.x', -game.groundAndPipeSpeed);    //设置管道运动的速度
        game.ybGroup.setAll('body.velocity.x', -game.groundAndPipeSpeed);

        game.pipeGroup.setAll('body.immovable',true);                          // 让管道中的元素都固定,要设定在添加管道之后
        game.ybGroup.setAll('body.immovable',true);
    }

    // 碰撞检测
    function isOver(){

        // 鸟碰撞到地面
        game.physics.arcade.collide(game.tileGround,game.bird,function(){
            game.isOver = true;
        });

        // 鸟与管道相撞
        game.physics.arcade.overlap(game.pipeGroup,game.bird,function(){
            game.isOver = true;
        });

        // 鸟语月饼向撞
        game.physics.arcade.overlap(game.ybGroup,game.bird,addScore,null,this);


    }

    // 加分方法
    function addScore(){
        //console.log(arguments);
        arguments[1].destroy();

        game.score ++;

        // 改变显示的分数
        game.showScoreTxt.text = game.score;
    }

    // 游戏结束
    function gemaOver(){

        if(game.i === 1 && game.isOver){
            // 地面和背景停止运动,停止时钟，清除点击事件
            game.time.events.stop(false);
            game.tileBg.autoScroll(0);
            game.tileGround.autoScroll(0);
            game.pipeGroup.setAll('body.velocity.x', 0);
            game.ybGroup.setAll('body.velocity.x', 0);
            game.bestScore = game.bestScore || 0;
            if(game.score > game.bestScore) game.bestScore = game.score;
            this.gameOverGroup = game.add.group();
            var gameOverText = this.gameOverGroup.create(game.width/2, 0, 'gameover');
            var scoreboard = this.gameOverGroup.create(game.width/2, 70, 'scoreboard');
            var currentScoreText = game.add.bitmapText(game.width/2 + 60, 138, 'flappyFont', game.score+'', 20, game.gameOverGroup);
            var bestScoreText = game.add.bitmapText(game.width/2 + 60, 185, 'flappyFont', game.bestScore+'', 20, game.gameOverGroup);
            var replayBtn = game.add.button(game.width/2, 210, 'start-button', function() {
                game.state.start('startGame');
            }, this, null, null, null, null, this.gameOverGroup);
            gameOverText.anchor.setTo(0.5, 0);
            scoreboard.anchor.setTo(0.5, 0);
            replayBtn.anchor.setTo(0.5, 0);
            this.gameOverGroup.y = 30;
            game.add.tween(game.bird).to({angle : 90},100,null,true,0,0,true);      // 让鸟头不在能向上翘
            game.i = 0;
        }
    }
}

game.state.add('boot', boot);
game.state.add('gameInitInterface', gameInitInterface);
game.state.add('startGame', startGame);

game.state.start('boot');
