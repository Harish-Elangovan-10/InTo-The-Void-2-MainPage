document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const matrix = document.getElementById("matrix");
  if (!canvas || !matrix) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = 120;
  canvas.height = 60;

  const imageUrls = [
    "assets/sponser/cyberdefenders.png",
    "assets/sponser/alteredsecurity.png"
  ];

  let currentImageIndex = 0;

  function updateImage() {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      ctx.clearRect(0, 0, 120, 60);
      
      const imgAspect = img.width / img.height;
      const canvasAspect = 120 / 60;
      let drawWidth, drawHeight, dx, dy;
      
      if (imgAspect > canvasAspect) {
        drawWidth = 120;
        drawHeight = 120 / imgAspect;
        dx = 0;
        dy = (60 - drawHeight) / 2;
      } else {
        drawHeight = 60;
        drawWidth = 60 * imgAspect;
        dx = (120 - drawWidth) / 2;
        dy = 0;
      }
      
      // Use better smoothing if needed, though canvas does decent bilinear downscaling
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      const imageData = ctx.getImageData(0, 0, 120, 60);
      const data = imageData.data;
      
      // Determine if the image has a transparent background
      let transparentPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 50) transparentPixels++;
      }
      const isTransparentBg = transparentPixels > (data.length / 4) * 0.1; // more than 10% transparent

      const matris = [];
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        const grey = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        let isActive = 0;
        if (isTransparentBg) {
          // If transparent bg, the logo is defined by what is opaque
          // We consider it active if it's opaque enough
          if (alpha > 100) isActive = 1;
        } else {
          // If solid bg, the logo is defined by dark pixels
          if (alpha > 128 && grey < 220) isActive = 1;
        }

        const row = Math.floor(i / 4 / 120);
        if (!matris[row]) {
          matris[row] = [];
        }
        matris[row].push(isActive);
      }

      createSymbol(matris);
    };

    img.src = imageUrls[currentImageIndex];
    currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
  }

  setInterval(updateImage, 800);

  for (let i = 0; i < 7200; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    matrix.appendChild(dot);
  }

  function createSymbol(matris) {
    for (let row = 0; row < matris.length; row++) {
      for (let col = 0; col < matris[row].length; col++) {
        const dotIndex = row * 120 + col;
        const dot = document.querySelectorAll("#matrix .dot")[dotIndex];

        if (dot) {
          if (matris[row][col] === 1) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
        }
      }
    }
  }

  let matris = [];
  createSymbol(matris);
});
