export default class Ship
{
	constructor(screenWidth, screenHeight)
	{
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.height = 10;
		this.width = 6;
		this.x = screenWidth/2;
		this.y = screenHeight/2;
		this.angle = 0;
		this.angularSpeed = 0;
		this.velocity = {x: 0, y: 0};

		window.onkeydown = this.handleKeyDown.bind(this);
		window.onkeyup = this.handleKeyUp.bind(this);

		this.accelerating = false;
		this.braking = false;
	}

	handleKeyDown(event)
	{
		event.preventDefault();
		var key = event.key;
		//console.log(key);
	    switch(key)
	    {
	    	case ' ':
	    		this.fire();
	    		break;
	      	case 'ArrowLeft':
	      	case 'a':
		        this.angularSpeed = -Math.PI/100;
		        console.log('left');
		        break;
	      	case 'ArrowRight':
	      	case 'd':
		        this.angularSpeed = Math.PI/100;
		        console.log('right');
		        break;
		    case 'ArrowUp':
	      	case 'w':
	      		//if (!this.accelerating)
	      		{
	      			this.accelerating = true;
	      			
					console.log('forwards');
				}		        
		        break;
		    case 'ArrowDown':
	      	case 's':
	      		//if (!this.braking)
	      		{
	      			this.braking = true;
		        	console.log('backwards');
		        }
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
				return;
			case 'ArrowUp':
			case 'w':
				this.accelerating = false;
				return;
			case 'ArrowDown':
			case 's':
				this.braking = false;
				return;
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

	}

	update()
	{
		this.handleMovement();

		// out of bounds
		this.x += this.screenWidth; // we don't want a negative value
		this.x %= this.screenWidth;
		this.y += this.screenHeight; // we don't want a negative value
		this.y %= this.screenHeight;

		//slight deceleration (friction?)
		this.velocity.x *= 0.999;
		this.velocity.y *= 0.999;
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
	}
}