import Phaser from "phaser"

export default class CoronaBusterScene extends Phaser.Scene {
    constructor() {
        super("corona-buster-scene")
    }

    init() {
        this.clouds = undefined
        this.nav_left = false
        this.nav_right = false
        this.shoot = false
    }

    preload() {
        this.load.image('background','assets/images/bg_layer1.png')
        this.load.image('cloud','assets/images/cloud.png')
        this.load.image('left-btn','assets/images/left-btn.png')
        this.load.image('right-btn','assets/images/right-btn.png')
        this.load.image('shoot-btn','assets/images/shoot-btn.png')
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
    }

    update() {
        this.clouds.children.iterate((child)=>{
            child.setVelocity(20)
            if (child.y > this.scale.height) {
                child.x = Phaser.Math.Between(10, 400)
                child.y = child.displayHeight * -1
            }
        })
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
    }
}