var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// get canvas dimensions
var Width = canvas.width;
var Height = canvas.height;
// Draw the night sky with a gradient
function drawSky() {
    var grd = ctx.createLinearGradient(0, 0, 0, Height);
    grd.addColorStop(0, "black");
    grd.addColorStop(1, "blue");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, Width, Height);
}
drawSky();

// Particle class
function Particle(x, y, radius, vx=0, vy=0) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    // random color
    this.color = Math.floor(100 + Math.random() * 156) + "," + Math.floor(100 + Math.random() * 156) + "," + Math.floor(100 + Math.random() * 156);
    this.alpha = 0.8 + Math.random()*0.5;
    // random velocity (circular distribution)
    var angle = Math.random() * 2 * Math.PI;

    // random distribution simulating 3D speed
    var speed = (Math.random() + Math.random() + Math.random()) * 5;
    this.velocity = {
        x: speed * Math.cos(angle)+vx,
        y: speed * Math.sin(angle)+vy
    };
    this.friction = 0.05;
}
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // fill style with color and alpha
    ctx.fillStyle = "rgba(" + this.color + ", " + this.alpha + ")";
    ctx.fill();
    ctx.closePath();
};
Particle.prototype.update = function() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.x *= (1 - this.friction);
    this.velocity.y *= (1 - this.friction);
    this.velocity.y += 0.05;
    // add some tiny randomness to the velocity
    this.velocity.x += (Math.random() - 0.5) * 0.2;
    this.velocity.y += (Math.random() - 0.5) * 0.2;
    // alpha decrease
    this.alpha *= 0.995;
    this.alpha += -0.005;
    this.radius *= 0.99;
    // remove particles
    if (this.alpha * this.radius < 0.1) {
        particles.splice(particles.indexOf(this), 1);
    }
};

// create particles
var particles = [];
function explode(x = Math.random() * Width, y = Math.random() * Height, vx=0, vy=0, amount = 1000) {
    console.log("Boom!");
    for (var i = 0; i < amount; i++) {
        var radius = (Math.random() * 1) + 1;
        particles.push(new Particle(x, y, radius, vx, vy));
    }
}
explode();



// Fireworks class
// Launch a firework upwards.
var fireworks = [];
function Fireworks(x = Math.random() * Width, y = Height) {
    this.x = x;
    this.y = y;
    this.vy = -(Math.random() * 10 );
    this.vx = (Math.random() - 0.5) * 10;
    
    // correct initial speed towards the center
    this.vx += (Width / 2 - this.x) * 0.1 * Math.random();
    this.vy += (Height / 2 - this.y) * 0.05;

    this.radius = 4;
    this.color = "255,255,255";
    this.alpha = 1;
    this.fuselife = Math.random() * 30 + 20;
    this.friction = 0.05;
    this.gravity = 0.05;
}
Fireworks.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
};
Fireworks.prototype.update = function() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= (1 - this.friction);
    this.vy *= (1 - this.friction);
    this.radius *= 0.95;
    this.alpha *= 0.95;
    this.fuselife--;
    // firework explodes into particles
    if (this.fuselife <= 0) {
        this.boom();
    }
};
Fireworks.prototype.boom = function() {
    explode(this.x, this.y, this.vx, this.vy);
    // remove the firework
    fireworks.splice(fireworks.indexOf(this), 1);
};

// Launch fireworks when clicking
canvas.addEventListener("click", function(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    fireworks.push(new Fireworks(x, y));
});

function animate() {
    ctx.clearRect(0, 0, Width, Height);
    drawSky();
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.update();
        p.draw();
    }
    for (var i = 0; i < fireworks.length; i++) {
        var f = fireworks[i];
        f.update();
        f.draw();
    }
    requestAnimationFrame(animate);
}
animate();

// launch a firework every 1.5 seconds
setInterval(function() {
    fireworks.push(new Fireworks());
}, 1500);