import './index.css';
import Ship from './ship'
import Projectile from './projectile'
import Asteroid from './asteroid'

export default class Game
{
	constructor()
	{
		this.width = 800;
		this.height = 600;
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext('2d');
		document.body.appendChild(this.canvas);
		/*this.sfx = [new Audio('sounds/kurva.mp3'),new Audio('sounds/past-vedle-pasti-pico.mp3'),new Audio('sounds/to-sou-nervy-ty-pico.mp3'),new Audio('sounds/hajzli-jedni.mp3')];
		for (var i = 0; i < this.sfx.length; i++) 
		{
			this.sfx[i].load();
			this.sfx[i].volume = 0.2;
		}*/

		this.init();
	}

	init(score, lives, asteroidCnt)
	{
		//console.log('starting new game');
		this.asteroidCount = (asteroidCnt?asteroidCnt:15);
		this.asteroids = [];
		this.projectiles = [];
		for (var i = 0; i < this.asteroidCount; i++) {
			this.asteroids.push(new Asteroid(this.width, this.height));
		}
		this.ship = new Ship(this.width, this.height);

		this.update = this.update.bind(this);
	    this.render = this.render.bind(this);
	    this.loop = this.loop.bind(this);
	    this.score = (score?score:0);
	    this.lives = (lives!=null?lives:3);
	    this.over = false;

	    this.interval = setInterval(this.loop, 10);
	}

	gameOver()
	{
		this.ctx.save();

		this.ctx.fillStyle = 'black';
		this.ctx.strokeStyle = 'white';
		this.ctx.fillRect(this.canvas.width/4, this.canvas.height/4, this.canvas.width/2, this.canvas.height/2);
		this.ctx.strokeRect(this.canvas.width/4, this.canvas.height/4, this.canvas.width/2, this.canvas.height/2);
		this.ctx.font = '20px courier';
		this.ctx.fillStyle = 'white';
		var text = 'You lost!';
		this.ctx.fillText(text, (this.canvas.width - this.ctx.measureText(text).width)/2, this.canvas.height/2);3
		text = 'You scored ' + this.score + ' points.';
		this.ctx.fillText(text, (this.canvas.width - this.ctx.measureText(text).width)/2, this.canvas.height/2 + 25);

		this.ctx.restore();
	}

	update()
	{
		if (this.over)
			return;
		this.score += this.ship.update(this.asteroids);
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].update(this.asteroids);

		if (this.ship.hit(this.asteroids))
		{
			// game over
			clearInterval(this.interval);
			//this.sfx[(Math.floor(Math.random()*100))%(this.sfx.length)].play();
			if (this.lives > 1)
				this.init(this.score, this.lives-1, 0);
			else
			{
				this.over = true;
				this.gameOver();
			}
			return;
		}
		// start over, but keep the score
		if (this.asteroids.length === 0)
		{
			clearInterval(this.interval);
			this.init(this.score, this.lives, this.asteroidCount*1.5)
		}
	}

	render()
	{
		if (this.over)
			return;
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();
		this.ship.render(this.ctx);
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].render(this.ctx);		

		// render score
		this.ctx.save();
		this.ctx.font = '20px courier';
		this.ctx.fillStyle = 'white';
		var scoreText = ('00000' + this.score).slice(-5);
		this.ctx.fillText(scoreText , (20 + this.ship.width*4 - this.ctx.measureText(scoreText).width)/2, this.ship.height + 45);
		this.ctx.restore();	

		// render remaining lives
		for (var i = 0; i < this.lives; i++)
		{
			this.ctx.save();
			this.ctx.strokeStyle = 'white';
			this.ctx.beginPath();
			this.ctx.translate((5 + this.ship.width) * (i+1), 25 + this.ship.height/2);
			this.ctx.moveTo(0, -this.ship.height/2);
			this.ctx.lineTo(this.ship.width/2, this.ship.height/2);
			this.ctx.lineTo(0,this.ship.height/3);
			this.ctx.lineTo(-this.ship.width/2, this.ship.height/2);
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.restore();
		}		
	}

	loop()
	{
		this.update();
		this.render();
	}
}