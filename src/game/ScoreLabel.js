import { Scene } from "phaser"  

const formatScore = (score) => `Score ${score}`

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene,x,y,skor,style) {
      super(scene,x,y,formatScore(skor),style)
      this.score = skor
  }

  setScore(skor){
    this.score = skor
    this.setText(formatScore(this.score))
  }

  getScore(){
    return this.score;
  }

  add(point){
    this.setScore(this.score + point)
  }

}