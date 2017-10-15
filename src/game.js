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

	init(score, lives, asteroidCnt, level)
	{
		this.asteroidCount = (asteroidCnt?asteroidCnt:15);
		this.asteroids = [];
		this.projectiles = [];
		for (var i = 0; i < this.asteroidCount; i++) 
		{
			// very convoluted way of making sure no asteroids spawn on top of each other
			var collides = true;
			while (collides)
			{
				collides = false;
				this.asteroids[i] = new Asteroid(this.width, this.height);
				for (var j = 0; j < i; j++)
				{
					if (this.asteroids[i].detectCollision(this.asteroids[j]))
					{
						collides = true;
						break;
					}
				}
			}
		}
		this.ship = new Ship(this.width, this.height);

		this.update = this.update.bind(this);
	    this.render = this.render.bind(this);
	    this.loop = this.loop.bind(this);
	    this.score = (score?score:0);
	    this.lives = (lives!=null?lives:3);
	    this.over = false;
	    this.level = (level!=null?level:1);

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

	drawExplosion()
	{
		var x = this.ship.x;
		var y = this.ship.y;
		var colors = ['white', 'yellow', 'orange', 'red'];

		for (var i = 3; i >= 0; i--)
		{
			var r = (i+1)*9;
			this.strokeStar(x, y, r, 7, 0.5, colors[i]);
		}
	}

	strokeStar(x, y, radius, count, ratio, color) 
	{
	    this.ctx.save();
	    this.ctx.fillStyle = color;
	    this.ctx.beginPath();
	    this.ctx.translate(x, y);
	    this.ctx.moveTo(0, -radius);
	    for (var i = 0; i < count; i++) 
	    {
	        this.ctx.rotate(Math.PI/count);
	        this.ctx.lineTo(0, -radius * ratio);
	        this.ctx.rotate(Math.PI/count);
	        this.ctx.lineTo(0, -radius);
	    }
	    this.ctx.closePath();
	    this.ctx.fill();
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
			this.ship.explosion.play();
			clearInterval(this.interval);
			//this.sfx[(Math.floor(Math.random()*100))%(this.sfx.length)].play();
			if (this.lives > 1)
			{
				this.over = true;
				this.drawExplosion();
				setTimeout(function() 
		        {
		        	this.init(this.score, this.lives-1, 0);
				}.bind(this), 2000);				
			}
			else
			{
				this.over = true;
				this.drawExplosion();
				this.gameOver();
			}
			return;
		}
		// start over, but keep the score
		if (this.asteroids.length === 0)
		{
			clearInterval(this.interval);
			this.init(this.score, this.lives, this.asteroidCount + 5, this.level + 1)
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
		this.ctx.fillText(scoreText , (20 + this.ship.width*4 - this.ctx.measureText(scoreText).width)/2, this.ship.height + 50);
		// render level indicator
		var level = 'level ' + this.level;
		this.ctx.fillText(level , (20 + this.ship.width*4 - this.ctx.measureText(level).width)/2, 25);
		this.ctx.restore();	

		// render remaining lives
		for (var i = 0; i < this.lives; i++)
		{
			this.ctx.save();
			this.ctx.strokeStyle = 'white';
			this.ctx.beginPath();
			this.ctx.translate((5 + this.ship.width) * (i+1), 30 + this.ship.height/2);
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