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
				
		this.update = this.update.bind(this);
	    this.render = this.render.bind(this);
	    this.loop = this.loop.bind(this);
	    this.menuLoop = this.menuLoop.bind(this);

	    this.startMenu();
	}

	generateAsteroids(count)
	{
		this.asteroidCount = count;
		this.asteroids = [];
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
	}

	init(score, lives, asteroidCnt, level, help)
	{
		this.generateAsteroids(asteroidCnt?asteroidCnt:15);
		this.projectiles = [];
		this.ship = new Ship(this.width, this.height);		
	    
	    this.score = (score?score:0);
	    this.lives = (lives!=null?lives:3);
	    this.over = false;
	    this.displayTooltip = help;
	    this.level = (level!=null?level:1);
	    this.newLevel = new Audio('sounds/Powerup90.wav');
		this.newLevel.load();
		this.newLevel.volume = 0.2;

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
		this.ctx.fillText(text, (this.canvas.width - this.ctx.measureText(text).width)/2, this.canvas.height/2);
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

	startMenu()
	{
		window.onkeydown = this.menuHandler.bind(this);
		this.generateAsteroids(20);
		this.interval = setInterval(this.menuLoop, 10);
	}

	menuHandler(event)
	{
		event.preventDefault();
		var key = event.key;
	    switch(key)
	    {
	    	case ' ':
	    		clearInterval(this.interval);
	    		window.onkeydown = this.handleKeyDown.bind(this);
	    		window.onkeyup = this.handleKeyUp.bind(this);
				this.init();
				this.displayTooltip = true;
				return;
	      	default:
	      		console.log(key);
	      		break;
	    }
	}

	menuLoop()
	{
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].update(this.asteroids);

		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].render(this.ctx);

		this.ctx.save();
		this.ctx.font = '20px courier';
		this.ctx.fillStyle = 'white';
		var text = 'Press space to start playing';
		this.ctx.fillText(text , (this.canvas.width - this.ctx.measureText(text).width)/2, this.canvas.height/2);
		this.ctx.restore();	

	}

	handleKeyDown(event)
	{
		event.preventDefault();
		var key = event.key;
	    switch(key)
	    {
	    	case ' ':
				this.ship.firing = true;
				break;
	      	case 'ArrowLeft':
	      	case 'a':
		        this.ship.rotation = -Math.PI/100;
		        break;
	      	case 'ArrowRight':
	      	case 'd':
		        this.ship.rotation = Math.PI/100;
		        break;
		    case 'ArrowUp':
	      	case 'w':
      			this.ship.accelerating = true;
			    break;
		    case 'ArrowDown':
	      	case 's':
      			this.ship.braking = true;
		        break;
		    case 'f':
		    	this.ship.rapidFire = !this.ship.rapidFire;
		    	break;
		    case 'Escape':
		    	this.displayTooltip = !this.displayTooltip;
		    	break;
		    case 'r':
		    	this.ship.warp();
		    	break;
	      	default:
	      		console.log(key);
	      		break;
	    }
	}
	handleKeyUp(event)
	{
		event.preventDefault();
		var key = event.key;
		switch(key)
	    {
			case 'ArrowLeft':
			case 'a':
			case 'ArrowRight':
			case 'd':
				this.ship.rotation = 0;				
				break;
			case 'ArrowUp':
			case 'w':
				this.ship.accelerating = false;
				break;
			case 'ArrowDown':
			case 's':
				this.ship.braking = false;
				break;
			case ' ':
				this.ship.firing = false;
				break;
			default:
				return;
	    }
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
			if (this.lives > 1)
			{
				this.over = true;
				this.drawExplosion();
				setTimeout(function() 
		        {
		        	this.init(this.score, this.lives-1, this.asteroidCount, 
	        					this.level, this.displayTooltip);
				}.bind(this), 2000);
			}
			else
			{
				this.over = true;
				this.drawExplosion();
				this.gameOver();
				setTimeout(function() 
		        {
		        	this.startMenu();
				}.bind(this), 5000);
			}
			return;
		}
		// start over, but keep the score
		if (this.asteroids.length === 0)
		{
			clearInterval(this.interval);
			this.newLevel.play();
			this.init(this.score, this.lives, this.asteroidCount + 5, this.level + 1)
		}
	}

	render()
	{
		if (this.over)
			return;
		// render the background
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();

		this.ship.render(this.ctx);

		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].render(this.ctx);

		// render score and level indicator
		this.renderScore();

		// render remaining lives
		this.renderLives();

		if (this.displayTooltip)
			this.renderHelp();
	}

	renderScore()
	{
		this.ctx.save();
		this.ctx.font = '20px courier';
		this.ctx.fillStyle = 'white';
		var scoreText = ('00000' + this.score).slice(-5);
		this.ctx.fillText(scoreText , (20 + this.ship.width*4 - this.ctx.measureText(scoreText).width)/2, this.ship.height + 50);

		var level = 'level ' + this.level;
		this.ctx.fillText(level , (20 + this.ship.width*4 - this.ctx.measureText(level).width)/2, 25);
		this.ctx.restore();	

	}

	renderLives()
	{
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

	renderHelp()
	{
		this.ctx.save();
		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		this.ctx.globalAlpha = 0.5;
		var text = ['Press cursor keys or WASD to move','Press space to shoot',
					'Press F to toggle rapid fire mode (no firing sound)','Press R to warp to a random location','Press Escape to toggle this tooltip'];
		for (var i = 0; i < text.length; i++)
			this.ctx.fillText(text[i] , (this.canvas.width - this.ctx.measureText(text[i]).width)/2, this.canvas.height*3/4 + 20*i);

		this.ctx.restore();	
	}

	loop()
	{
		this.update();
		this.render();
	}
}