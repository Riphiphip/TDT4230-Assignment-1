#version 430 core


in layout(location = 0) vec3 normal_in;
in layout(location = 1) vec2 textureCoordinates;
in layout(location = 2) vec4 position;

out vec4 color;


struct PointLight {
    vec3 position;
    vec3 colour;
};

const int nPointLights = 3;
uniform PointLight pointLights[nPointLights];


uniform vec4 cameraPos;

uniform vec3 ballPos;
uniform float ballRadius;


float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }

vec3 reject(vec3 from, vec3 onto) {return from - onto*dot(from, onto)/dot(onto, onto);}

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

    vec3 fragBallV = ballPos - vec3(position);
    for (int i = 0; i < nPointLights; i++){
        PointLight light = pointLights[i];

        bool shouldReject;
        vec3 fragLightV = light.position - vec3(position);
        vec3 rejectV = reject(fragBallV, fragLightV);

        shouldReject = (length(rejectV) <= ballRadius) && !(length(fragLightV)<length(fragBallV)) && !(dot(fragLightV, fragBallV) < 0);

        float rejectFactor = float(!shouldReject);

        float distToLight = length(light.position - vec3(position));
        float attenuation = 1.0/(la + lb * distToLight + lc * pow(distToLight, 2));

        vec3 lightDir = normalize(light.position - vec3(position));
        diffuseBrightness += rejectFactor * attenuation * max(dot(normal, lightDir), 0.0);

        vec3 refLD = reflect(-lightDir, normal);
        vec3 viewDir = normalize(vec3(cameraPos-position));
        spec += rejectFactor * attenuation * pow(max(dot(viewDir, refLD),0.0), shininess);

    }


    vec3 ambient = ambientCoef * ambientColour;
    vec3 diffuse = diffuseCoef * diffuseBrightness * diffuseColour;
    vec3 specular = specularCoef * spec * specularColour;

    color = vec4(ambient + diffuse + specular + dither(textureCoordinates), 1.0);
}