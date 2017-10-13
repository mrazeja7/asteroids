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

		this.init();
	}

	init(score, lives, asteroidCnt)
	{
		this.asteroidCount = (asteroidCnt?asteroidCnt:10);
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
	    this.lives = (lives?lives:3);

	    this.interval = setInterval(this.loop, 10);
	}

	update()
	{
		this.score += this.ship.update(this.asteroids);
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].update();

		// start over, but keep the score
		if (this.asteroids.length === 0)
		{
			clearInterval(this.interval);
			this.init(this.score,this.lives,this.asteroidCount*1.5)
		}
	}

	render()
	{
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();
		this.ship.render(this.ctx);
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].render(this.ctx);		

		// render score
		this.ctx.save();
		this.ctx.font = '18px courier';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(('00000' + this.score).slice(-5), 5, this.ship.height + 45);
		this.ctx.restore();	

		// render remaining lives
		for (var i = 0; i < this.lives; i++) 
		{
			this.ctx.save();
			this.ctx.strokeStyle = 'white';
			this.ctx.beginPath();
			this.ctx.translate((5 + this.ship.width) * (i+1), 25 + this.ship.height/2);
			//this.ctx.rotate(this.angle + Math.PI/2);
			this.ctx.moveTo(0, -this.ship.height/2);
			this.ctx.lineTo(this.ship.width/2, this.ship.height/2);
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