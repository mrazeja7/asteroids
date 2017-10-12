export default class Asteroid
{
	constructor(screenWidth, screenHeight)
	{
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.x = Math.random() * this.screenWidth;
		this.y = Math.random() * this.screenHeight;
		this.angle = Math.random()*2*Math.PI;
		this.mass = Math.random();
		this.velocity = {x:Math.cos(this.angle)/5, y:Math.sin(this.angle)/5};
		this.shape = []; 
		var edgeCount = Math.floor(Math.random()*5 + 4);
		for (var i = 0; i < edgeCount; i++) 
		{
			var a = 2*Math.PI * i/edgeCount;
			var x = Math.cos(a) * Math.random()*50;
			var y = Math.sin(a) * Math.random()*50;
			this.shape.push({x: x, y: y});
		}
	}

	update()
	{
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.x += this.screenWidth; // we don't want a negative value
		this.x %= this.screenWidth;
		this.y += this.screenHeight; // we don't want a negative value
		this.y %= this.screenHeight;
	}

	render(ctx)
	{
		ctx.save();		
		ctx.strokeStyle = 'orange';
		//ctx.fillStyle = 'green';
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.moveTo(this.shape[0].x, this.shape[0].y)
		for (var i = 1; i < this.shape.length; i++) 
		{
			ctx.lineTo(this.shape[i].x, this.shape[i].y);
		}
		ctx.closePath();
		ctx.stroke();
		//ctx.fill();
		ctx.restore();

	}
}