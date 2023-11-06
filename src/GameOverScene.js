import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene{
  constructor(){
    super('game-over-scene')
  }

  init(data){
    this.score = data.score
  }

  preload(){
    this.load.image('background','assets/images/bg_layer1.png')
    this.load.image('gameover','assets/images/gameover.png')
    this.load.image('replay','assets/images/replay.png')
  }

  create(){
    this.add.image(200,320,'background')
    this.add.image(200,200,'gameover')
    this.replyButton = this.add.image(200, 530, 'replay').setInteractive()

    this.replyButton.once('pointerup', ()=>{
      this.scene.start('corona-buster-scene')
    })

    this.add.text(80,300,`Score ${this.score}`, {fontSize:'60px',fill:'#000'})
  }
}