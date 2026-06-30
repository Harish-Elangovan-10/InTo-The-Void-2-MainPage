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
  let dots = [];

  // Create a loading screen for the matrix
  const loadingScreen = document.createElement("div");
  loadingScreen.style.position = "absolute";
  loadingScreen.style.top = "50%";
  loadingScreen.style.left = "50%";
  loadingScreen.style.transform = "translate(-50%, -50%)";
  loadingScreen.style.color = "#00dbe9";
  loadingScreen.style.fontFamily = "monospace";
  loadingScreen.style.fontSize = "18px";
  loadingScreen.style.fontWeight = "bold";
  loadingScreen.style.zIndex = "10";
  loadingScreen.style.textShadow = "0 0 10px rgba(0, 219, 233, 0.8)";
  loadingScreen.innerText = "INITIALIZING MATRIX...";
  matrix.appendChild(loadingScreen);

  let dotsCreated = 0;
  const totalDots = 7200;

  function createDotsChunk() {
    const chunk = 800; // Create and append 800 dots per frame
    const end = Math.min(dotsCreated + chunk, totalDots);
    const fragment = document.createDocumentFragment();
    for (let i = dotsCreated; i < end; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      fragment.appendChild(dot);
      dots.push(dot);
    }
    matrix.appendChild(fragment);
    dotsCreated = end;

    if (dotsCreated < totalDots) {
      requestAnimationFrame(createDotsChunk);
    } else {
      loadingScreen.style.display = "none";
      // Start the animation only after all dots are created
      updateImage();
      setInterval(updateImage, 800);
    }
  }

  // Start creating dots in chunks
  requestAnimationFrame(createDotsChunk);

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
      
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      const imageData = ctx.getImageData(0, 0, 120, 60);
      const data = imageData.data;
      
      let transparentPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 50) transparentPixels++;
      }
      const isTransparentBg = transparentPixels > (data.length / 4) * 0.1;

      const matris = [];
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        const grey = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        let isActive = 0;
        if (isTransparentBg) {
          if (alpha > 100) isActive = 1;
        } else {
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

  function createSymbol(matris) {
    if (!matris || matris.length === 0) return;
    for (let row = 0; row < matris.length; row++) {
      for (let col = 0; col < matris[row].length; col++) {
        const dotIndex = row * 120 + col;
        const dot = dots[dotIndex];

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
});
