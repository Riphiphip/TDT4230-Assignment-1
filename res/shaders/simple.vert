#version 430 core

in layout(location = 0) vec3 position;
in layout(location = 1) vec3 normal_in;
in layout(location = 2) vec2 textureCoordinates_in;
in layout(location = 3) vec3 tangent;
in layout(location = 4) vec3 bitangent;

uniform mat4 mMat;
uniform mat4 vMat;
uniform mat4 pMat;

uniform mat3 normalMat;

out layout(location = 0) vec3 normal_out;
out layout(location = 1) vec2 textureCoordinates_out;
out layout(location = 2) vec4 position_out; // Should only be transformed by model matrix
out layout(location = 3) mat3 tbn_out;

void main()
{
    normal_out = normalize(normalMat * normal_in);
    vec3 tangentCor = normalize(normalMat * tangent);
    vec3 bitangentCor = normalize(normalMat * bitangent);

    tbn_out = mat3(tangentCor, bitangentCor, normal_out);

    textureCoordinates_out = textureCoordinates_in;
    position_out = mMat * vec4(position, 1.0);
    gl_Position = pMat * vMat * mMat * vec4(position, 1.0f);
}
