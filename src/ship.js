import Projectile from './projectile'

export default class Ship
{
	constructor(screenWidth, screenHeight)
	{
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.height = 20;
		this.width = 12;
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

	update(asteroids)
	{
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
			if (this.projectiles[i].hit(asteroids))
			{

				console.log('hit');
			}
			if (!this.projectiles[i].active)
				this.projectiles.splice(i, 1);
		}
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
		ctx.lineTo(-this.width/2, this.height/2);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();

		for (var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].render(ctx);
		}		
	}
}