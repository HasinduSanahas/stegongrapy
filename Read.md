# 🔐 SteganoGray - Advanced Cross-Media Steganography Tool

SteganoGray is a state-of-the-art web application designed to securely hide and extract encrypted secret messages within various digital media formats, including **Images, Audio, and Video files**. Built with absolute privacy in mind, all operations are executed completely on the client side, ensuring that sensitive data never leaves the user's browser.

---

## 🚀 Key Features

* **Triple Media Support:** Seamless steganographic operations across three core media types:
  * **Images:** Standard image embedding using pixel manipulation.
  * **Audio:** High-fidelity audio encoding utilizing PCM WAV files.
  * **Video:** Frame-by-frame carrier manipulation for video data.
* **Robust AES-256 Encryption:** Integrates the `CryptoJS` library to fully encrypt hidden text payloads using custom user passwords before they are injected into media.
* **100% Client-Side Processing:** No servers, no APIs, and no databases. All data transformations are computed entirely locally within the browser context.
* **Premium Glassmorphism UI:** Features a highly responsive, modern dark-themed interface built with smooth transition states, custom tabs, and real-time interactive dashboards.
* **Drag-and-Drop Workflow:** Features fluid drag-and-drop mechanics paired with dynamic file loading states for enhanced UX.

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Structure:** HTML5 (Semantic Layout)
* **Styling Framework:** Custom CSS3 utilizing CSS variables, responsive `@media` breakouts, and frosted-glass structural layouts.
* **Core Logic:** Vanilla JavaScript (ES6+ Asynchronous Event Framework)
* **Cryptographic Engine:** [CryptoJS v4.2.0](https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js) (AES-256 Cipher Block Chaining)

---

## 📁 Project Structure

```text
├── index.html       # Application backbone and viewport configuration
├── style.css        # Glassmorphic UI specifications, global animations, & styling variables
├── app.js           # Steganography algorithms, crypto hooks, and event architecture
└── README.md        # Comprehensive documentation (This file)