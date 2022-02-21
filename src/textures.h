#pragma once
#include <glad/glad.h>
#include "utilities/imageLoader.hpp"

struct Texture {
public:
    GLuint ID;
    void bind();
};

/**
 * @brief Creates an OpenGL texture from an image
 * 
 * @param image 
 * @return ID of generated texture
 */
Texture textureFromPng(PNGImage *image);


