// ============================================
// STEGANOGRAPHY WEB APPLICATION
// ============================================

// Global state
let currentMode = 'encode';
let currentTab = 'image';
let uploadedFiles = {
    image: null,
    audio: null,
    video: null
};
let resultFiles = {
    image: null,
    audio: null,
    video: null
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeFileUploads();
});

function initializeEventListeners() {
    // Mode switcher
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // Tab switcher
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Encryption checkboxes
    setupEncryptionToggles('image');
    setupEncryptionToggles('audio');
    setupEncryptionToggles('video');

    // Action buttons
    document.getElementById('imageEncodeBtn').addEventListener('click', () => encodeImage());
    document.getElementById('imageDecodeBtn').addEventListener('click', () => decodeImage());
    document.getElementById('audioEncodeBtn').addEventListener('click', () => encodeAudio());
    document.getElementById('audioDecodeBtn').addEventListener('click', () => decodeAudio());
    document.getElementById('videoEncodeBtn').addEventListener('click', () => encodeVideo());
    document.getElementById('videoDecodeBtn').addEventListener('click', () => decodeVideo());

    // Download buttons
    document.getElementById('imageDownloadBtn').addEventListener('click', () => downloadFile('image'));
    document.getElementById('audioDownloadBtn').addEventListener('click', () => downloadFile('audio'));
    document.getElementById('videoDownloadBtn').addEventListener('click', () => downloadFile('video'));
}

function setupEncryptionToggles(type) {
    const encryptCheckbox = document.getElementById(`${type}Encrypt`);
    const decryptCheckbox = document.getElementById(`${type}Decrypt`);
    const passwordGroup = document.getElementById(`${type}PasswordGroup`);
    const decryptPasswordGroup = document.getElementById(`${type}DecryptPasswordGroup`);

    if (encryptCheckbox) {
        encryptCheckbox.addEventListener('change', (e) => {
            passwordGroup.classList.toggle('hidden', !e.target.checked);
        });
    }

    if (decryptCheckbox) {
        decryptCheckbox.addEventListener('change', (e) => {
            decryptPasswordGroup.classList.toggle('hidden', !e.target.checked);
        });
    }
}

function initializeFileUploads() {
    setupFileUpload('image', ['image/png', 'image/jpeg', 'image/jpg'], 10 * 1024 * 1024);
    setupFileUpload('audio', ['audio/wav', 'audio/wave'], 20 * 1024 * 1024);
    setupFileUpload('video', ['video/mp4', 'video/webm'], 50 * 1024 * 1024);
}

function setupFileUpload(type, acceptedTypes, maxSize) {
    const uploadArea = document.getElementById(`${type}Upload`);
    const fileInput = document.getElementById(`${type}File`);
    const fileName = document.getElementById(`${type}FileName`);
    const preview = document.getElementById(`${type}Preview`);

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // File selection
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0], type, acceptedTypes, maxSize, fileName, preview);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFileSelect(e.dataTransfer.files[0], type, acceptedTypes, maxSize, fileName, preview);
    });
}

function handleFileSelect(file, type, acceptedTypes, maxSize, fileNameElement, previewElement) {
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
        showNotification(`Please upload a valid ${type} file`, 'error');
        return;
    }

    // Validate file size
    if (file.size > maxSize) {
        showNotification(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`, 'error');
        return;
    }

    uploadedFiles[type] = file;
    fileNameElement.textContent = file.name;
    fileNameElement.classList.remove('hidden');

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewElement.classList.remove('hidden');
        if (type === 'image') {
            document.getElementById(`${type}PreviewImg`).src = e.target.result;
        } else if (type === 'audio') {
            document.getElementById(`${type}PreviewPlayer`).src = e.target.result;
        } else if (type === 'video') {
            document.getElementById(`${type}PreviewPlayer`).src = e.target.result;
        }
    };
    reader.readAsDataURL(file);

    showNotification(`${file.name} uploaded successfully`, 'success');
}

// ============================================
// UI FUNCTIONS
// ============================================

function switchMode(mode) {
    currentMode = mode;
    
    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Toggle encode/decode sections
    const isEncode = mode === 'encode';
    document.querySelectorAll('.encode-section').forEach(el => {
        el.classList.toggle('hidden', !isEncode);
    });
    document.querySelectorAll('.decode-section').forEach(el => {
        el.classList.toggle('hidden', isEncode);
    });
    document.querySelectorAll('.encode-btn').forEach(el => {
        el.classList.toggle('hidden', !isEncode);
    });
    document.querySelectorAll('.decode-btn').forEach(el => {
        el.classList.toggle('hidden', isEncode);
    });
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tab}Tab`);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// ENCRYPTION/DECRYPTION
// ============================================

function encryptMessage(message, password) {
    try {
        return CryptoJS.AES.encrypt(message, password).toString();
    } catch (error) {
        throw new Error('Encryption failed');
    }
}

function decryptMessage(encryptedMessage, password) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, password);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error('Invalid password');
        return decrypted;
    } catch (error) {
        throw new Error('Decryption failed - invalid password or corrupted data');
    }
}

// ============================================
// IMAGE STEGANOGRAPHY
// ============================================

async function encodeImage() {
    const file = uploadedFiles.image;
    const message = document.getElementById('imageMessage').value;
    const useEncryption = document.getElementById('imageEncrypt').checked;
    const password = document.getElementById('imagePassword').value;

    // Validation
    if (!file) {
        showNotification('Please upload an image first', 'error');
        return;
    }
    if (!message) {
        showNotification('Please enter a message to hide', 'error');
        return;
    }
    if (useEncryption && !password) {
        showNotification('Please enter a password', 'error');
        return;
    }

    try {
        // Encrypt message if needed
        let finalMessage = message;
        if (useEncryption) {
            finalMessage = encryptMessage(message, password);
        }

        // Add delimiter to mark end of message
        finalMessage = finalMessage + '<<<END>>>';

        // Load image
        const img = await loadImage(file);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert message to binary
        const binary = stringToBinary(finalMessage);

        // Check capacity
        const maxCapacity = (data.length / 4) * 3; // 3 bits per pixel (RGB)
        if (binary.length > maxCapacity) {
            showNotification('Message too long for this image', 'error');
            return;
        }

        // Encode message in LSB
        let binaryIndex = 0;
        for (let i = 0; i < data.length && binaryIndex < binary.length; i++) {
            // Skip alpha channel
            if ((i + 1) % 4 === 0) continue;

            // Modify LSB
            data[i] = (data[i] & 0xFE) | parseInt(binary[binaryIndex]);
            binaryIndex++;
        }

        // Put modified data back
        ctx.putImageData(imageData, 0, 0);

        // Convert to blob
        canvas.toBlob((blob) => {
            resultFiles.image = blob;
            
            // Show result
            const resultImg = document.getElementById('imageResultImg');
            resultImg.src = URL.createObjectURL(blob);
            document.getElementById('imageResultPreview').classList.remove('hidden');
            document.getElementById('imageDownloadBtn').classList.remove('hidden');
            
            const output = document.getElementById('imageOutput');
            output.textContent = `✅ Success!\n\nMessage encoded successfully.\nOriginal size: ${file.size} bytes\nEncoded size: ${blob.size} bytes\nMessage length: ${message.length} characters\nEncryption: ${useEncryption ? 'Yes' : 'No'}`;
            
            showNotification('Image encoded successfully!', 'success');
        }, 'image/png');

    } catch (error) {
        showNotification('Encoding failed: ' + error.message, 'error');
    }
}

async function decodeImage() {
    const file = uploadedFiles.image;
    const useDecryption = document.getElementById('imageDecrypt').checked;
    const password = document.getElementById('imageDecryptPassword').value;

    // Validation
    if (!file) {
        showNotification('Please upload an image first', 'error');
        return;
    }
    if (useDecryption && !password) {
        showNotification('Please enter a password', 'error');
        return;
    }

    try {
        // Load image
        const img = await loadImage(file);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Extract binary from LSB
        let binary = '';
        for (let i = 0; i < data.length; i++) {
            // Skip alpha channel
            if ((i + 1) % 4 === 0) continue;

            binary += (data[i] & 1).toString();
        }

        // Convert binary to string
        let message = binaryToString(binary);

        // Find delimiter
        const delimiterIndex = message.indexOf('<<<END>>>');
        if (delimiterIndex === -1) {
            showNotification('No hidden message found in this image', 'error');
            return;
        }

        message = message.substring(0, delimiterIndex);

        // Decrypt if needed
        if (useDecryption) {
            message = decryptMessage(message, password);
        }

        // Show result
        const output = document.getElementById('imageOutput');
        output.textContent = `✅ Message Decoded:\n\n${message}`;
        
        showNotification('Message decoded successfully!', 'success');

    } catch (error) {
        showNotification('Decoding failed: ' + error.message, 'error');
    }
}

// ============================================
// AUDIO STEGANOGRAPHY
// ============================================

async function encodeAudio() {
    const file = uploadedFiles.audio;
    const message = document.getElementById('audioMessage').value;
    const useEncryption = document.getElementById('audioEncrypt').checked;
    const password = document.getElementById('audioPassword').value;

    // Validation
    if (!file) {
        showNotification('Please upload an audio file first', 'error');
        return;
    }
    if (!message) {
        showNotification('Please enter a message to hide', 'error');
        return;
    }
    if (useEncryption && !password) {
        showNotification('Please enter a password', 'error');
        return;
    }

    try {
        // Encrypt message if needed
        let finalMessage = message;
        if (useEncryption) {
            finalMessage = encryptMessage(message, password);
        }
        finalMessage = finalMessage + '<<<END>>>';

        // Load audio
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get audio samples
        const channelData = audioBuffer.getChannelData(0);
        const samples = new Float32Array(channelData);

        // Convert message to binary
        const binary = stringToBinary(finalMessage);

        // Check capacity
        if (binary.length > samples.length) {
            showNotification('Message too long for this audio file', 'error');
            return;
        }

        // Encode in LSB
        for (let i = 0; i < binary.length; i++) {
            // Convert float to 16-bit integer
            let sample = Math.floor(samples[i] * 32768);
            
            // Modify LSB
            sample = (sample & 0xFFFE) | parseInt(binary[i]);
            
            // Convert back to float
            samples[i] = sample / 32768;
        }

        // Create new audio buffer
        const newBuffer = audioContext.createBuffer(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );
        newBuffer.copyToChannel(samples, 0);

        // Convert to WAV
        const wavBlob = audioBufferToWav(newBuffer);
        resultFiles.audio = wavBlob;

        // Show result
        const resultPlayer = document.getElementById('audioResultPlayer');
        resultPlayer.src = URL.createObjectURL(wavBlob);
        document.getElementById('audioResultPreview').classList.remove('hidden');
        document.getElementById('audioDownloadBtn').classList.remove('hidden');

        const output = document.getElementById('audioOutput');
        output.textContent = `✅ Success!\n\nMessage encoded successfully.\nOriginal size: ${file.size} bytes\nEncoded size: ${wavBlob.size} bytes\nMessage length: ${message.length} characters\nEncryption: ${useEncryption ? 'Yes' : 'No'}`;

        showNotification('Audio encoded successfully!', 'success');

    } catch (error) {
        showNotification('Encoding failed: ' + error.message, 'error');
    }
}

async function decodeAudio() {
    const file = uploadedFiles.audio;
    const useDecryption = document.getElementById('audioDecrypt').checked;
    const password = document.getElementById('audioDecryptPassword').value;

    // Validation
    if (!file) {
        showNotification('Please upload an audio file first', 'error');
        return;
    }
    if (useDecryption && !password) {
        showNotification('Please enter a password', 'error');
        return;
    }

    try {
        // Load audio
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get audio samples
        const channelData = audioBuffer.getChannelData(0);

        // Extract binary from LSB
        let binary = '';
        for (let i = 0; i < channelData.length; i++) {
            const sample = Math.floor(channelData[i] * 32768);
            binary += (sample & 1).toString();
        }

        // Convert binary to string
        let message = binaryToString(binary);

        // Find delimiter
        const delimiterIndex = message.indexOf('<<<END>>>');
        if (delimiterIndex === -1) {
            showNotification('No hidden message found in this audio', 'error');
            return;
        }

        message = message.substring(0, delimiterIndex);

        // Decrypt if needed
        if (useDecryption) {
            message = decryptMessage(message, password);
        }

        // Show result
        const output = document.getElementById('audioOutput');
        output.textContent = `✅ Message Decoded:\n\n${message}`;

        showNotification('Message decoded successfully!', 'success');

    } catch (error) {
        showNotification('Decoding failed: ' + error.message, 'error');
    }
}

// ============================================
// VIDEO STEGANOGRAPHY
// ============================================

async function encodeVideo() {
    const file = uploadedFiles.video;
    const message = document.getElementById('videoMessage').value;
    const useEncryption = document.getElementById('videoEncrypt').checked;
    const password = document.getElementById('videoPassword').value;

    // Validation
    if (!file) {
        showNotification('Please upload a video file first', 'error');
        return;
    }
    if (!message) {
        showNotification('Please enter a message to hide', 'error');
        return;
    }
    if (useEncryption && !password) {
        showNotification('Please enter a password', 'error');
        return;
    }

    try {
        // Encrypt message if needed
        let finalMessage = message;
        if (useEncryption) {
            finalMessage = encryptMessage(message, password);
        }
        finalMessage = finalMessage + '<<<END>>>';

        // Load video
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        
        await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
        });

        // Extract first frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.currentTime = 0;
        await new Promise((resolve) => {
            video.onseeked = resolve;
        });
        
        ctx.drawImage(video, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert message to binary
        const binary = stringToBinary(finalMessage);

        // Check capacity
        const maxCapacity = (data.length / 4) * 3;
        if (binary.length > maxCapacity) {
            showNotification('Message too long for this video', 'error');
            return;
        }

        // Encode message in LSB
        let binaryIndex = 0;
        for (let i = 0; i < data.length && binaryIndex < binary.length; i++) {
            if ((i + 1) % 4 === 0) continue;
            data[i] = (data[i] & 0xFE) | parseInt(binary[binaryIndex]);
            binaryIndex++;
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert to blob (as image since we can't re-encode video in browser easily)
        canvas.toBlob((blob) => {
            resultFiles.video = blob;
            
            // Show result as image
            const resultPlayer = document.getElementById('videoResultPlayer');
            resultPlayer.poster = URL.createObjectURL(blob);
            resultPlayer.src = URL.createObjectURL(file);
            document.getElementById('videoResultPreview').classList.remove('hidden');
            document.getElementById('videoDownloadBtn').classList.remove('hidden');

            const output = document.getElementById('videoOutput');
            output.textContent = `✅ Success!\n\nMessage encoded in first frame.\nNote: Download will be the encoded frame as PNG.\nFor full video encoding, use server-side processing.\n\nMessage length: ${message.length} characters\nEncryption: ${useEncryption ? 'Yes' : 'No'}`;

            showNotification('Video frame encoded successfully!', 'success');
        }, 'image/png');

    } catch (error) {
        showNotification('Encoding failed: ' + error.message, 'error');
    }
}

async function decodeVideo() {
    const file = uploadedFiles.video;
    const useDecryption = document.getElementById('videoDecrypt').checked;
    const password = document.getElementById('videoDecryptPassword').value;

    // Validation
    if (!file) {
        showNotification('Please upload a video file first', 'error');
        return;
    }
    if (useDecryption && !password) {
        showNotification('Please enter a password', 'error');
        return;
    }

    try {
        // Load video
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        
        await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
        });

        // Extract first frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.currentTime = 0;
        await new Promise((resolve) => {
            video.onseeked = resolve;
        });
        
        ctx.drawImage(video, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Extract binary from LSB
        let binary = '';
        for (let i = 0; i < data.length; i++) {
            if ((i + 1) % 4 === 0) continue;
            binary += (data[i] & 1).toString();
        }

        // Convert binary to string
        let message = binaryToString(binary);

        // Find delimiter
        const delimiterIndex = message.indexOf('<<<END>>>');
        if (delimiterIndex === -1) {
            showNotification('No hidden message found in this video', 'error');
            return;
        }

        message = message.substring(0, delimiterIndex);

        // Decrypt if needed
        if (useDecryption) {
            message = decryptMessage(message, password);
        }

        // Show result
        const output = document.getElementById('videoOutput');
        output.textContent = `✅ Message Decoded:\n\n${message}`;

        showNotification('Message decoded successfully!', 'success');

    } catch (error) {
        showNotification('Decoding failed: ' + error.message, 'error');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

function stringToBinary(str) {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        binary += charCode.toString(2).padStart(8, '0');
    }
    return binary;
}

function binaryToString(binary) {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.substr(i, 8);
        const charCode = parseInt(byte, 2);
        if (charCode === 0) break; // Stop at null character
        str += String.fromCharCode(charCode);
    }
    return str;
}

function audioBufferToWav(buffer) {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    let result;
    if (numberOfChannels === 2) {
        result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
        result = buffer.getChannelData(0);
    }

    return encodeWAV(result, numberOfChannels, sampleRate, bitDepth);
}

function interleave(leftChannel, rightChannel) {
    const length = leftChannel.length + rightChannel.length;
    const result = new Float32Array(length);

    let inputIndex = 0;
    for (let i = 0; i < length;) {
        result[i++] = leftChannel[inputIndex];
        result[i++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
}

function encodeWAV(samples, numChannels, sampleRate, bitDepth) {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, numChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * blockAlign, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, blockAlign, true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, samples.length * bytesPerSample, true);

    // write the PCM samples
    floatTo16BitPCM(view, 44, samples);

    return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function downloadFile(type) {
    const file = resultFiles[type];
    if (!file) {
        showNotification('No file to download', 'error');
        return;
    }

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    
    // Set filename based on type
    const timestamp = new Date().getTime();
    if (type === 'image') {
        a.download = `stegano_image_${timestamp}.png`;
    } else if (type === 'audio') {
        a.download = `stegano_audio_${timestamp}.wav`;
    } else if (type === 'video') {
        a.download = `stegano_frame_${timestamp}.png`;
    }
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('File downloaded successfully!', 'success');
}
