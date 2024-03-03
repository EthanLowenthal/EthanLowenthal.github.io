let canvas;
let ctx;
let pos;

var GUID = function () {
    var S4 = function () {
        return(
                Math.floor(
                        Math.random() * 0x10000 /* 65536 */
                    ).toString(16)
            );
    };

    return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
};



const step = () => {
    pos = {
        x: window.screenX + window.outerWidth / 2,
        y: window.screenY + window.outerHeight / 2,
    };

    const now = Date.now();

    ctx.fillStyle = "#0d2c44";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1B5788";
    ctx.strokeStyle = "#1B5788";

    
    window.localStorage.setItem(window.name, [pos.x, pos.y, now]);


    for (var i = 0; i < localStorage.length; i++){
        let self = localStorage.getItem(localStorage.key(i)).split(",");
        self = {
            x: parseFloat(self[0]),
            y: parseFloat(self[1]),
            time: parseFloat(self[2]),
        }
        if (now - self.time > 500) {
            window.localStorage.clear();
            continue;
        }
        self.x_relative = self.x - pos.x + canvas.width / 2;
        self.y_relative = self.y - pos.y + canvas.height / 2;

        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.arc(self.x_relative, self.y_relative, 50, 0, 2 * Math.PI);
        ctx.fill();
        
        for (var j = 0; j < localStorage.length; j++){
            let other = localStorage.getItem(localStorage.key(j)).split(",");
            other = {
                x: parseFloat(other[0]),
                y: parseFloat(other[1]),
            }
            
            other.x_relative = other.x - self.x;
            other.y_relative = other.y - self.y;

            ctx.beginPath();
            ctx.moveTo(self.x_relative, self.y_relative);
            ctx.lineTo(other.x_relative + self.x_relative, other.y_relative + self.y_relative);
            ctx.lineWidth = 15;
            ctx.stroke();
        }

   

    }

}

const init = () => {
    if (!window.name.match(/^GUID-/)) {
        window.name = "GUID-" + GUID();
    }

    window.localStorage.clear();

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    window.setInterval(step, 1000/30);

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
}

window.addEventListener('load', init);
    