import Asteroid from './asteroid'

export default class Projectile
{
	constructor(x, y, a)
	{
		this.x = x;
		this.y = y;
		this.angle = a;
		this.width = 4;
		this.height = 12;
		this.velocity = {x:Math.cos(this.angle)*3, y:Math.sin(this.angle)*3};
		this.active = true;
		this.distanceLeft = 500;
	}

	update()
	{
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.distanceLeft -= Math.sqrt(Math.pow(this.velocity.x,2) + Math.pow(this.velocity.y,2));
		if (this.distanceLeft <= 0)
			this.active = false;
	}

	detectCollision(asteroid)
	{
		var distance = Math.sqrt(Math.pow((this.x - asteroid.x),2) + Math.pow((this.y - asteroid.y),2));
		return (distance <= asteroid.radius);
	}

	hit(asteroids)
	{
		// circular hitbox, not accurate at all
		for (var i = asteroids.length - 1; i >= 0; i--) 
		{
			if (this.detectCollision(asteroids[i]))
			{
				this.active = false;
				if (asteroids[i].generation === 1)
				{
					// new asteroids move 45 degrees outwards
					var newAsteroid1 = new Asteroid(asteroids[i].screenWidth, asteroids[i].screenHeight,
												asteroids[i].x, asteroids[i].y, asteroids[i].radius/2, 2, this.angle - Math.PI/4);
					var newAsteroid2 = new Asteroid(asteroids[i].screenWidth, asteroids[i].screenHeight,
												asteroids[i].x, asteroids[i].y, asteroids[i].radius/2, 2, this.angle + Math.PI/4);

					asteroids.push(newAsteroid1);
					asteroids.push(newAsteroid2);
				}
				var score = asteroids[i].value;
				asteroids.splice(i, 1);

				return score;
			}
		}
		return 0;
	}

	render(ctx)
	{
		ctx.save();
		ctx.fillStyle = 'white';
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle + Math.PI/2);
		ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
		ctx.restore();
	}
}