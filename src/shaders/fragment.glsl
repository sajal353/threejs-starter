uniform float time;
varying float vNoise;
varying vec2 vUv;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    // float PI = 3.1415925;

    vec3 color = palette(vNoise, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, .1, .2));

    gl_FragColor = vec4(color, 1.0);
}