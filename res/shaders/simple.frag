#version 430 core

in layout(location = 0) vec3 normal_in;
in layout(location = 1) vec2 textureCoordinates;
in layout(location = 2) vec4 position;

const int nPointLights = 3;
uniform vec4 lightPos[nPointLights];
uniform vec4 cameraPos;

out vec4 color;

float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }

const float ambientCoef = 0.1;
const vec3 ambientColour = vec3(1.0, 1.0, 1.0);

const float diffuseCoef = 0.3;
const vec3 diffuseColour = vec3(1.0);

const int shininess = 32;
const float specularCoef = 1.0;
const vec3 specularColour = vec3(1.0);

const float la = 0.001;
const float lb = 0.001;
const float lc = 0.001;

void main()
{
    vec3 normal = normalize(normal_in);
    float diffuseBrightness = 0.0;
    float spec = 0.0;
    for (int i = 0; i < nPointLights; i++){
        float distToLight = length(vec3(lightPos[i] - position));
        float attenuation = 1.0/(la + lb * distToLight + lc * pow(distToLight, 2));

        vec3 lightDir = normalize(vec3(lightPos[i] - position));
        diffuseBrightness += attenuation * max(dot(normal, lightDir), 0.0);

        vec3 refLD = reflect(-lightDir, normal);
        vec3 viewDir = normalize(vec3(cameraPos-position));
        spec += attenuation * pow(max(dot(viewDir, refLD),0.0), shininess);
    }


    vec3 ambient = ambientCoef * ambientColour;
    vec3 diffuse = diffuseCoef * diffuseBrightness * diffuseColour;
    vec3 specular = specularCoef * spec * specularColour;

    color = vec4(ambient + diffuse + specular + dither(textureCoordinates), 1.0);
}