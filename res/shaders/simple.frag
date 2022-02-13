#version 430 core

in layout(location = 0) vec3 normal;
in layout(location = 1) vec2 textureCoordinates;
in layout(location = 2) vec4 position;

const int nPointLights = 3;
uniform vec4 lightPos[nPointLights];

out vec4 color;

float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }

const float ambientCoef = 0.1;
const vec3 ambientColour = vec3(1.0, 1.0, 1.0);

const float diffuseCoef = 0.5;
const vec3 diffuseColour = vec3(1.0);

void main()
{
    float diffuseBrightness = 0.0;
    for (int i = 1; i < nPointLights; i++){
        vec3 lightDir = normalize(vec3(lightPos[i] - position));
        diffuseBrightness += max(dot(normalize(normal), lightDir), 0.0);
    }

    vec3 diffuse = diffuseCoef * diffuseBrightness * diffuseColour;
    vec3 ambient = ambientCoef * ambientColour;
    color = vec4(diffuse + ambient, 1.0);
}