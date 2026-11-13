/* ==========================================================================
   2. 极轻量级 Canvas 粒子背景模块 (js/particles.js)
   飘落《孤独摇滚》波奇方块发饰与《紫罗兰永恒花园》花瓣星尘 + 祖母绿宝石光尘渐散
   ========================================================================== */
class AnimeParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.bursts = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    const count = window.innerWidth < 768 ? 20 : 34;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const colors = ["#ff6b9d", "#ffd166", "#38bdf8", "#c4b5fd", "#e2be6b", "#2ec4b6"];
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 4.5 + 2.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: Math.random() * 0.42 + 0.15,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.015,
      isCube: Math.random() > 0.58,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.48 + 0.18
    };
  }

  triggerBurst(x, y, color = "#ff6b9d") {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.25;
      const speed = Math.random() * 3.6 + 1.2;
      this.bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2.2,
        color,
        alpha: 0.95,
        decay: 0.014
      });
    }
  }

  /* 薇尔莉特祖母绿宝石专属柔和星尘羽化渐出粒子 */
  triggerBroochMist(x, y) {
    const broochColors = ["#56f0d8", "#2ec4b6", "#f4d58d", "#ff6b9d", "#ffffff"];
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.2 + 0.4;
      this.bursts.push({
        x: x + (Math.random() - 0.5) * 36,
        y: y + (Math.random() - 0.5) * 44,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.45,
        size: Math.random() * 3.8 + 1.5,
        color: broochColors[i % broochColors.length],
        alpha: 0.9,
        decay: Math.random() * 0.008 + 0.007
      });
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.vAngle;

      if (p.y > this.height + 16) { p.y = -12; p.x = Math.random() * this.width; }
      if (p.x > this.width + 16) p.x = -12;
      if (p.x < -16) p.x = this.width + 12;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;

      if (p.isCube) {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.985;
      b.vy *= 0.985;
      b.alpha -= b.decay;
      if (b.alpha <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.globalAlpha = b.alpha;
      this.ctx.shadowColor = b.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fillStyle = b.color;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}
window.AnimeParticleEngine = AnimeParticleEngine;
