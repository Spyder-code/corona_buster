import Phaser from "phaser";

let formatLife = (life) => `Life ${life}`

export default class LifeLabel extends Phaser.GameObjects.Text{
  constructor(scene, x, y, lifePlayer, style){
    super(scene, x, y, formatLife(lifePlayer), style)
    this.life = lifePlayer
  }

  setLife(lifePlayer){
    this.life = lifePlayer
    this.setText(formatLife(lifePlayer))
  }

  getLife(){
    return this.life
  }

  add(point){
    this.setLife(this.life + point)
  }

  subtract(value){
    this.setLife(this.life - value)
  }
}