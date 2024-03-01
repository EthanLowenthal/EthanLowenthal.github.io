let color = [0, 0, 0];
let colorPreview;
let canvas;
let ctx;
let hexValue;
let hsvValue;
let rgbValue;
let nrgbValue;
let hHandle;
let svHandle;
let hueBar;

var mouse = { x:0, y:0, down:false, selectingH:false, selectingSV:false };

const epsilon = 1e-6;

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function setupMouse() {
    var svRect = canvas.getBoundingClientRect();
    var hRect = hueBar.getBoundingClientRect();

    function handleMouseEvent(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        if (mouse.down || mouse.selectingSV) {
            if (svRect.left < mouse.x && mouse.x < svRect.right || mouse.selectingSV) {
                if (svRect.top < mouse.y && mouse.y < svRect.bottom || mouse.selectingSV) {
                    let hsv = RGBtoHSV(color);
                    hsv[1] = (mouse.x - svRect.left) / svRect.width;
                    hsv[2] = 1 - (mouse.y - svRect.top) / svRect.height;
                    
                    hsv[1] = clamp(hsv[1], epsilon, 1-epsilon);
                    hsv[2] = clamp(hsv[2], epsilon, 1-epsilon);
                    
                    setColor(HSVtoRGB(hsv));

                    mouse.selectingSV = true;
                }
            }
        }

        if (mouse.down || mouse.selectingH) {
            if (hRect.left < mouse.x && mouse.x < hRect.right || mouse.selectingH) {
                if (hRect.top < mouse.y && mouse.y < hRect.bottom || mouse.selectingH) {
                    let hsv = RGBtoHSV(color);
                    hsv[0] = (mouse.x - hRect.left) / hRect.width;

                    hsv[0] = clamp(hsv[0] * 360, epsilon, 360-epsilon);
                    
                    setColor(HSVtoRGB(hsv));

                    mouse.selectingH = true;
                }
            }
        }

    }

    window.addEventListener('mousedown', function (e) {
        mouse.down = true;
        handleMouseEvent(e);
    });

    window.addEventListener('mouseup', function (e) {
        mouse.down = false;
        mouse.selectingH = false;
        mouse.selectingSV = false;
        handleMouseEvent(e);
    });

    window.addEventListener('mouseout', function (e) {
        mouse.down = false;
        handleMouseEvent(e);
    });

    window.addEventListener('mousemove',  handleMouseEvent );
};


function HSVtoRGB([h,s,v])  {                     
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5)*255,f(3)*255,f(1)*255];       
}   

function RGBtoHSV([r,g,b]) {
    let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
    let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
    return [60*(h<0?h+6:h), v&&c/v, v/255];
}

function RGBtoHEX([r, g, b]) {
    return "#" + (1 << 24 | (r + 0.5) << 16 | (g + 0.5) << 8 | (b + 0.5)).toString(16).toUpperCase().slice(1);
  }

function HEXtoRGB(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

function RGBtoNRGB([r, g, b]) {
    return [r/255, g/255, b/255];
}
function NRGBtoRGB([r, g, b]) {
    return [r*255, g*255, b*255];
}

const setColor = (rgb) => {
    color = rgb;
    hexValue.value = RGBtoHEX(color);
    const hsv = RGBtoHSV(color);
    hsvValue.value = `${hsv[0].toFixed(0)}, ${(hsv[1]*100).toFixed(0)}%, ${(hsv[2]*100).toFixed(0)}%`;
    rgbValue.value = `${color[0].toFixed(0)}, ${color[1].toFixed(0)}, ${color[2].toFixed(0)}`;
    const nrgb = RGBtoNRGB(color);
    nrgbValue.value =`${nrgb[0].toFixed(3)}, ${nrgb[1].toFixed(3)}, ${nrgb[2].toFixed(3)}`;
    
    const complete_color = RGBtoHEX(HSVtoRGB([hsv[0], 1, 1]));
    
    colorPreview.style.background = hexValue.value;
    svHandle.style.background = hexValue.value;
    hHandle.style.background = complete_color;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, complete_color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const black_grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    black_grad.addColorStop(0, "white");
    black_grad.addColorStop(1, "black");
    ctx.fillStyle = black_grad;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";

    const canvasRect = canvas.getBoundingClientRect();
    svHandle.style.top = `${canvasRect.top + canvasRect.height * (1-hsv[2])}px`;
    svHandle.style.left = `${canvasRect.left + canvasRect.width * hsv[1]}px`;

    const hueRect = hueBar.getBoundingClientRect();
    hHandle.style.top = `${hueRect.top + hueRect.height * 0.5}px`;
    hHandle.style.left = `${hueRect.left + hueRect.width * hsv[0] / 360}px`;
}

const colorPicker = () => {
    colorPreview = document.getElementById("color-preview");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    hexValue = document.getElementById("hexValue");
    hsvValue = document.getElementById("hsvValue");
    rgbValue = document.getElementById("rgbValue");
    nrgbValue = document.getElementById("nrgbValue");
    hHandle = document.getElementById("h-handle");
    svHandle = document.getElementById("sv-handle");
    hueBar = document.getElementById("hue-bar");

    setupMouse();

    const hexRegex = /^#?(?:([0-9a-f]{6}))$/i
    const hsvRegex = /(\d{1,3}),\s?(\d{1,3})%,\s?(\d{1,3})%/i
    const rgbRegex = /(\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})/i
    const nrgbRegex = /([0,1]\.\d{1,16}),\s?([0,1]\.\d{1,16}),\s?([0,1]\.\d{1,16})/i

    hexValue.addEventListener("change", e => {
        let match = e.target.value.match(hexRegex);

        if (match != null) {
            setColor(HEXtoRGB(match[1]));
        }
    })

    hsvValue.addEventListener("change", e => {
        let match = e.target.value.match(hsvRegex);
        
        if (match != null) {
            setColor(HSVtoRGB([
                parseInt(match[1]),
                parseInt(match[2]) / 100,
                parseInt(match[3]) / 100
            ]));
        }
    })


    rgbValue.addEventListener("change", e => {
        let match = e.target.value.match(rgbRegex);

        if (match != null) {
            setColor([
                parseInt(match[1]),
                parseInt(match[2]),
                parseInt(match[3])
            ]);
        }
    })

    nrgbValue.addEventListener("change", e => {
        let match = e.target.value.match(nrgbRegex);
        
        if (match != null) {
            setColor([
                parseFloat(match[1]) * 255,
                parseFloat(match[2]) * 255,
                parseFloat(match[3]) * 255
            ]);
        }
    })

    setColor(color);
}

color = HSVtoRGB([Math.random()* 360, 0.75, 0.90]);

window.addEventListener("load", colorPicker);

window.addEventListener("resize", colorPicker);