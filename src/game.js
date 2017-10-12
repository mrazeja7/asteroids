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

		this.asteroids = [];
		this.projectiles = [];
		for (var i = 0; i < 10; i++) {
			this.asteroids.push(new Asteroid(this.width, this.height));
		}
		this.ship = new Ship(this.width, this.height);

		this.update = this.update.bind(this);
	    this.render = this.render.bind(this);
	    this.loop = this.loop.bind(this);

	    this.interval = setInterval(this.loop, 10);
	}

	update()
	{
		this.ship.update();
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].update();

	}

	render()
	{
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ship.render(this.ctx);
		for (var i = 0; i < this.asteroids.length; i++)
			this.asteroids[i].render(this.ctx);
		this.ctx.restore();
	}

	loop()
	{
		this.update();
		this.render();
	}
}