/* ==========================================================================
   3. GitHub Optical Liquid Glass & Ethereal Brooch Fade-Out Controller (js/app.js)
   ========================================================================== */
(function () {
  const cfg = window.SITE_CONFIG;
  let particleEngine = null;

  /* 生成 GitHub deepika-builds/liquid-glass 同款光学边缘折射 Displacement Map */
  function buildOpticalLiquidGlassFilter() {
    try {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");

      ctx.fillStyle = "rgb(128, 128, 128)";
      ctx.fillRect(0, 0, size, size);

      const imgData = ctx.getImageData(0, 0, size, size);
      const d = imgData.data;
      const rMax = size / 2;
      const innerFlatRadius = rMax * 0.62;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - rMax;
          const dy = y - rMax;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const idx = (y * size + x) * 4;

          if (dist > innerFlatRadius && dist <= rMax) {
            const t = (dist - innerFlatRadius) / (rMax - innerFlatRadius);
            const curve = t * t * (3 - 2 * t);
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            d[idx] = Math.round(128 + nx * curve * 110);
            d[idx + 1] = Math.round(128 + ny * curve * 110);
            d[idx + 2] = 128;
            d[idx + 3] = 255;
          } else {
            d[idx] = 128;
            d[idx + 1] = 128;
            d[idx + 2] = 128;
            d[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      const dataUri = c.toDataURL("image/png");
      const feImg = document.getElementById("liquid-displacement-feimage");
      if (feImg) {
        feImg.setAttribute("href", dataUri);
        feImg.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", dataUri);
      }
    } catch (e) {}
  }

  /* 1. 渲染主标题、独立背景图与 7 个扁平光学液态玻璃圆形图标 */
  function renderHeroAndIcons() {
    if (cfg.backgrounds) {
      /* 自定义属性中的相对 url() 在不同浏览器中解析基准不一致（Chromium 按使用处
         的样式表解析），因此先转成绝对 URL 再注入，保证任何环境下路径都正确 */
      const toAbsUrl = (p) => new URL(p, document.baseURI).href;
      if (cfg.backgrounds.desktop) {
        document.documentElement.style.setProperty("--bg-desktop-url", `url("${toAbsUrl(cfg.backgrounds.desktop)}")`);
      }
      if (cfg.backgrounds.mobile) {
        document.documentElement.style.setProperty("--bg-mobile-url", `url("${toAbsUrl(cfg.backgrounds.mobile)}")`);
      }
    }
    const titleWrap = document.getElementById("hero-title-wrap");
    const titleEl = document.getElementById("hero-title");
    const subEl = document.getElementById("hero-subtitle");
    if (titleEl && cfg.hero?.title) titleEl.textContent = cfg.hero.title;
    if (subEl && cfg.hero?.subtitle) subEl.textContent = cfg.hero.subtitle;

    if (titleWrap) {
      titleWrap.addEventListener("mousemove", (e) => {
        const rect = titleWrap.getBoundingClientRect();
        titleWrap.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        titleWrap.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      });
    }

    const dock = document.getElementById("circle-contacts-dock");
    if (!dock) return;
    dock.innerHTML = cfg.contacts.map((item) => `
      <a href="${item.url}"
         target="_blank"
         rel="noopener noreferrer"
         class="liquid-circle-btn"
         style="--brand-color: ${item.brandColor}; --brand-glow: ${item.brandGlow};"
         aria-label="${item.name}"
         onclick="window.handleIconClick(event, '${item.id}')">
        ${item.svg}
        <span class="liquid-tooltip">${item.name} · ${item.handle}</span>
      </a>
    `).join("");

    document.querySelectorAll(".liquid-circle-btn").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    });
  }

  window.handleIconClick = function (e, id) {
    const item = cfg.contacts.find((c) => c.id === id);
    if (!item) return;
    if (particleEngine && e) {
      particleEngine.triggerBurst(e.clientX, e.clientY, item.brandColor);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(item.handle).catch(() => {});
    }
  };

  /* 2. 页面加载自动触发过渡动画：薇尔莉特祖母绿宝石柔焦羽化渐出（1.45s） */
  function runAutoIntro() {
    const gate = document.getElementById("intro-gate");
    const titleWrap = document.getElementById("hero-title-wrap");
    const subEl = document.getElementById("hero-subtitle");
    const buttons = document.querySelectorAll(".liquid-circle-btn");

    // 450ms：宝石光环苏醒 + 結束バンド四原色光带亮起
    setTimeout(() => {
      if (gate) gate.classList.add("slash-active");
    }, 450);

    // 950ms：帷幕拉开，同时薇尔莉特祖母绿宝石开始 1.45s 丝滑柔焦渐出 + 化作翡翠星尘缓缓飘散
    setTimeout(() => {
      if (gate) gate.classList.add("opening");
      if (particleEngine) {
        particleEngine.triggerBroochMist(window.innerWidth / 2, window.innerHeight / 2);
      }
      if (titleWrap) titleWrap.classList.add("entered");
      if (subEl) subEl.classList.add("entered");

      buttons.forEach((btn, idx) => {
        setTimeout(() => {
          btn.classList.add("entered");
        }, 240 + idx * 70);
      });
    }, 950);

    // 2550ms：等待宝石 1.45s 渐出动画彻底完成后再隐藏遮罩层
    setTimeout(() => {
      if (gate) gate.classList.add("closed");
    }, 2550);
  }

  window.addEventListener("DOMContentLoaded", () => {
    buildOpticalLiquidGlassFilter();
    particleEngine = new window.AnimeParticleEngine("particle-canvas");
    renderHeroAndIcons();
    runAutoIntro();
  });
})();
