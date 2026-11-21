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

### Alignment and calibration

You probably noticed that the QR Code has shown earlier has three large boxes in the corners of the code. With the QR Code is scanned, the decoder knows where the where in the code image the data starts (opposite of the vertex of the 3 boxes) and orientation of the code (right-side up, upside down, on its side, or skewed). The boxes also let the scanner know the size of the barcode inside the image picture it scanned.

On the micro:bit display we can do the same thing. The LEDs in 3 of the display's corners can show the orientation of the code along with the width and the height of the code in the scanned image of it.

<MicrobitDisplay
  :leds="[
    [9,0,0,0,9],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [9,0,0,0,0]
  ]"
/>

### Information density

Since there are only 25 LEDs to use there is a limited amount of information we can encode into the display. If each LED represents a binary bit, then there **2²⁵** values available to encode. Now, that equals **33,554,432** values which seems like a lot. But, if we want to encode letters of a message, each alphabetic letter is one of 26 possible values (charCode()). This turns into **26ˣ** where 'x' is the number of letters that, using their character code values, can fit together to form a number less than **33,554,432**.

One way to think of it is that each letter represents a digit of 26 values in a number that is _x_ digits long. This forms a Base-26 number. How do we find out how many digits we can pack into the display matrix? Let's run this code in the [micro:bit code editor](https://makecode.microbit.org/#editor) to determine the number of Base-26 digits we can use:

```typescript
let limit26 = 26
let digits = 0
let max5x5 = 2 ** 25 // 33,554,432
while (limit26 < max5x5) {
    digits += 1
    limit26 = limit26 * 26
    basic.showNumber(digits)
    basic.pause(250)
}
```

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

```typescript
basic.showNumber("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charCodeAt(0))
// 65

basic.showNumber("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charCodeAt(25))
// 90
```

To give each letter a zero-based value, so that `A = 0`, `B = 1`, and so on, we'll subtract `65` from each letter value. Let's discover what the digit values are for our message word "BUZZY":

```typescript
let message = "BUZZY"
for (let i = 0; i <= message.length - 1; i++) {
    basic.showString(message.charAt(i) + "=")
    basic.showNumber(message.charCodeAt(i) - 65)
    basic.pause(500)
}

// B = 1; U = 20; Z = 25; Z = 25; Y = 24
```

#### Accumulate the digits of the message

Since the letters of the message are the digits of the Base-26 number we will encode into our QR Code, we now have a way to make values for those "digits". To add up the total value of the the digits of the message, we need to adjust the place value of the previous digit as each new digit is added in. This is done by multiplying the currently accumulated value by `26` before each new digit is added in. Press "**Start**" in the animation box below to see how the process works.

<Base26Encoder
  word="BUZZY"
  :interval="1500"
/>

Here's how we accumulate this value on the micro:bit:

```typescript
let message = "BUZZY"
let charCode = 0
let accumValue = 0
for (let j = 0; j <= message.length-1; j++) {
    charCode = message.charCodeAt(j) - 65
    accumValue = accumValue * 26 + charCode
}
basic.showNumber(accumValue)

// 826070
```

### Convert to bits

Having a total value for Base-26 message letters is a major step. To show a single image representation of this value on the display requires that we have some way to represent binary number for this value. This is because the LEDs on the display will show the individual bit values for the that number, 🟧 = 1 and ⬜ = 0.

A simple way to have a binary representation of the accumulated value for our message digits is to use a Boolean array. The array will map the binary digits (bits) of the message value where each element is a bit to tell one of the LEDs to turn on or off. Even though the display is a matrix with rows and columns, we can just use a one-dimensional array and divide it into 5-bit segments for each row. 

```typescript
let bitArray: Boolean[] = []
```

To make our bit array, we break down the Base-26 number multiple times by one-half until we've filled all of the bits in the array. Each time, if there's a remainder after dividing the number by 2 we set the current bit position to `true`.

```typescript
let bitArray: Boolean[] = [];
let halfValue = 0
let accumValue = accumulateBase26Value("BUZZY")
// initialize bitArray to have all LEDs 'off'
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

Let's try making a bit array for just one letter to see how it works. We'll use the letter 'B' since it has the value of `1` which will just show as only one bit being 'on' in the whole array.

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
    let bitArray: boolean[] = []
    halfValue = Math.idiv(accumValue, 2)
    if (halfValue * 2 != accumValue) {
        bitArray[bitIndex] = true
        binaryBits = binaryBits += " 1"
    } else {
        binaryBits = binaryBits += " 0"

    }
    accumValue = halfValue
}
basic.showString(binaryBits)
```

Right away we see that the bit array starts with `1` and the whole array of bits is displayed as:

```
1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
```

Would expect that the Base-26 value of `B` should end up having a binary value of:

```
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1
```

Actually, that should be case but our encoding method does it backwards which makes the process encoding, and later decoding, the bits easier.

Generating the bits for `BUZZY` instead of just `B` gives us:

```
0 1 1 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
```

### Transfer the bits to the display

With all of the bits now encoding the message, we can now set the display to show them. This is a simple process of reading 5 bits for each row and doing that 5 times.

```typescript
let x = 0
let y = 0
for (let ledIndex = 0; ledIndex <= 24; ledIndex++) {
    if (bitArray[ledIndex]) {
        x = ledIndex % 5
        y = Math.idiv(ledIndex, 5)
        led.plot(x, y)
    }
}
```

<MicrobitDisplay pattern="
09909
09909
09900
90099
00000
" />

