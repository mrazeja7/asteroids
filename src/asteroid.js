export default class Asteroid
{
	constructor(screenWidth, screenHeight, x, y, radius, generation, angle, mass)
	{
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		// don't spawn too close to the ship
		// during a new game, asteroids can only spawn in this area:
		// |YES|YES|YES|YES|YES|
		// |YES|YES|YES|YES|YES|
		// |YES|YES|NO |YES|YES|
		// |YES|YES|YES|YES|YES|
		// |YES|YES|YES|YES|YES|
		if (x == null)
		{
			this.x = Math.random() * this.screenWidth;
			this.y = Math.random() * this.screenHeight;
			while (this.x > this.screenWidth*2/5 && this.x < this.screenWidth*3/5 && this.y > this.screenHeight*2/5 && this.y < this.screenHeight*3/5)
			{
				this.x = Math.random() * this.screenWidth;
				this.y = Math.random() * this.screenHeight;
			}
				
		}
		else
		{
			this.x = x;
			this.y = y;
		}
		
		this.generation = (generation?generation:1);
		this.radius = (radius?radius:25);
		this.angle = (angle?angle:Math.random()*2*Math.PI);
		this.mass = (mass?mass:Math.random());
		this.value = 10 * this.generation;
		this.shape = []; 
		var edgeCount = Math.floor(Math.random()*5 + 10);
		for (var i = 0; i < edgeCount; i++) 
		{
			var a = 2*Math.PI * i/edgeCount;
			var x = Math.cos(a) * (Math.random()+0.3) * this.radius;
			var y = Math.sin(a) * (Math.random()+0.3) * this.radius;
			this.shape.push({x: x, y: y});
		}

		this.bounce = new Audio('sounds/wallbounce.wav');
		this.bounce.load();
		this.bounce.volume = 0.1;
	}

	newPos()
	{
		this.x = Math.random() * this.screenWidth;
		this.y = Math.random() * this.screenHeight;
		while (this.x > this.screenWidth/3 && this.x < this.screenWidth*2/3)
			this.x = Math.random() * this.screenWidth;
		while (this.y > this.screenHeight/3 && this.y < this.screenHeight*2/3)
			this.y = Math.random() * this.screenHeight;
	}

	detectCollision(asteroid)
	{
		var distance = Math.sqrt(Math.pow((this.x - asteroid.x),2) + Math.pow((this.y - asteroid.y),2));
		return (distance <= asteroid.radius + this.radius);
	}

	stuck(asteroid)
	{
		var distance = Math.sqrt(Math.pow((this.x - asteroid.x),2) + Math.pow((this.y - asteroid.y),2));
		return (asteroid.radius + this.radius - distance >= 2);
	}

	update(asteroids)
	{
		//asteroid collisions could use more thinking/work
		for (var i = asteroids.length - 1; i >= 0; i--) 
		{
			if (this === asteroids[i])
				continue;
			if (this.detectCollision(asteroids[i]))
			{

				// the asteroids are probably stuck together. They will merge into one, bigger asteroid
				// this prevents a LOT of thrashing around
				if (this.stuck(asteroids[i])) 
				{
					this.mass += asteroids[i].mass;
					//this.radius += asteroids[i].radius;
					asteroids.splice(i, 1);
					break;
				}
				var tmp = this.angle;
				this.angle = asteroids[i].angle;
				asteroids[i].angle = tmp;
				this.bounce.play();
				break;
			}
		}
		
		this.velocity = {x:Math.cos(this.angle)/5, y:Math.sin(this.angle)/5};
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.x += this.screenWidth + this.radius; // we don't want a negative value
		this.x %= this.screenWidth + this.radius;
		this.y += this.screenHeight + this.radius; // we don't want a negative value
		this.y %= this.screenHeight + this.radius;
	}

	drawHitbox(ctx)
	{
		ctx.save();
		ctx.strokeStyle = 'red';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	render(ctx)
	{
		ctx.save();
		//ctx.globalAlpha = this.mass;
		ctx.strokeStyle = 'orange';
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.moveTo(this.shape[0].x, this.shape[0].y)
		for (var i = 1; i < this.shape.length; i++) 
		{
			ctx.lineTo(this.shape[i].x, this.shape[i].y);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
		//this.drawHitbox(ctx);

	}
}