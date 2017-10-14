import Projectile from './projectile'

export default class Ship
{
	constructor(screenWidth, screenHeight)
	{
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.height = 30;
		this.width = 18;
		this.x = screenWidth/2;
		this.y = screenHeight/2;
		this.angle = 0;
		this.angularSpeed = 0;
		this.velocity = {x: 0, y: 0};

		window.onkeydown = this.handleKeyDown.bind(this);
		window.onkeyup = this.handleKeyUp.bind(this);

		this.accelerating = false;
		this.braking = false;

		this.projectiles = [];
		this.canFire = true;
	}

	handleKeyDown(event)
	{
		event.preventDefault();
		var key = event.key;
	    switch(key)
	    {
	    	case ' ':
				this.firing = true;
				break;
	      	case 'ArrowLeft':
	      	case 'a':
		        this.angularSpeed = -Math.PI/100;
		        //console.log('left');
		        break;
	      	case 'ArrowRight':
	      	case 'd':
		        this.angularSpeed = Math.PI/100;
		        //console.log('right');
		        break;
		    case 'ArrowUp':
	      	case 'w':
      			this.accelerating = true;
      			//console.log('forwards');
			    break;
		    case 'ArrowDown':
	      	case 's':
      			this.braking = true;
	        	//console.log('backwards');
		        break;
	      	default:
	        	return;
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
				this.angularSpeed = 0;				
				break;
			case 'ArrowUp':
			case 'w':
				this.accelerating = false;
				break;
			case 'ArrowDown':
			case 's':
				this.braking = false;
				break;
			case ' ':
				this.firing = false;
				break;
			default:
				return;
	    }
	}

	handleMovement()
	{
	    this.angle += this.angularSpeed;
	    if (this.accelerating)
	    {
	    	this.velocity.x += Math.cos(this.angle)/20;
			this.velocity.y += Math.sin(this.angle)/20;
	    }
	    if (this.braking)
	    {	    	
  			this.velocity.x *= 0.97;
			this.velocity.y *= 0.97;
	    }
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	fire()
	{
		// limits the fire rate to 5/second. The game looks really good if you disable this.
		if (this.canFire)
		{
			this.canFire = false;
			this.projectiles.push(new Projectile(this.x, this.y, this.angle));
			setTimeout(function() 
	        {
	        	this.canFire = true;
			}.bind(this), 200);	
		}
	}

	detectCollision(asteroid)
	{
		var distance = Math.sqrt(Math.pow((this.x - asteroid.x),2) + Math.pow((this.y - asteroid.y),2));
		return (distance <= asteroid.radius);
	}

	hit(asteroids)
	{
		for (var i = 0; i < asteroids.length; i++) 
		{
			if (this.detectCollision(asteroids[i]))
				return true;
		}
		return false;
	}

	update(asteroids)
	{
		var scoreIncrement = 0;
		this.handleMovement();
		if (this.firing)
			this.fire();

		// out of bounds
		this.x += this.screenWidth; // we don't want a negative value
		this.x %= this.screenWidth;
		this.y += this.screenHeight; // we don't want a negative value
		this.y %= this.screenHeight;

		//slight deceleration (friction?)
		this.velocity.x *= 0.999;
		this.velocity.y *= 0.999;

		for (var i = 0; i < this.projectiles.length; i++) 
		{
			this.projectiles[i].update();
			var hitVal = this.projectiles[i].hit(asteroids)
			if (!this.projectiles[i].active)
				this.projectiles.splice(i, 1);
			scoreIncrement += hitVal;
		}

		return scoreIncrement;
	}

	render(ctx)
	{
		ctx.save();
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle + Math.PI/2);
		ctx.moveTo(0, -this.height/2);
		ctx.lineTo(this.width/2, this.height/2);
		ctx.lineTo(0,this.height/3);
		ctx.lineTo(-this.width/2, this.height/2);
		ctx.closePath();
		ctx.stroke();
		if (this.accelerating) // draw rocket flames
		{
			ctx.fillStyle = 'yellow';
			ctx.beginPath();
			ctx.moveTo(0,this.height/3);
			ctx.lineTo(-this.width/2, this.height*0.75);
			var flameCnt = 4;
			for (var i = 0; i < flameCnt; i++) 
			{
				ctx.lineTo(-this.width/2 + this.width*((i+1)/flameCnt), this.height*0.75 - ((i+1)%2)*this.height*0.375);
			}
			ctx.lineTo(this.width/2, this.height*0.75);
			ctx.closePath();
			ctx.fill();

		}
		ctx.restore();

		for (var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].render(ctx);
		}		
	}
}