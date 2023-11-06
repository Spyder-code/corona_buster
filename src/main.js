import Phaser from 'phaser'

import CoronaBusterScene from './CoronaBusterScene'
import GameOverScene from './GameOverScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 620,
	physics: {
		default: 'arcade'
	},
	scale:{
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [CoronaBusterScene, GameOverScene],
}

export default new Phaser.Game(config)
