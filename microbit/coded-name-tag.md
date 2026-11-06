---
title: Encoded Name Tag Project
description: Create an interactive LED name tag utilizing custom 5x5 binary matrix coordinates.
---

# Encoded Name Tag

Learn how to encode text characters into a custom 5x5 binary LED grid array on the BBC micro:bit and deploy it using MakeCode blocks.

## 1. Introduction & Objectives
Briefly explain the goal of the project: creating a badge that scrolls or blinks a personalized name tag using custom grid rules.
*   **Concepts:** Binary mapping, coordinates, loops, and LED arrays.
*   **Requirements:** A BBC micro:bit (V1 or V2) and a USB micro cable.

## 2. Design the 5x5 Matrix Layout
This is where we explain how the grid maps out text. We will drop your custom image component right here to illustrate the grid logic.

<ImageFigure 
  src="/images/matrix-grid-blueprint.png" 
  caption="The 5x5 LED array coordinate map for character styling blocks." 
  width="450px" 
/>

## 3. Step-by-Step MakeCode Programming
Clear, bite-sized instructional fragments mapping out how to build the block code sequence:
1. Open the MakeCode editor.
2. Initialize the `on start` container block.
3. Inject a `show leds` grid pattern to draw the initial boundaries.
4. Establish an index loop tracking your character sequence variables.

## 4. Testing & Extension Activities
How to verify the program is working on the device and edge cases to look out for.
*   **Verification:** Ensure characters render without clipping text boundaries.
*   **Extension:** Use the micro:bit's internal accelerometer to speed up the text scroll speed when the device is shaken.
