import { useCallback, useEffect, useRef } from "react";

export function useParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastAudioLevelRef = useRef<number>(0);

  const resetAnimation = useCallback(() => {
    const animationFrameId = animationRef.current;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  }, []);

  const init = useCallback(() => {
    if (!canvasRef.current) return;
    const audioLevel = 0;
    resetAnimation();
    createCircle(canvasRef.current, audioLevel);
    particlesRef.current = createParticles(canvasRef.current, audioLevel);
  }, [resetAnimation]);

  useEffect(() => {
    init();
    return resetAnimation;
  }, [init, resetAnimation]);

  const startAnimation = useCallback(
    (audioLevel: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      createCircle(canvas, audioLevel);

      if (Math.abs(audioLevel - lastAudioLevelRef.current) > 0.01) {
        particlesRef.current.forEach((p) => {
          p.updateAudioLevel(audioLevel);
        });
        lastAudioLevelRef.current = audioLevel;
      }

      const animate = () => {
        resetAnimation();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createCircle(canvas, audioLevel);

        particlesRef.current.forEach((p) => {
          p.update(canvas, audioLevel);
        });

        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    },
    [resetAnimation],
  );

  const reset = useCallback(() => {
    init();
  }, [init]);

  return { canvasRef, startAnimation, reset };
}

function createCircle(canvas: HTMLCanvasElement | null, audioLevel: number) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const maxRadius = Math.min(canvas.width, canvas.height) / 2;
  const minRadius = 80;
  const radius = minRadius + audioLevel * (maxRadius - minRadius);

  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  ctx.clip();

  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const gradientIntensity = 0.5 + audioLevel * 0.5;
  skyGradient.addColorStop(0, `rgba(135, 206, 235, ${gradientIntensity})`);
  skyGradient.addColorStop(1, `rgba(70, 130, 180, ${gradientIntensity})`);

  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function createParticles(
  canvas: HTMLCanvasElement,
  weight: number,
): Particle[] {
  const particleCount =
    PARTICLES_CONFIG.minParticles +
    Math.floor(
      Math.random() *
        (PARTICLES_CONFIG.maxParticles - PARTICLES_CONFIG.minParticles),
    );

  return Array.from(
    { length: particleCount },
    () => new Particle(canvas, weight),
  );
}

const PARTICLES_CONFIG = {
  maxParticles: 15,
  minParticles: 8,
  colors: [
    "white",
    "rgba(255,255,255,0.3)",
    "rgba(173,216,230, 0.8)",
    "rgba(211,211,211,0.8)",
  ],
  minSize: 5,
  maxSize: 20,
  baseSpeed: 0.1,
  speedMultiplier: 3,
  minInitialSpeed: 0.05,
  maxInitialSpeed: 0.2,
};

class Particle {
  x = 0;
  y = 0;
  targetX = 0;
  targetY = 0;
  directionX = 0;
  directionY = 0;
  size = 0;
  baseSize = 0;
  color = PARTICLES_CONFIG.colors[0];
  currentAudioLevel = 0;
  targetSpeedX = 0;
  targetSpeedY = 0;

  constructor(canvas: HTMLCanvasElement, weight: number) {
    this.initialize(canvas, weight);
    this.currentAudioLevel = weight;
  }

  initialize(canvas: HTMLCanvasElement, weight: number) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40;
    this.x = this.targetX = canvas.width / 2 + Math.cos(angle) * distance;
    this.y = this.targetY = canvas.height / 2 + Math.sin(angle) * distance;

    const initialSpeed =
      PARTICLES_CONFIG.minInitialSpeed +
      Math.random() *
        (PARTICLES_CONFIG.maxInitialSpeed - PARTICLES_CONFIG.minInitialSpeed);

    this.directionX = (Math.random() - 0.5) * initialSpeed;
    this.directionY = (Math.random() - 0.5) * initialSpeed;
    this.targetSpeedX = this.directionX;
    this.targetSpeedY = this.directionY;

    this.baseSize =
      Math.random() * (PARTICLES_CONFIG.maxSize - PARTICLES_CONFIG.minSize) +
      PARTICLES_CONFIG.minSize;
    this.size = this.baseSize * (0.5 + weight * 0.5);

    this.color =
      PARTICLES_CONFIG.colors[
        Math.floor(Math.random() * PARTICLES_CONFIG.colors.length)
      ];
    this.draw(canvas.getContext("2d"));
  }

  updateAudioLevel(audioLevel: number) {
    this.currentAudioLevel = audioLevel;
    const speed =
      PARTICLES_CONFIG.baseSpeed +
      audioLevel * PARTICLES_CONFIG.speedMultiplier;
    this.targetSpeedX = Math.sign(this.directionX) * speed;
    this.targetSpeedY = Math.sign(this.directionY) * speed;
    this.size = this.baseSize * (0.5 + audioLevel * 0.5);
  }

  draw(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(canvas: HTMLCanvasElement | null, audioLevel: number) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;
    const radius = Math.min(40 + audioLevel * 200, maxRadius);

    // Calculate distance from center
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxAllowedDistance = radius - this.size;

    if (distance >= maxAllowedDistance) {
      const angle = Math.atan2(dy, dx);
      this.x = centerX + Math.cos(angle) * maxAllowedDistance * 0.95;
      this.y = centerY + Math.sin(angle) * maxAllowedDistance * 0.95;

      const bounceIntensity = 0.5 + this.currentAudioLevel * 0.5;
      const normalX = dx / distance;
      const normalY = dy / distance;
      const dotProduct = this.directionX * normalX + this.directionY * normalY;

      this.directionX = this.directionX - 2 * dotProduct * normalX;
      this.directionY = this.directionY - 2 * dotProduct * normalY;

      this.directionX += (Math.random() - 0.5) * 0.2;
      this.directionY += (Math.random() - 0.5) * 0.2;

      this.directionX *= bounceIntensity;
      this.directionY *= bounceIntensity;
    }

    const smoothingFactor = 0.1;
    this.directionX += (this.targetSpeedX - this.directionX) * smoothingFactor;
    this.directionY += (this.targetSpeedY - this.directionY) * smoothingFactor;

    this.x += this.directionX;
    this.y += this.directionY;

    const finalDx = this.x - centerX;
    const finalDy = this.y - centerY;
    const finalDistance = Math.sqrt(finalDx * finalDx + finalDy * finalDy);
    if (finalDistance > maxAllowedDistance) {
      const angle = Math.atan2(finalDy, finalDx);
      this.x = centerX + Math.cos(angle) * maxAllowedDistance * 0.95;
      this.y = centerY + Math.sin(angle) * maxAllowedDistance * 0.95;
    }

    this.draw(ctx);
  }
}
