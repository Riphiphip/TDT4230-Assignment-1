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

uniform bool isTextured;
layout(binding = 0) uniform sampler2D imageSampler;

uniform bool isNormalMapped;
layout(binding = 1) uniform sampler2D normalMapSampler;

float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }

vec3 reject(vec3 from, vec3 onto) {return from - onto*dot(from, onto)/dot(onto, onto);}

const float ambientCoef = 0.3;

const float diffuseCoef = 1.0;

const int shininess = 8;
const float specularCoef = 0.5;

const float la = 0.001;
const float lb = 0.001;
const float lc = 0.001;

void main()
{
    vec3 normal = isNormalMapped ? (texture(normalMapSampler, textureCoordinates).xyz*2.0 - 1.0) : normalize(normal_in);

    vec3 ambientColour = isTextured ? texture(imageSampler, textureCoordinates).rgb: vec3(1.0);

    vec3 ambient = ambientCoef * ambientColour;
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);

    vec3 fragBallV = ballPos - vec3(position);

    for (int i = 0; i < nPointLights; i++){
        PointLight light = pointLights[i];

        bool shouldReject;
        vec3 fragLightV = light.position - vec3(position);
        vec3 rejectV = reject(fragBallV, fragLightV);

        shouldReject = (length(rejectV) <= ballRadius) && !(length(fragLightV)<length(fragBallV)) && !(dot(fragLightV, fragBallV) < 0);

        float rejectFactor = (light.colour == vec3(0.0)) ? 1.0 : float(!shouldReject);

        float distToLight = length(light.position - vec3(position));
        float attenuation = 1.0/(la + lb * distToLight + lc * pow(distToLight, 2));

        vec3 lightDir = normalize(light.position - vec3(position));
        
        vec3 diffuseCol = ambientColour;
        diffuse += rejectFactor * attenuation * max(dot(normal, lightDir), 0.0) * diffuseCol * diffuseCoef;

        vec3 refLD = reflect(-lightDir, normal);
        vec3 viewDir = normalize(vec3(cameraPos-position));
        specular += rejectFactor * attenuation * pow(max(dot(viewDir, refLD),0.0), shininess) * light.colour * specularCoef;
    }



    color = vec4(ambient + diffuse + specular + dither(textureCoordinates), 1.0);
}