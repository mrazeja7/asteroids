export default class Projectile
{
	constructor(x, y, a)
	{
		this.x = x;
		this.y = y;
		this.angle = a;
		this.width = 4;
		this.height = 16;
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