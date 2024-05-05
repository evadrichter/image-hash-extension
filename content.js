console.log("Content script has been loaded and is ready to receive messages.");


function loadImage(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = "Anonymous"; // Needed for CORS
      img.src = src;
    });
  }
  
  function computeHash(img, hashSize = 8) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = hashSize;
    const height = hashSize;
  
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
  
    // Draw image in canvas
    ctx.drawImage(img, 0, 0, width, height);
  
    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height).data;
  
    // Compute average
    let sum = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      let avg = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
      sum += avg;
    }
    const avg = sum / (width * height);
  
    // Compute hash
    let hash = '';
    for (let i = 0; i < imageData.length; i += 4) {
      let pixelAvg = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
      hash += pixelAvg > avg ? '1' : '0';
    }
    return hash;
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "computeHash" && message.imageUrl) {
      loadImage(message.imageUrl).then((img) => {
        const hash = computeHash(img);
        console.log(`Hash for ${message.imageUrl}: ${hash}`);
        sendResponse({hash: hash});
      }).catch(err => console.error('Error loading image:', err));
    }
    return true; // indicates an asynchronous response
  });
  