const hmwBlock = document.querySelector("[data-hmw]");

if (hmwBlock) {
  const hmwObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          hmwObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  hmwObserver.observe(hmwBlock);
}

function initWordStage() {
  const stage = document.querySelector("[data-word-stage]");
  if (!stage) return;

  const wordElements = [...stage.querySelectorAll(".word")];
  const starts = [
    [0.34, 0.42],
    [0.12, 0.2],
    [0.64, 0.18],
    [0.47, 0.68],
    [0.12, 0.62],
    [0.72, 0.54],
    [0.06, 0.43],
    [0.27, 0.1],
    [0.72, 0.35],
    [0.47, 0.26],
    [0.82, 0.1],
    [0.2, 0.78],
    [0.62, 0.78],
    [0.82, 0.72],
    [0.34, 0.82],
    [0.58, 0.08],
    [0.9, 0.3],
    [0.05, 0.83],
    [0.42, 0.55],
    [0.7, 0.86],
  ];

  const words = wordElements.map((element, index) => ({
    element,
    x: 0,
    y: 0,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    width: 0,
    height: 0,
    dragging: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    start: starts[index] || [Math.random() * 0.8, Math.random() * 0.8],
  }));

  let pointer = null;
  let dragged = null;

  function measureAndPlace() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;

    words.forEach((word) => {
      word.width = word.element.offsetWidth;
      word.height = word.element.offsetHeight;
      word.x = Math.min(Math.max(width * word.start[0], 8), Math.max(width - word.width - 8, 8));
      word.y = Math.min(Math.max(height * word.start[1], 8), Math.max(height - word.height - 8, 8));
    });
  }

  requestAnimationFrame(measureAndPlace);

  words.forEach((word) => {
    word.element.addEventListener("pointerdown", (event) => {
      const rect = stage.getBoundingClientRect();
      dragged = word;
      word.dragging = true;
      word.pointerOffsetX = event.clientX - rect.left - word.x;
      word.pointerOffsetY = event.clientY - rect.top - word.y;
      word.element.setPointerCapture(event.pointerId);
      word.element.style.zIndex = "5";
    });

    word.element.addEventListener("pointerup", () => {
      if (!dragged) return;
      dragged.dragging = false;
      dragged.element.style.zIndex = "";
      dragged = null;
    });

    word.element.addEventListener("pointercancel", () => {
      if (!dragged) return;
      dragged.dragging = false;
      dragged.element.style.zIndex = "";
      dragged = null;
    });
  });

  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };

    if (dragged) {
      dragged.x = pointer.x - dragged.pointerOffsetX;
      dragged.y = pointer.y - dragged.pointerOffsetY;
      dragged.vx = 0;
      dragged.vy = 0;
    }
  });

  stage.addEventListener("pointerleave", () => {
    pointer = null;
  });

  window.addEventListener("resize", measureAndPlace);

  function tick() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;

    words.forEach((word) => {
      word.width = word.element.offsetWidth;
      word.height = word.element.offsetHeight;

      if (!word.dragging) {
        word.x += word.vx;
        word.y += word.vy;
      }

      if (pointer && !word.dragging) {
        const centerX = word.x + word.width / 2;
        const centerY = word.y + word.height / 2;
        const dx = centerX - pointer.x;
        const dy = centerY - pointer.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);

        if (distance < 130) {
          const force = (130 - distance) / 130;
          word.vx += (dx / distance) * force * 0.42;
          word.vy += (dy / distance) * force * 0.42;
        }
      }

      if (word.x < 8 || word.x + word.width > width - 8) {
        word.vx *= -0.86;
        word.x = Math.min(Math.max(word.x, 8), Math.max(width - word.width - 8, 8));
      }

      if (word.y < 8 || word.y + word.height > height - 8) {
        word.vy *= -0.86;
        word.y = Math.min(Math.max(word.y, 8), Math.max(height - word.height - 8, 8));
      }
    });

    for (let i = 0; i < words.length; i += 1) {
      for (let j = i + 1; j < words.length; j += 1) {
        const a = words[i];
        const b = words[j];
        const aCenterX = a.x + a.width / 2;
        const aCenterY = a.y + a.height / 2;
        const bCenterX = b.x + b.width / 2;
        const bCenterY = b.y + b.height / 2;
        const overlapX = (a.width + b.width) / 2 - Math.abs(aCenterX - bCenterX);
        const overlapY = (a.height + b.height) / 2 - Math.abs(aCenterY - bCenterY);

        if (overlapX > 0 && overlapY > 0) {
          const pushX = aCenterX < bCenterX ? -overlapX / 2 : overlapX / 2;
          const pushY = aCenterY < bCenterY ? -overlapY / 2 : overlapY / 2;

          if (!a.dragging) {
            a.x += pushX * 0.28;
            a.y += pushY * 0.28;
            a.vx += pushX * 0.012;
            a.vy += pushY * 0.012;
          }

          if (!b.dragging) {
            b.x -= pushX * 0.28;
            b.y -= pushY * 0.28;
            b.vx -= pushX * 0.012;
            b.vy -= pushY * 0.012;
          }
        }
      }
    }

    words.forEach((word) => {
      word.vx = Math.max(Math.min(word.vx * 0.982, 3.2), -3.2);
      word.vy = Math.max(Math.min(word.vy * 0.982, 3.2), -3.2);
      word.element.style.transform = `translate(${word.x}px, ${word.y}px)`;
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

initWordStage();

function initLightbox() {
  const zoomableImages = document.querySelectorAll(".zoomable");
  if (!zoomableImages.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Expanded image preview");

  const image = document.createElement("img");
  image.alt = "";
  lightbox.appendChild(image);
  document.body.appendChild(lightbox);

  function closeLightbox() {
    lightbox.classList.remove("open");
    image.src = "";
    image.alt = "";
  }

  zoomableImages.forEach((item) => {
    item.addEventListener("click", () => {
      image.src = item.src;
      image.alt = item.alt;
      lightbox.classList.add("open");
    });
  });

  lightbox.addEventListener("click", closeLightbox);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

initLightbox();

function initPersonaSelector() {
  const selectors = document.querySelectorAll(".persona-selector");
  if (!selectors.length) return;

  selectors.forEach((selector) => {
    const cards = [...selector.querySelectorAll(".persona-card")];

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((item) => item.classList.remove("active"));
        card.classList.add("active");
      });
    });
  });
}

initPersonaSelector();

function initMarketLensDiagram() {
  const diagram = document.querySelector("[data-lens-diagram]");
  const output = document.querySelector("[data-lens-output]");
  if (!diagram || !output) return;

  const copy = {
    curated: {
      title: "Curated Experience",
      body:
        "Each activity was curated through material, technique, symbol, ritual and meaning, turning heritage into something visitors could touch, practice, interpret and remember.",
    },
    material: {
      title: "Material",
      body:
        "Material refers to the physical substances that carry cultural memory, such as paper, bamboo, fabric, clay, ink, thread and light. In the market, materials became the first point of contact between visitors and heritage.",
    },
    technique: {
      title: "Technique",
      body:
        "Technique focuses on the making processes behind each cultural practice. Weaving, printing, painting, folding and assembling allowed visitors to understand heritage through action.",
    },
    symbol: {
      title: "Symbol",
      body:
        "Symbol refers to the visual language embedded in Spring Festival culture, including fish, flowers, knots, guardian figures, blessings and festive colours.",
    },
    ritual: {
      title: "Ritual",
      body:
        "Ritual captures repeated gestures and social moments within the event: entering, making, exchanging, gifting, watching and gathering.",
    },
    meaning: {
      title: "Meaning",
      body:
        "Meaning refers to the stories, emotions and values carried by each practice, from protection and blessing to memory, belonging and renewal.",
    },
  };

  const circles = [...diagram.querySelectorAll("[data-lens]")];

  function showLens(key) {
    const item = copy[key] || copy.curated;
    output.innerHTML = `<strong>${item.title}</strong><span>${item.body}</span>`;
    circles.forEach((circle) => circle.classList.toggle("active", circle.dataset.lens === key));
  }

  circles.forEach((circle) => {
    circle.addEventListener("mouseenter", () => showLens(circle.dataset.lens));
    circle.addEventListener("focus", () => showLens(circle.dataset.lens));
    circle.addEventListener("click", () => showLens(circle.dataset.lens));
  });
}

initMarketLensDiagram();

function initDeityGallery() {
  const gallery = document.querySelector("[data-deity-gallery]");
  const output = document.querySelector("[data-deity-output]");
  if (!gallery || !output) return;

  const copy = {
    dionysus: {
      title: "Dionysus / 酒神",
      body: "A blessing for celebration, pleasure and festive gathering.",
    },
    apollo: {
      title: "Apollo / 阿波罗",
      body: "A blessing for inspiration, clarity and creative breakthroughs.",
    },
    cupid: {
      title: "Cupid / 丘比特",
      body: "A blessing for love, happiness and emotional connection.",
    },
    yanggun: {
      title: "Yang Gun / 杨衮",
      body: "A blessing for confidence, strength and getting things done.",
    },
    zhaokuangyin: {
      title: "Zhao Kuangyin / 赵匡胤",
      body: "A blessing for ambition, recognition and achievement.",
    },
    qinqiong: {
      title: "Qin Qiong / 秦琼",
      body: "A blessing for protection, persistence and safe passage.",
    },
    caishen: {
      title: "Caishen / 财神",
      body: "A blessing for prosperity, luck and abundance.",
    },
  };

  const buttons = [...gallery.querySelectorAll("[data-deity]")];

  function showDeity(key) {
    const item = copy[key];
    if (!item) return;
    output.innerHTML = `<strong>${item.title}</strong><span>${item.body}</span>`;
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.deity === key));
  }

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => showDeity(button.dataset.deity));
    button.addEventListener("focus", () => showDeity(button.dataset.deity));
    button.addEventListener("click", () => showDeity(button.dataset.deity));
  });
}

initDeityGallery();

function initProgrammeTabs() {
  const tabs = document.querySelector("[data-programme-tabs]");
  const panels = document.querySelector("[data-programme-panels]");
  if (!tabs || !panels) return;

  const buttons = [...tabs.querySelectorAll("[data-programme-tab]")];
  const articles = [...panels.querySelectorAll("[data-programme-panel]")];
  let currentButton = null;

  function updateArrow(button) {
    const tabRect = tabs.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const center = buttonRect.left - tabRect.left + buttonRect.width / 2;
    const percent = (center / Math.max(tabRect.width, 1)) * 100;
    panels.style.setProperty("--programme-arrow-left", `${percent}%`);
  }

  function showPanel(key, button) {
    currentButton = button;
    buttons.forEach((item) => item.classList.toggle("active", item === button));
    articles.forEach((article) => article.classList.toggle("active", article.dataset.programmePanel === key));
    updateArrow(button);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.programmeTab, button));
  });

  const activeButton = buttons.find((button) => button.classList.contains("active")) || buttons[0];
  if (activeButton) {
    requestAnimationFrame(() => showPanel(activeButton.dataset.programmeTab, activeButton));
    window.addEventListener("resize", () => {
      if (currentButton) updateArrow(currentButton);
    });
  }
}

initProgrammeTabs();

function initHomeCursor() {
  const cursor = document.querySelector("[data-cursor-dot]");
  if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cursorX = x;
  let cursorY = y;

  window.addEventListener("pointermove", (event) => {
    x = event.clientX;
    y = event.clientY;
    cursor.classList.add("active");
  });

  document.querySelectorAll("a, button, [tabindex]").forEach((item) => {
    item.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
  });

  function tick() {
    cursorX += (x - cursorX) * 0.22;
    cursorY += (y - cursorY) * 0.22;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }

  tick();
}

initHomeCursor();

function initHomeContours() {
  const canvas = document.querySelector("[data-contour-canvas]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const pointer = { x: 0.72, y: 0.35 };
  let time = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function draw() {
    time += 0.008;
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    context.strokeStyle = "rgba(122, 113, 100, 0.25)";

    const rows = 34;
    const gap = height / rows;
    const influenceX = pointer.x * width;
    const influenceY = pointer.y * height;

    for (let i = -2; i < rows + 4; i += 1) {
      const baseY = i * gap;
      context.beginPath();

      for (let x = -80; x <= width + 80; x += 18) {
        const distance = Math.hypot(x - influenceX, baseY - influenceY);
        const pull = Math.max(0, 1 - distance / 420);
        const wave =
          Math.sin(x * 0.006 + i * 0.35 + time) * 10 +
          Math.sin(x * 0.012 - time * 1.8) * 5 +
          pull * Math.sin((x - influenceX) * 0.018) * 42;
        const y = baseY + wave + pull * (baseY < influenceY ? -18 : 18);

        if (x === -80) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.stroke();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    pointer.y = (event.clientY - rect.top) / Math.max(rect.height, 1);
  });

  window.addEventListener("resize", resize);
  resize();
  draw();
}

if (document.querySelector("[data-contour-canvas]")) {
  initHomeContours();
}

function initParticleNameHero() {
  const canvas = document.querySelector("[data-particle-name]");
  const zone = document.querySelector("[data-particle-zone]");
  if (!canvas || !zone) return;

  const context = canvas.getContext("2d");
  const offscreen = document.createElement("canvas");
  const offscreenContext = offscreen.getContext("2d");
  const pointer = { x: -9999, y: -9999, active: false, overTitle: false };
  const particles = [];
  const stars = Array.from({ length: 34 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.028 + Math.random() * 0.052,
    size: index % 6 === 0 ? 2.4 : 1 + Math.random() * 1.1,
    phase: Math.random() * Math.PI * 2,
  }));
  const glints = Array.from({ length: 7 }, () => ({
    x: 0.18 + Math.random() * 0.7,
    y: 0.12 + Math.random() * 0.68,
    phase: Math.random() * Math.PI * 2,
  }));
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let titleRect = zone.getBoundingClientRect();
  let lastBuildWidth = 0;
  let time = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    titleRect = zone.getBoundingClientRect();

    if (Math.abs(lastBuildWidth - width) > 20) {
      buildParticles();
      lastBuildWidth = width;
    }
  }

  function buildParticles() {
    particles.length = 0;
    titleRect = zone.getBoundingClientRect();
    const heroRect = canvas.getBoundingClientRect();
    const localLeft = titleRect.left - heroRect.left;
    const localTop = titleRect.top - heroRect.top;
    const fontSize = Math.min(Math.max(width * 0.155, 92), 236);
    const lineHeight = fontSize * 0.88;
    const sampleGap = width < 700 ? 3 : 2;
    const textWidth = Math.min(width - localLeft * 1.1, 920);
    const textHeight = lineHeight * 2.1;

    offscreen.width = Math.ceil(textWidth);
    offscreen.height = Math.ceil(textHeight);
    offscreenContext.clearRect(0, 0, offscreen.width, offscreen.height);
    offscreenContext.fillStyle = "#ffffff";
    offscreenContext.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
    offscreenContext.letterSpacing = "0px";
    offscreenContext.textBaseline = "top";
    offscreenContext.fillText("Yiming", 0, 0);
    offscreenContext.fillText("Guo", 0, lineHeight);

    const image = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height).data;

    for (let y = 0; y < offscreen.height; y += sampleGap) {
      for (let x = 0; x < offscreen.width; x += sampleGap) {
        const alpha = image[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 96) {
          particles.push({
            x: localLeft + x + (Math.random() - 0.5) * 120,
            y: localTop + y + (Math.random() - 0.5) * 120,
            tx: localLeft + x,
            ty: localTop + y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.1 + 0.65,
            twinkle: Math.random() * Math.PI * 2,
          });
        }
      }
    }
  }

  function drawHeroOrbits() {
    const cx = width * 0.68 + Math.sin(time * 0.18) * 12;
    const cy = height * 0.5 + Math.cos(time * 0.14) * 10;
    const orbitScale = Math.min(width, height);
    const orbits = [
      { rx: orbitScale * 0.34, ry: orbitScale * 0.13, rotate: -0.22, alpha: 0.11 },
      { rx: orbitScale * 0.24, ry: orbitScale * 0.34, rotate: 0.16, alpha: 0.085 },
      { rx: orbitScale * 0.44, ry: orbitScale * 0.2, rotate: 0.08, alpha: 0.065 },
    ];

    context.save();
    orbits.forEach((orbit, index) => {
      context.beginPath();
      context.strokeStyle = `rgba(216, 208, 193, ${orbit.alpha})`;
      context.lineWidth = index === 0 ? 1.15 : 0.9;
      context.ellipse(cx, cy, orbit.rx, orbit.ry, orbit.rotate + Math.sin(time * 0.08 + index) * 0.035, 0, Math.PI * 2);
      context.stroke();
    });
    context.restore();
  }

  function drawHeroStars() {
    stars.forEach((star, index) => {
      const driftX = Math.sin(time * star.speed + star.phase) * 26;
      const driftY = Math.cos(time * star.speed * 0.8 + star.phase) * 18;
      const x = star.x * width + driftX;
      const y = star.y * height + driftY;
      const opacity = 0.34 + Math.sin(time * 1.1 + star.phase) * 0.18;
      context.beginPath();
      context.fillStyle = index % 4 === 0 ? `rgba(255, 206, 227, ${opacity})` : `rgba(248, 246, 242, ${opacity})`;
      context.arc(x, y, star.size, 0, Math.PI * 2);
      context.fill();

      if (index % 5 === 0) {
        context.strokeStyle = `rgba(248, 246, 242, ${opacity * 0.55})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x - 8, y);
        context.lineTo(x + 8, y);
        context.moveTo(x, y - 8);
        context.lineTo(x, y + 8);
        context.stroke();
      }
    });

    glints.forEach((glint) => {
      const pulse = Math.max(0, Math.sin(time * 0.8 + glint.phase));
      const x = glint.x * width;
      const y = glint.y * height;
      context.strokeStyle = `rgba(255, 206, 227, ${pulse * 0.54})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x - 22 * pulse, y);
      context.lineTo(x + 22 * pulse, y);
      context.moveTo(x, y - 22 * pulse);
      context.lineTo(x, y + 22 * pulse);
      context.stroke();
    });
  }

  function animate() {
    time += 0.01;
    context.clearRect(0, 0, width, height);
    drawHeroOrbits();
    drawHeroStars();

    particles.forEach((particle) => {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const scatterRadius = pointer.overTitle ? 52 : 0;

      if (distance < scatterRadius) {
        const force = (1 - distance / scatterRadius) * 0.42;
        particle.vx += (dx / distance) * force;
        particle.vy += (dy / distance) * force;
      }

      particle.vx += (particle.tx - particle.x) * 0.012;
      particle.vy += (particle.ty - particle.y) * 0.012;
      particle.vx *= 0.9;
      particle.vy *= 0.9;
      particle.x += particle.vx;
      particle.y += particle.vy;

      const shimmer = 0.56 + Math.sin(time * 1.8 + particle.twinkle) * 0.26;
      context.beginPath();
      context.fillStyle = `rgba(248, 251, 255, ${shimmer})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(animate);
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
    titleRect = zone.getBoundingClientRect();
    pointer.overTitle =
      event.clientX >= titleRect.left &&
      event.clientX <= titleRect.right &&
      event.clientY >= titleRect.top &&
      event.clientY <= titleRect.bottom;
  }

  window.addEventListener("pointermove", updatePointer);
  window.addEventListener("pointerleave", () => {
    pointer.overTitle = false;
    pointer.x = -9999;
    pointer.y = -9999;
  });
  window.addEventListener("resize", resize);
  resize();
  animate();
}

initParticleNameHero();

function initSopOrbit() {
  const orbit = document.querySelector("[data-sop-orbit]");
  if (!orbit) return;

  orbit.addEventListener("pointermove", (event) => {
    const rect = orbit.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    orbit.style.setProperty("--sop-x", `${x}px`);
    orbit.style.setProperty("--sop-y", `${y}px`);
  });
}

initSopOrbit();

function initApproachSteps() {
  const buttons = [...document.querySelectorAll("[data-approach-step]")];
  const output = document.querySelector("[data-approach-copy]");
  if (!buttons.length || !output) return;

  const steps = {
    define: {
      phase: "Define",
      task: "Find the “why” behind the need",
      value: "Avoid designing busywork.",
    },
    explore: {
      phase: "Explore",
      task: "Move from loose inspiration to structured directions",
      value: "Build multiple possibilities.",
    },
    focus: {
      phase: "Focus",
      task: "Select and test the strongest route",
      value: "Make the design actionable.",
    },
    present: {
      phase: "Present",
      task: "Refine details and standardise delivery",
      value: "Raise the quality of the handoff.",
    },
  };

  function showStep(key) {
    const step = steps[key] || steps.define;
    buttons.forEach((button) => {
      const isActive = button.dataset.approachStep === key;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    output.innerHTML = `<span>${step.phase}</span><strong>${step.task}</strong><p>${step.value}</p>`;
  }

  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => showStep(button.dataset.approachStep));
    button.addEventListener("mouseenter", () => showStep(button.dataset.approachStep));
    button.addEventListener("focus", () => showStep(button.dataset.approachStep));
  });
}

initApproachSteps();
