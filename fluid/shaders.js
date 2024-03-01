
const WIDTH = 512;
const HEIGHT = 512;

const vertex_shader = /* glsl */`#version 300 es
in vec4 v_position;
out vec2 uv;

void main() {
    gl_Position = v_position;
    uv = (v_position.xy + 1.) * 0.5;
}
`;

const point_shader = /* glsl */`#version 300 es
in vec4 v_position;
out vec2 uv;
flat out ivec2 index;

uniform sampler2D positions;

void main() {
    int v_index = gl_VertexID;

    index = ivec2(v_index / ${WIDTH}, v_index % ${HEIGHT});
    vec2 position = texelFetch(positions, index, 0).xy;

    gl_Position = vec4(position,0,1);
    gl_PointSize = 3.0;
    uv = (v_position.xy + 1.) * 0.5;
}
`;



const advectSource = /* glsl */`#version 300 es
precision mediump float;

in vec2 uv;
out vec4 fragColor;

uniform sampler2D velocity;
uniform vec2 screen_size;
uniform vec2 mouse;
uniform vec2 mouse_last;
uniform int mouse_down;

float sdSegment(in vec2 p, in vec2 a, in vec2 b) {
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

void main() {
    fragColor = vec4(texture(velocity, uv - texture(velocity, uv).xy / screen_size).xy * 0.999, 0,1);
    
    if (mouse_down==1) {
        float dist = sdSegment(uv, mouse, mouse_last);
        fragColor.xy += (mouse - mouse_last) * clamp(1.-dist*20., 0., 1.) * 2.;
        // if (length(uv - vec2(0.5)) < 0.03) fragColor.xy = vec2(.1, .1);

    }

}`

const divergeSource = /* glsl */`#version 300 es
precision mediump float;

in vec2 uv;

uniform sampler2D velocity;
uniform vec3 pixel_size;

out vec4 fragColor;

void main() {
    float n = texture(velocity, uv + pixel_size.zy).y;
    float s = texture(velocity, uv - pixel_size.zy).y;
    float e = texture(velocity, uv + pixel_size.xz).x;
    float w = texture(velocity, uv - pixel_size.xz).x;
    fragColor = vec4(0.5 * ( e - w + n - s), 0, 0, 1);
}`

const jacobiSource = /* glsl */`#version 300 es
precision mediump float;

in vec2 uv;

uniform float u_alpha;
uniform float u_beta;
uniform vec3 pixel_size;
uniform sampler2D pressure;
uniform sampler2D divergence;

out vec4 fragColor;

void main() {
    float n = texture(pressure, uv + pixel_size.zy).x;
    float s = texture(pressure, uv - pixel_size.zy).x;
    float e = texture(pressure, uv + pixel_size.xz).x;
    float w = texture(pressure, uv - pixel_size.xz).x;
    float d = texture(divergence, uv).x;
    fragColor = vec4((n + s + e + w + u_alpha * d) * u_beta, 0, 0, 1);
}`

const gradientSubtractSource = /* glsl */`#version 300 es
precision mediump float;

in vec2 uv;

uniform vec3 pixel_size;
uniform sampler2D pressure;
uniform sampler2D velocity;

out vec4 fragColor;

void main() {
    float n = texture(pressure, uv + pixel_size.zy).r;
    float s = texture(pressure, uv - pixel_size.zy).r;
    float e = texture(pressure, uv + pixel_size.xz).r;
    float w = texture(pressure, uv - pixel_size.xz).r;

    fragColor = vec4(texture(velocity, uv).xy + 0.5 * vec2(e - w, n - s), 0,1);
}`
const copySource = /* glsl */`#version 300 es
precision mediump float;
in vec2 uv;

out vec4 fragColor;

uniform sampler2D source;

void main() {
    fragColor = texture(source, uv); // blue
}`
const pointSource = /* glsl */`#version 300 es
precision mediump float;
in vec2 uv;
flat in ivec2 index;
out vec4 fragColor;

uniform sampler2D positions;
uniform sampler2D velocity;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);  //from [0,1] to [-0.5,0.5]
    // if(length(coord) > 0.5)                  //outside of circle radius?
    //     discard;
    vec2 position = texelFetch(positions, index, 0).xy;
    vec2 velocity = texture(velocity, position * 0.5 + 0.5).xy;

    float speed = velocity.x * velocity.x + velocity.y * velocity.y;

    vec3 color = mix(
            vec3(0.000, 0.372, 0.450),
            vec3(0.682, 0.125, 0.070),
            smoothstep(0., 1., pow(speed, 1./10.))
        );
    fragColor = vec4(color, 1.);
}`
const pointAdvectSource = /* glsl */`#version 300 es
precision mediump float;

in vec2 uv;
out vec4 fragColor;

uniform sampler2D positions;
uniform sampler2D velocity;
uniform float dt;

void main() {
    vec2 position = texelFetch(positions, ivec2(gl_FragCoord.xy), 0).xy;
    if (position.y < -1.) position.y += 2.;
    if (position.x < -1.) position.x += 2.;
    if (position.y > 1.) position.y -= 2.;
    if (position.x > 1.) position.x -= 2.;

    vec2 velocity = texture(velocity, position * 0.5 + 0.5).xy;
    position += velocity / dt;

    fragColor = vec4(position,0,1);
}`
const pointInitSource = /* glsl */`#version 300 es
precision mediump float;

in vec2 uv;
out vec4 fragColor;


float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 7.233))) * 43758.5453);
}
void main() {
    fragColor = vec4(2. * vec2(rand(vec2(gl_FragCoord.xy)), rand(gl_FragCoord.yx)) - 1.,0,0);
    // fragColor = vec4(uv * 2. - 1., 0, 0);
}`