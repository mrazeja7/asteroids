export default class Asteroid
{
	constructor(screenWidth, screenHeight, x, y, radius, generation, angle, mass)
	{
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		// don't spawn too close to the ship
		// during a new game, asteroids can only spawn in this area:
		// |YES|YES|YES|
		// |YES|NO |YES|
		// |YES|YES|YES|
		if (x == null)
		{
			this.x = Math.random() * this.screenWidth;
			this.y = Math.random() * this.screenHeight;
			while (this.x > this.screenWidth/3 && this.x < this.screenWidth*2/3)
				this.x = Math.random() * this.screenWidth;
			while (this.y > this.screenHeight/3 && this.y < this.screenHeight*2/3)
				this.y = Math.random() * this.screenHeight;
		}
		else
		{
			this.x = x;
			this.y = y;
		}
		
		this.generation = (generation?generation:1);
		this.radius = (radius?radius:40);
		this.angle = (angle?angle:Math.random()*2*Math.PI);
		this.mass = (mass?mass:Math.random());
		this.value = 10 * this.generation;
		//this.velocity = {x:Math.cos(this.angle)/5, y:Math.sin(this.angle)/5};
		this.shape = []; 
		var edgeCount = Math.floor(Math.random()*5 + 10);
		for (var i = 0; i < edgeCount; i++) 
		{
			var a = 2*Math.PI * i/edgeCount;
			var x = Math.cos(a) * (Math.random()+0.3) * this.radius;
			var y = Math.sin(a) * (Math.random()+0.3) * this.radius;
			this.shape.push({x: x, y: y});
		}
	}

	detectCollision(asteroid)
	{
		var distance = Math.sqrt(Math.pow((this.x - asteroid.x),2) + Math.pow((this.y - asteroid.y),2));
		return (distance <= asteroid.radius + this.radius);
	}

	update(asteroids)
	{
		//asteroid collisions need a lot of thinking/work
		for (var i = 0; i < asteroids.length; i++) 
		{
			if (this === asteroids[i])
				continue;
			if (this.detectCollision(asteroids[i]))
			{
				//console.log('bump');
				var tmp = this.angle;
				this.angle = asteroids[i].angle;
				asteroids[i].angle = tmp;

				break;

				/*this.x += Math.cos(this.angle);
				this.y += Math.sin(this.angle);*/
				//return;
			}
		}
		
		this.velocity = {x:Math.cos(this.angle)/5, y:Math.sin(this.angle)/5};
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.x += this.screenWidth; // we don't want a negative value
		this.x %= this.screenWidth;
		this.y += this.screenHeight; // we don't want a negative value
		this.y %= this.screenHeight;
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