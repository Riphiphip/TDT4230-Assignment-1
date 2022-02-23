#version 430 core

layout(binding = 0) uniform sampler2D imageSampler;

in layout(location = 0) vec2 uv;

out vec4 color;

void main()
{

    color = vec4(texture(imageSampler, uv).xyz, 1.0);
    // color = vec4(vec3(uv.x), 1.0);
}