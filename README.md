## 🎩 About The Project

This is the extension for Visual Studio Code which will generize a visual text that indicates your typing performance on your screen

## 🌟 Demo

<p align="center">
<img src="https://user-images.githubusercontent.com/36455825/209904277-95afd713-c966-4e86-a785-4bbe2b64b6ab.gif">
</p>

### ✨ Features

- Display the typing performance (letters per sec)
- Display the combo stage every 10x letters
- Shake the screen if going over 30x letters streak

### 🚩 Note

- ~~May not working well if the Error Lens OR GitLens extension install~~

# CHANGELOG

## 0.2.0 (2022-12-29)

Enhancement:

- ComboStage display now have dynamic color and rotation
- TypePerformance display now have dynamic random color as it floating up

Adjust:

- 30x letters streak to start the shake-simulation

## 0.1.0 (2022-12-29)

Compatibility:

- Now fully working properly with Git-lens & Errors-lens enabled

## 0.0.21 (2022-12-28)

Adjust:

- prevent streak of 1 from displaying on the screen

## 0.0.2 (2022-12-28)

Features:

- typePerformanceDisplay is now support animating

Fix:

- prevent spacebar from counting the streak

Adjust:

- the margin-top of the comboStage display

## 0.0.1 (2022-12-27)

Release:

- the base version with comboStage display and type performance display
