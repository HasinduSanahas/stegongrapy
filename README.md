<div align="center">

# 🔐 SteganoGray

### *The Ultimate Open-Source Cross-Media Steganography Suite*

<p align="center">
  <img src="https://img.shields.io/badge/Open%20Source-100%25-brightgreen?style=for-the-badge&logo=open-source&logoColor=white" alt="100% Open Source" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=mit&logoColor=white" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-purple?style=for-the-badge&logo=github" alt="PRs Welcome" />
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-open-source-freedom">Open Source Freedom</a>
</p>

---

<p align="center">
  <strong>SteganoGray</strong> is a state-of-the-art open-source web application designed to securely encode and decode encrypted payloads inside <strong>Images, Audio, and Video files</strong>. Built with a premium glassmorphic dark interface, it processes everything locally—ensuring maximum privacy.
</p>

---
</div>

> [!IMPORTANT]
> **100% Client-Side Processing:** Your data never touches a server. All cryptographic transformations and bitwise manipulations occur entirely within your local browser context. 

---

## 🚀 Key Features

| Media Medium | Core Mechanics | Cryptography | Output Target |
| :--- | :--- | :--- | :--- |
| **🖼️ Images** | Pixel Channel LSB Manipulation | AES-256 (CryptoJS) | Lossless Image |
| **🎵 Audio** | Float32 to 16-bit PCM WAV Stream | AES-256 (CryptoJS) | Uncompressed WAV |
| **🎬 Video** | Keyframe Extraction & Processing | AES-256 (CryptoJS) | Extracted Carrier Graphic |

* **Triple Carrier Coverage:** Seamless data embedding across Images, Audio (WAV), and Video wrappers.
* **Military-Grade Cryptography:** Leverages AES-256 symmetric key encryption to obfuscate secret messages prior to structural payload injection.
* **Premium Glassmorphic UI/UX:** A highly responsive, sleek dark theme complete with customized interactive drag-and-drop file terminals and smooth animation keyframes.

---

## 🛠️ Tech Stack

The entire application runs seamlessly with **zero external server dependencies** and **zero build setups**:

- **Structure:** `HTML5` (Semantic layout engine)
- **Styling:** `CSS3` (Custom properties, micro-interactions, responsive `@media` viewports, and Frosted Glass layouts)
- **Core Logic:** `Vanilla JavaScript` (ES6+ Asynchronous Event Handling)
- **Crypto Engine:** `CryptoJS v4.2.0` (AES Cipher Block Chaining architecture)

---

## 📁 Project Architecture

```text
📂 SteganoGray/
├── 📄 index.html       # Viewport backbone, layout layers, and layout slots
├── 📄 style.css        # Glassmorphic UI specifications, custom variables, & animations
├── 📄 app.js           # Steganography codecs, cryptographic triggers, & file handling
└── 📄 README.md        # Documentation (This file)
