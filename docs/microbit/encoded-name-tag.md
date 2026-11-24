---
title: QR-bit Encoded Name Tag Project
description: Create an interactive LED name tag utilizing custom 5x5 binary matrix coordinates.
---

<script setup>
import Base26Encoder from './components/Base26Encoder.vue'
import CharSetRange from './components/CharSetRange.vue'
</script>

# QR-bit: Encode Name Tag

The display on the micro:bit is a two-dimensional matrix of LEDs 🟧 arranged in 5 columns by 5 rows (5x5 matrix 𝄜). A QR code is a type of barcode that has information encoded into dots in a two-dimensional matrix. We can make QR the uses the micro:bit's display with its matrix of LEDs. Even though we can't make a code as complex as a standard QR code, we can take at least 5 letters of the alphabet and create an encoded pattern for them and display it using the LEDs as the dots in the coded matrix.

<MoreInfo title="Goals for this activity 📋...">

Learn how to encode text characters into a custom 5x5 binary LED grid array on the BBC micro:bit and deploy it using MakeCode blocks.

### 1. Introduction & Objectives
Briefly explain the goal of the project: creating a badge that scrolls or blinks a personalized name tag using custom grid rules.
*   **Concepts:** Binary mapping, coordinates, loops, and LED arrays.
*   **Requirements:** A BBC micro:bit (V1 or V2) and a USB micro cable.

### 2. Design the 5x5 Matrix Layout
This is where we explain how the grid maps out text. We will drop your custom image component right here to illustrate the grid logic.

<ImageFigure 
  src="/images/matrix-grid-blueprint.png" 
  caption="The 5x5 LED array coordinate map for character styling blocks." 
  width="450px" 
/>

### 3. Step-by-Step MakeCode Programming
Clear, bite-sized instructional fragments mapping out how to build the block code sequence:
1. Open the MakeCode editor.
2. Initialize the `on start` container block.
3. Inject a `show leds` grid pattern to draw the initial boundaries.
4. Establish an index loop tracking your character sequence variables.

### 4. Testing & Extension Activities
How to verify the program is working on the device and edge cases to look out for.
*   **Verification:** Ensure characters render without clipping text boundaries.
*   **Extension:** Use the micro:bit's internal accelerometer to speed up the text scroll speed when the device is shaken.

</MoreInfo>

## Encoding a message

The name "**BUZZY**" encoded into a Version 1 QR Code looks like this:

<img
  src="./assets/qr-code.svg"
  alt="QR Code"
  style="border: 1px solid gray;"
  width="150"
/>

The Version 1 QR Code uses **21** rows of dots and can encode up to 25 characters. What if we could use the micro:bit to make our own type of code and display it on the LEDs? The display has only 5 rows so we can't get 21 characters in there but let's try for 5 characters!

### Information density

Since there are only 25 LEDs to use there is a limited amount of information we can encode into the display. If each LED represents a binary bit, then there **2²⁵** values available to encode. Now, that equals **33,554,432** values which seems like a lot. But, if we want to encode letters of a message, each alphabetic letter is one of 26 possible values (charCode()). This turns into **26ˣ** where 'x' is the number of letters that, using their character code values, can fit together to form a number less than **33,554,432**.

One way to think of it is that each letter represents a digit of 26 values in a number that is _x_ digits long. This forms a Base26 number. How do we find out how many digits we can pack into the display matrix? Let's run this code in the [micro:bit code editor](https://makecode.microbit.org/#editor) to determine the number of Base26 digits we can use:

<MakeCodeBlocks
  target="microbit"
  hash="d8c50eebbd602112"
  scale="0.65"
  maxHeight="410"
  type="png"
>

```typescript
let limit26 = 26
let digits = 0
let max5x5 = 2 ** 25
while (limit26 < max5x5) {
    digits += 1
    limit26 = limit26 * 26
    basic.showNumber(digits)
    basic.pause(250)
}
```

</MakeCodeBlocks>

The result turns out to be **5** digits since **26⁵** = **11,881,376**. Just to be sure, notice that **26⁶** = **308,915,776** which is far greater than the **33,554,432** values which the micro:bit can display as a binary value. It's also interesting to note that **2²⁴** = **16,777,216** which is still greater than **26⁵**. We'll need to remember that fact since it will become helpful later on. So, we've learned that we can encode a 5-letter message in a QR Code on the micro:bit's display.

### Coding scheme for messages

#### Make a number for each letter

In order to turn an alphabetic message into a number we need to assign a value between 0 and 25 for each letter. However, these characters are in a range within a range of a larger set of characters.

<CharSetRange
  title="ASCII Character Set (subset)"
  :start="60"
  :end="95"
  :highlightStart="65"
  :highlightEnd="90"
/>

To get the numeric code for a character, we can use the ``charCodeAt()`` function for strings. We're only using the characters `A` - `Z` for our messages so we just need those character code numbers. As it happens, we find that the letter `A` has a character code of `65` and for `Z` it's `90`.

<MakeCodeBlocks
  target="microbit"
  hash="1ce8ff1c17693591"
  scale="1.0"
  maxHeight="350"
  type="png"
  result="Character code for A = 65 and Z = 90"
>

```typescript
basic.showNumber("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charCodeAt(0))
basic.showNumber("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charCodeAt(25))
```

</MakeCodeBlocks>

To give each letter a zero-based value, so that `A = 0`, `B = 1`, and so on, we'll subtract `65` from each letter value. Let's discover what the digit values are for our message word "BUZZY":

<MakeCodeBlocks
  target="microbit"
  hash="68b335726b6823fc"
  scale="1.0"
  maxHeight="350"
  type="png"
  result="B = 1; U = 20; Z = 25; Z = 25; Y = 24"
>

```typescript
let message = "BUZZY"
for (let i = 0; i <= message.length - 1; i++) {
    basic.showString(message.charAt(i) + "=")
    basic.showNumber(message.charCodeAt(i) - 65)
    basic.pause(500)
}
```

</MakeCodeBlocks>

#### Accumulate the digits of the message

Since the letters of the message are the digits of the Base26 number we will encode into our QR Code, we now have a way to make values for those "digits". To add up the total value of the the digits of the message, we need to adjust the place value of the previous digit as each new digit is added in. This is done by multiplying the currently accumulated value by `26` before each new digit is added in. Press "**Start**" in the animation box below to see how the process works.

<Base26Encoder
  word="BUZZY"
  :interval="1500"
/>

Here's how we accumulate this value on the micro:bit:

<MakeCodeBlocks
  target="microbit"
  scale="1.0"
  maxHeight="350"
  type="png"
  hash="fc4b01878ad564d4"
  result="826070"
>

```typescript
let message = "BUZZY"
let charCode = 0
let accumValue = 0
for (let j = 0; j <= message.length-1; j++) {
    charCode = message.charCodeAt(j) - 65
    accumValue = accumValue * 26 + charCode
}
basic.showNumber(accumValue)
```

</MakeCodeBlocks>

### Convert to bits

Having a total value for Base26 message letters is a major step. To show a single image representation of this value on the display requires that we have some way to represent binary number for this value. This is because the LEDs on the display will show the individual bit values for the that number, 🟧 = 1 and ⬜ = 0.

A simple way to have a binary representation of the accumulated value for our message digits is to use a Boolean array. The array will map the binary digits (bits) of the message value where each element is a bit to tell one of the LEDs to turn on or off. Even though the display is a matrix with rows and columns, we can just use a one-dimensional array and divide it into 5-bit segments for each row. 

<MakeCodeBlocks
  target="microbit"
  scale="1.0"
  maxHeight="350"
  type="png"
>

```typescript
let bitArray: boolean[] = []
for (let index = 0; index < 25; index++) {
        bitArray.push(false)
}
```

</MakeCodeBlocks>

To make our bit array, we break down the Base26 number multiple times by one-half until we've filled all of the bits in the array. Each time, if there's a remainder after dividing the number by 2 we set the current bit position to `true`.

<MakeCodeBlocks
  target="microbit"
  scale="1.0"
  maxHeight="350"
  type="png"
>

```typescript
let bitArray: Boolean[] = [];
let halfValue = 0
let accumValue = 0
let message = "BUZZY"
for (let j = 0; j <= message.length-1; j++) {
    charCode = message.charCodeAt(j) - 65
    accumValue = accumValue * 26 + charCode
}
for (let index = 0; index < 25; index++) {
        bitArray.push(false)
}
for (let bitIndex = 0; bitIndex <= 24; bitIndex++) {
    halfValue = Math.idiv(accumValue, 2)
    if (halfValue * 2 != accumValue) {
        bitArray[bitIndex] = true
    }
    accumValue = halfValue
}
```

</MakeCodeBlocks>

Let's try making a bit array for just one letter to see how it works. We'll use the letter 'B' since it has the value of `1` which will just show as only one bit being 'on' in the whole array.

<MakeCodeBlocks
  target="microbit"
  scale="1.0"
  maxHeight="350"
  type="png"
>

```typescript
let halfValue = 0
let charCode = 0
let accumValue = 0
let message = "B"
let binaryBits = ""
for (let j = 0; j <= message.length - 1; j++) {
    charCode = message.charCodeAt(j) - 65
    accumValue = accumValue * 26 + charCode
}
let binaryBits = ""
for (let bitIndex = 0; bitIndex <= 24; bitIndex++) {
    halfValue = Math.idiv(accumValue, 2)
    if (halfValue * 2 != accumValue) {
        binaryBits = binaryBits += " 1"
    } else {
        binaryBits = binaryBits += " 0"
    }
    accumValue = halfValue
}
basic.showString(binaryBits)
```

</MakeCodeBlocks>

Right away we see that the bit array starts with `1` and the whole array of bits is displayed as:

<ArrayDisplay
  :items="[
    1,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0
  ]"
  show-indices
/>

Would expect that the Base26 value of `B` should end up having a binary value of:

<ArrayDisplay
  :items="[
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,1
  ]"
  show-indices
  scroll-to-end
/>

Actually, that should be case but our encoding method does it backwards which makes the process encoding, and later decoding, the bits easier.

Generating the bits for `BUZZY` instead of just `B` gives us:

<ArrayDisplay
  :items="[
    0,1,1,0,1,0,1,1,0,1,
    0,1,1,0,0,1,0,0,1,1,
    0,0,0,0,0
  ]"
  show-indices
/>

## Formatting the QR display

With the method for taking a short message of letters and encoding into a sequence of bit, we are now ready to figure out how put them on the display so that they can be read by some other device. It's important to think about what is going to look at the display and recognize that a pattern of rows and columns of LED red light is a representation of some kind of information. We are going to use the web camera 📷 on a computer 💻 to look at the micro:bit's display 📱, try to capture the bits of information shown and decode them.

### Transfer the bits to the display

With all of the bits now encoding the message, we can now set the display to show them. This is a simple process of reading 5 bits for each row and doing that 5 times.

<MakeCodeBlocks
  target="microbit"
  hash="5630d823a83b565"
  scale="1.0"
  maxHeight="450"
  type="png"
>

```typescript
let x = 0
let y = 0
let bitArray ="0110101101011001001100000"
basic.clearScreen()
for (let ledIndex = 0; ledIndex <= 24; ledIndex++) {
    if (bitArray[ledIndex] == "1") {
        x = ledIndex % 5
        y = Math.idiv(ledIndex, 5)
        led.plot(x, y)
    }
}
```

</MakeCodeBlocks>

<MicrobitDisplay pattern="
09909
09909
09900
90099
00000
" />

### Alignment and calibration

You probably noticed that the QR Code has three large boxes in the corners of the code image. When the QR Code is scanned, the decoder knows where in the code image the data starts (opposite of the vertex of the 3 boxes). The orientation of the code (right-side up, upside down, on its side, or skewed) is known by the relative X and Y positions of the three corner squares. The boxes also let the scanner know the size in area of the barcode inside the image picture it scanned. The decoder can focus on just the pixels inside the bounds of the area of the 3 boxes and ignore the rest of the image.

<img
  src="./assets/qr-code.svg"
  alt="QR Code"
  style="border: 1px solid gray;"
  width="150"
/>

On the micro:bit display we can do the same thing. The LEDs in 3 of the display's corners can show the orientation of the code along with the width and the height of the code when the image of it is captured by the camera.

<MicrobitDisplay
  :leds="[
    [9,0,0,0,9],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [9,0,0,0,0]
  ]"
/>

### Multiplexing the display

A problem occurs when using 3 of our precious LEDs for calibration. This means that the information density is reduced by three bits and would mean we'd could only code 4 letters in a message at one time. One way to solve this problem is to "multiplex" the display by showing the 3 LED calibration for a brief amount of time, clear that, and then show the encoded message using all of the available LEDs.

<SideBySide gap="32px" borderless>
<MicrobitDisplay
  :leds="[
    [9,0,0,0,9],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [9,0,0,0,0]
  ]"
/>
<MicrobitDisplay pattern="
09909
09909
09900
90099
00000
" />
</SideBySide>

This separates the calibration pattern and the encoded pattern into _frames_. Since a camera records images as frames anyway, this gives the decoder the job of first recognizing the calibration frame and finding the metrics (size and orientation) of the QR code. Once the metrics of the QR code are known, the decoder will then wait until the message frame is displayed.

### Jitter and retargeting

What happens if the micro:bit is moved slightly, it jitters, between the time the decoder sees the calibration frame and the message frame? If the decoder expected to find the message pattern at the exact same X any Y position in message frame where it saw the calibration frame, the LED colors at expected pixel locations may not be there.

What's needed to remedy this situation is an anchor LED in the message frame to let the decoder find the beginning of the message code in its frame. This lets the decoder reacquire the area of the code in the frame captured for the message. The calibration frame is used to just discover the size and orientation of the coded area of a frame and doesn't determine its starting location.

If you remember from earlier, we learned that a 5 letter message can actually be encoded into 24 bits. This leaves an extra bit that we can use as our anchor bit. Sweet, the math is working in our favor!

In the message frame, we'll blend the anchor LED with the message LEDs. Instead of starting the message LED at (0,0) in the micro:bit display, we can just shift the bit array to the right so that the anchor LED occupies (0,0) and is always on.

<ArrayDisplay
  :items="[
    1,0,1,1,0,1,0,1,1,0,
    1,0,1,1,0,0,1,0,0,1,
    1,0,0,0,0
  ]"
  show-indices
/>

Let's quickly modify our `bitArray` test code to show the new message.

<MakeCodeBlocks
  target="microbit"
  scale="1.0"
  maxHeight="450"
  type="png"
>

```typescript
let x = 0
let y = 0
let bitArray ="1011010110101100100110000"
basic.clearScreen()
for (let ledIndex = 0; ledIndex <= 24; ledIndex++) {
    if (bitArray[ledIndex] == "1") {
        x = ledIndex % 5
        y = Math.idiv(ledIndex, 5)
        led.plot(x, y)
    }
}
```

</MakeCodeBlocks>

When plotted on the LEDs in the display, the new message code is a hybrid of the anchor LED and the encoded message LEDs.

<MicrobitDisplay
  :leds="[
    [9,0,9,9.0],
    [9,0,9,9,0],
    [9,0,9,9,0],
    [0,9,0,0,9],
    [9,0,0,0,0]
  ]"
/>