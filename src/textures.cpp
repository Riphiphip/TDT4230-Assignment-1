
#include "textures.h"

void Texture::bind(){
    glBindTexture(GL_TEXTURE_2D, this->ID);
}

Texture textureFromPng(PNGImage *image)
{
    Texture tex;
    glGenTextures(1, &tex.ID);

    tex.bind();

    glTexImage2D(
        GL_TEXTURE_2D,
        0,
        GL_RGBA,
        image->width,
        image->height,
        0,
        GL_RGBA,
        GL_UNSIGNED_BYTE,
        image->pixels.data()
    );

    glGenerateMipmap(GL_TEXTURE_2D);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);


    return tex;
}