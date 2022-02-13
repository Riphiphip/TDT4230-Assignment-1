#pragma once

#include <utilities/window.hpp>
#include "sceneGraph.hpp"

#define N_POINT_LIGHTS 3
struct PointLight {
    SceneNode *node;
    glm::vec3 colour;
};

void updateNodeTransformations(SceneNode* node, glm::mat4 transformationThusFar);
void initGame(GLFWwindow* window, CommandLineOptions options);
void updateFrame(GLFWwindow* window);
void renderFrame(GLFWwindow* window);