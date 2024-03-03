var mouse = { x:0, y:0, down:false };
var mouse_last = { x:0, y:0, down:false };

function setupMouse() {
    const cv = document.getElementById("canvas");
    var rect = cv.getBoundingClientRect();
    var rectLeft = rect.left;
    var rectTop = rect.top;

    var cssScaleX = cv.width / cv.offsetWidth;
    var cssScaleY = cv.height / cv.offsetHeight;

    function handleMouseEvent(e) {
        mouse.x = (e.clientX - rectLeft) * cssScaleX / cv.width;
        mouse.y = (e.clientY - rectTop) * cssScaleY / cv.height;
    }

    window.addEventListener('mousedown', function (e) {
        mouse.down = true;
        handleMouseEvent(e);
    });

    window.addEventListener('mouseup', function (e) {
        mouse.down = false;
        handleMouseEvent(e);
    });

    window.addEventListener('mouseout', function (e) {
        mouse.down = false;
        handleMouseEvent(e);
    });

    window.addEventListener('mousemove',  handleMouseEvent );
};


class Texture {
    constructor(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    }
}

class ShaderProgram {
    constructor(gl, fragSource, vertProgram, output, uniforms) {
        this.gl = gl;
        this.output = output;
        this.uniforms = uniforms;

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragSource);
        gl.compileShader(fragmentShader);
    
        var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
        console.log('Shader compiled successfully: ' + compiled);
        var compilationLog = gl.getShaderInfoLog(fragmentShader);
        console.log('Shader compiler log: ' + compilationLog);
        
        this.program = gl.createProgram();
    
        gl.attachShader(this.program, vertProgram);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        gl.detachShader(this.program, vertProgram);
        gl.detachShader(this.program, fragmentShader);
        gl.deleteShader(fragmentShader);
    
        var progamLog = gl.getProgramInfoLog(this.program);
        console.log('Program log: ' + progamLog);
        window.a = this.uniforms;

        gl.useProgram(this.program);
        for (var i=0; i<Object.keys(this.uniforms).length; i++) {
            gl.uniform1i(gl.getUniformLocation(this.program, Object.keys(this.uniforms)[i]), i);
        }
        gl.uniform3fv(gl.getUniformLocation(this.program, "pixel_size"), [1 / WIDTH, 1 / HEIGHT, 0]);
    }

    run() {
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.output ? this.output.framebuffer : null);

        for (var i=0; i<Object.values(this.uniforms).length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, Object.values(this.uniforms)[i].texture);
        }

        gl.viewport(0, 0, this.output ? this.output.width : gl.canvas.width, this.output ? this.output.height : gl.canvas.height);

        gl.useProgram(this.program);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
    }


}


const run = () => {
    const canvas = document.querySelector("canvas");
    canvas.width = window.innerWidth * 1;
    canvas.height = window.innerHeight * 1;
    const gl = canvas.getContext("webgl2", { alpha: false });

    var ext = gl.getExtension("EXT_color_buffer_float");
    if (!ext) {
    alert("this machine or browser does not support OES_texture_float");
    }   
    var linear =  gl.getExtension("OES_texture_float_linear");
    if (!linear) {
    alert("this machine or browser does not support  OES_texture_float_linear");
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex_shader);
    gl.compileShader(vertexShader);
    var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    console.log('Vertex shader compiled successfully: ' + compiled);
    var compilationLog = gl.getShaderInfoLog(vertexShader);
    console.log('Vertex shader compiler log: ' + compilationLog);
   
    const pointShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(pointShader, point_shader);
    gl.compileShader(pointShader);
    var compiled = gl.getShaderParameter(pointShader, gl.COMPILE_STATUS);
    console.log('Point shader compiled successfully: ' + compiled);
    var compilationLog = gl.getShaderInfoLog(pointShader);
    console.log('Point shader compiler log: ' + compilationLog);
   


    const tempField = new Texture(gl, WIDTH, HEIGHT);
    const velocityField = new Texture(gl, WIDTH, HEIGHT);
    const pressureField = new Texture(gl, WIDTH, HEIGHT);
    const divergenceField = new Texture(gl, WIDTH, HEIGHT);
    const pointPositions = new Texture(gl, WIDTH, HEIGHT);

    const pointProgram = new ShaderProgram(gl, pointSource, pointShader, null, {
        "positions": pointPositions,
        "velocity": velocityField
    });

    gl.useProgram(pointProgram.program);
    gl.uniform1i(gl.getUniformLocation(pointProgram.program, "positions"), 0);

    const advect = new ShaderProgram(gl,
        advectSource,
        vertexShader,
        tempField,
        {
            'velocity': velocityField
        });
    gl.useProgram(advect.program);
    gl.uniform2fv(gl.getUniformLocation(advect.program, "screen_size"), [gl.canvas.width, gl.canvas.height]);

    const diverge = new ShaderProgram(gl,
        divergeSource,
        vertexShader,
        divergenceField,
        {
            'velocity': velocityField
        });

    const jacobi = new ShaderProgram(gl,
        jacobiSource,
        vertexShader,
        tempField,
        {
            'pressure': pressureField,
            'divergence': divergenceField
        });

    gl.useProgram(jacobi.program);
    gl.uniform1f(gl.getUniformLocation(jacobi.program, "u_alpha"), 1.);
    gl.uniform1f(gl.getUniformLocation(jacobi.program, "u_beta"), 0.25);

    
    const gradientSubtract = new ShaderProgram(gl,
        gradientSubtractSource,
        vertexShader,
        tempField,
        {
            'pressure': pressureField,
            'velocity': velocityField
        });


    const copy = new ShaderProgram(gl,
        copySource,
        vertexShader,
        null,
        {
            'source': null,
        });

    const pointAdvect = new ShaderProgram(gl,
        pointAdvectSource,
        vertexShader,
        tempField,
        {
            'positions': pointPositions,
            'velocity': velocityField
        });
    
    const pointInitProgram = new ShaderProgram(gl, pointInitSource, vertexShader, pointPositions, {});
    // gl.uniform1i(gl.getUniformLocation(this.program, Object.keys(this.uniforms)[i]), i);
    
    const passthrough = (source, dest) => {
        copy.uniforms = { 'source': source };
        copy.output = dest;
        copy.run();
    }

    var quad_vertex_buffer = gl.createBuffer();
    var quad_vertex_buffer_data = new Float32Array(WIDTH * HEIGHT * 3).fill(0.0);

    quad_vertex_buffer_data[0] = -1.0;
    quad_vertex_buffer_data[1] = -1.0;

    quad_vertex_buffer_data[3] = 1.0;
    quad_vertex_buffer_data[4] = -1.0;

    quad_vertex_buffer_data[6] = -1.0;
    quad_vertex_buffer_data[7] = 1.0;

    quad_vertex_buffer_data[9] = -1.0;
    quad_vertex_buffer_data[10] = 1.0;

    quad_vertex_buffer_data[12] = 1.0;
    quad_vertex_buffer_data[13] = -1.0;

    quad_vertex_buffer_data[15] = 1.0;
    quad_vertex_buffer_data[16] = 1.0;


    gl.bindBuffer(gl.ARRAY_BUFFER, quad_vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad_vertex_buffer_data, gl.STATIC_DRAW);
    var vertexPositionAttribute = gl.getAttribLocation(advect.program, "v_position");
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionAttribute);
    
    let last_time = 0;
    const step = (time) => {
        const dt = time - last_time;
        last_time = time;

        document.getElementById("fps").innerText = `${(1000/dt).toFixed(1)} fps`;

        gl.useProgram(advect.program);
        gl.uniform2fv(gl.getUniformLocation(advect.program, "mouse"), [mouse.x, 1-mouse.y]);
        gl.uniform2fv(gl.getUniformLocation(advect.program, "mouse_last"), [mouse_last.x, 1-mouse_last.y]);
        gl.uniform1i(gl.getUniformLocation(advect.program, "mouse_down"), mouse.down?1:0);

        mouse_last = {...mouse};

        advect.run(); // velocity => velocity
        passthrough(tempField, velocityField);
        diverge.run(); // velocity => diverge
        for (var i=0;i<3;i++) {
            jacobi.run(); // pressure, diverge => pressure
            passthrough(tempField, pressureField);
        }
        gradientSubtract.run(); // pressure, velocity => velocity
        passthrough(tempField, velocityField);

        // passthrough(velocityField, null);
        
        gl.useProgram(pointAdvect.program);
        gl.uniform1f(gl.getUniformLocation(pointAdvect.program, "dt"), dt);
        pointAdvect.run();
        passthrough(tempField, pointPositions);

        gl.useProgram(pointProgram.program);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, pointPositions.texture);
        
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.POINTS, 0, WIDTH * HEIGHT);

        window.requestAnimationFrame(step);
    }

    document.getElementById("particle_count").innerText = `${WIDTH * HEIGHT} particles`;

    gl.clearColor(0.0, 18.0/255., 25.0/255.0, 1);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthMask(false);
    gl.enable(gl.ALPHA_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    pointInitProgram.run();
    // pointInitProgram.output = velocityField;
    // pointInitProgram.run();
    // const pointInitProgram = new ShaderProgram(gl, pointInitSource, vertexShader, pointPositions, {});

    setupMouse();

    window.requestAnimationFrame(step);
}


window.addEventListener("load", run, false);
