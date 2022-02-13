#version 430 core

in layout(location = 0) vec3 position;
in layout(location = 1) vec3 normal_in;
in layout(location = 2) vec2 textureCoordinates_in;

uniform mat4 mMat;
uniform mat4 vMat;
uniform mat4 pMat;

uniform mat3 normalMat;

out layout(location = 0) vec3 normal_out;
out layout(location = 1) vec2 textureCoordinates_out;

void main()
{
    normal_out = normalize(normalMat * normal_in);
    textureCoordinates_out = textureCoordinates_in;
    gl_Position = pMat * vMat * mMat * vec4(position, 1.0f);
}
