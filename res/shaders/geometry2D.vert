#version 430 core

uniform mat4 ortho;
uniform mat4 mMat;

in layout(location = 0) vec3 position;
in layout(location = 2) vec2 textureCoordinates_in;



out layout(location = 0) vec2 textureCoordinates_out;

void main()
{
    textureCoordinates_out = textureCoordinates_in;
    gl_Position = ortho * mMat * vec4(position, 1.0f);
}
