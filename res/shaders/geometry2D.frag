#version 430 core

layout(binding = 0) uniform sampler2D imageSampler;

in layout(location = 0) vec2 uv;

out vec4 color;

void main()
{

    color = texture(imageSampler, uv);
}