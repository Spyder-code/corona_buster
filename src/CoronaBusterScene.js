import Phaser from "phaser"
import FallingObject from "./game/FallingObject"
import Laser from "./game/Laser"
import LifeLabel from "./game/LifeLabel"
import ScoreLabel from "./game/ScoreLabel"

export default class CoronaBusterScene extends Phaser.Scene {
    constructor() {
        super("corona-buster-scene")
    }

    init() {
        this.clouds = undefined
        this.nav_left = false
        this.nav_right = false
        this.shoot = false
        this.player = undefined
        this.speed = 300
        this.cursor = undefined
        this.key_a = undefined
        this.key_d = undefined
        this.enemies = undefined
        this.enemySpeed = 60
        this.rotationVal = 10
        this.lasers = undefined
        this.lastFired = 0
        this.scoreLabel = undefined
        this.lifeLabel = undefined
    }

    preload() {
        this.load.image('background','assets/images/bg_layer1.png')
        this.load.image('cloud','assets/images/cloud.png')
        this.load.image('left-btn','assets/images/left-btn.png')
        this.load.image('right-btn','assets/images/right-btn.png')
        this.load.image('shoot-btn','assets/images/shoot-btn.png')
        this.load.spritesheet('player','assets/images/ship.png',{
            frameWidth:66, 
            frameHeight:66
        })
        this.load.image('enemy','assets/images/enemy.png')
        this.load.spritesheet('laser','assets/images/laser-bolts.png',{
            frameWidth:16,
            frameHeight:32,
            startFrame:16,
            endFrame:32
        })
    }

    create() {
        const gameWidth = this.scale.width * 0.5
        const gameHeight = this.scale.height * 0.5
        this.add.image(gameWidth,gameHeight,'background')

        this.clouds = this.physics.add.group({
            key: 'cloud',
            repeat: 20,
        })

        Phaser.Actions.RandomRectangle(this.clouds.getChildren(),this.physics.world.bounds)

        this.createButton()
        this.player = this.createPlayer()

        this.cursor = this.input.keyboard.createCursorKeys()
        this.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        this.enemies = this.physics.add.group({
            classType : FallingObject,
            maxSize : 10,
            runChildUpdate : true
        })

        this.time.addEvent({
            delay : 2000,
            callback : this.spawnEnemy,
            callbackScope : this,
            loop : true
        })

        this.lasers = this.physics.add.group({
            classType: Laser,
            maxSize: 10,
            runChildUpdate: true
        })

        this.physics.add.overlap(this.lasers,this.enemies,this.hitEnemy,null,this)
        this.scoreLabel = this.creareScoreLabel(16,16,0)
        this.lifeLabel = this.createLifeLabel(16,43,3)
        this.physics.add.overlap(this.player,this.enemies,this.decreaseLife,null,this)
    }

    update(time) {
        this.clouds.children.iterate((child)=>{
            child.setVelocity(20)
            if (child.y > this.scale.height) {
                child.x = Phaser.Math.Between(10, 400)
                child.y = child.displayHeight * -1
            }
        }, this)

        this.movePlayer(this.player, time)
    }

    createButton() {
        this.input.addPointer(3)
        let shoot = this.add.image(320,550,'shoot-btn').setInteractive().setDepth(.5).setAlpha(.8)
        let nav_left = this.add.image(50,550,'left-btn').setInteractive().setDepth(.5).setAlpha(.8)
        let nav_right = this.add.image(nav_left.x + nav_left.displayWidth + 20,550,'right-btn').setInteractive().setDepth(.5).setAlpha(.8)

        nav_left.on('pointerdown', ()=> {
            this.nav_left = true
        }, this)

        nav_right.on('pointerdown', ()=> {
            this.nav_right = true
        }, this)

        nav_left.on('pointerout', ()=> {
            this.nav_left = false
        }, this)

        nav_right.on('pointerout', ()=> {
            this.nav_right = false
        }, this)

        shoot.on('pointerdown',()=>{
            this.shoot = true
        }, this)

        shoot.on('pointerout',()=>{
            this.shoot = false
        }, this)
    }

    createPlayer(){
        const player = this.physics.add.sprite(200,450,'player')
        player.setCollideWorldBounds(true)

        this.anims.create({
            key:'turn',
            frames:[{
                key:'player',
                frame:0
            }]
        })
        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers('player',{
                start: 1,
                end:2
            }),
            frameRate:10
        })
        this.anims.create({
            key:'right',
            frames: this.anims.generateFrameNumbers('player',{
                start: 1,
                end:2
            }),
            frameRate:10
        })

        return player
    }

    movePlayer(player,time){
        if(this.cursor.left.isDown || this.nav_left || this.key_a.isDown){
            this.player.setVelocityX(this.speed * -1)
            this.player.anims.play('left',true)
            this.player.setFlipX(false)
        }else if(this.cursor.right.isDown || this.nav_right || this.key_d.isDown){
            this.player.setVelocityX(this.speed * 1)
            this.player.anims.play('right',true)
            this.player.setFlipX(true)
        }else{
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }

        if ((this.shoot) && time > this.lastFired) {
            const laser = this.lasers.get(0,0,'laser')
            if(laser){
                laser.fire(this.player.x,this.player.y)
                this.lastFired = time + 150
            }
        }
    }

    spawnEnemy(){
        const config = {
            speed : this.enemySpeed,
            rotation : 0.06
        }
    
        const enemy = this.enemies.get(0,0,'enemy',config)
        const enemyWidth = enemy.displayWidth
        const positionX = Phaser.Math.Between(enemyWidth, this.scale.width - enemyWidth)
    
        if(enemy){
            enemy.spawn(positionX)
        }
    }

    hitEnemy(laser, enemy){
        laser.erase()
        enemy.die()

        this.scoreLabel.add(10)
        if(this.scoreLabel.getScore() % 100 ==0){
            this.enemySpeed += 30
        }
    }

    creareScoreLabel(x,y,skore){
        const style = {fontSize:'32px', fill:'#000'}
        const label = new ScoreLabel(this,x,y,skore,style).setDepth(1)
        this.add.existing(label)
        return label
    }

    createLifeLabel(x,y,life){
        const style = {
            fontSize:'32px',
            fill:'#000'
        }
        const label = new LifeLabel(this,x,y,life,style).setDepth(1)
        this.add.existing(label)
        return label
    }

    decreaseLife(player,enemy){
        enemy.die()
        this.lifeLabel.subtract(1)

        if(this.lifeLabel.getLife() == 2){
            player.setTint('0xff0000')
        }else if(this.lifeLabel.getLife() == 1){
            player.setTint('0xff0000').setAlpha(.2)
        }else if(this.lifeLabel.getLife() == 0){
            this.scene.start('game-over-scene',{
                score: this.scoreLabel.getScore()
            })
        }
    }
}