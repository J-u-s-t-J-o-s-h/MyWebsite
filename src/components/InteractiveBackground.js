import React, { useEffect, useRef, useMemo } from 'react';
import * as PIXI from 'pixi.js';

const InteractiveBackground = () => {
  const containerRef = useRef(null);
  const pixiApp = useRef(null);
  const elements = useRef([]);
  const mousePos = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
  const animationFrameId = useRef(null);
  
  const settings = useMemo(() => ({
    framePadding: -20,
    framePaddingTarget: 40,
    parallaxCoeff: 3,
    globalScale: 1,
    brightness: 1.5,
    repulsion: .95,
    noise: .0,
    sizeL: 1200,
    sizeM: 960,
    sizeS: 720,
    sizeXS: 480
  }), []);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize PIXI Application
    pixiApp.current = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: true,
      resolution: 1,
      backgroundColor: 0x1a1a1a,
      autoStart: false
    });

    containerRef.current.appendChild(pixiApp.current.view);

    // Create a basic animation while loading
    const tempGraphics = new PIXI.Graphics();
    tempGraphics.beginFill(0x2a2a2a);
    tempGraphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
    tempGraphics.endFill();
    pixiApp.current.stage.addChild(tempGraphics);

    // Add some particles while loading
    const particles = new PIXI.Container();
    for (let i = 0; i < 100; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(0x3498db);
      particle.drawCircle(0, 0, 2);
      particle.endFill();
      particle.x = Math.random() * window.innerWidth;
      particle.y = Math.random() * window.innerHeight;
      particle.vx = (Math.random() - 0.5) * 2;
      particle.vy = (Math.random() - 0.5) * 2;
      particles.addChild(particle);
    }
    pixiApp.current.stage.addChild(particles);

    // Animation function
    const animate = () => {
      if (!pixiApp.current) return;

      // Update particles
      for (let i = 0; i < particles.children.length; i++) {
        const particle = particles.children[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
      }

      // Render the stage
      pixiApp.current.renderer.render(pixiApp.current.stage);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Event listeners
    const handleResize = () => {
      if (!pixiApp.current) return;
      pixiApp.current.renderer.resize(window.innerWidth, window.innerHeight);
      tempGraphics.width = window.innerWidth;
      tempGraphics.height = window.innerHeight;
      repositionAll();
    };

    const handleMouseMove = (event) => {
      const tx = -1 + (event.clientX / window.innerWidth) * 2;
      const ty = 1 - (event.clientY / window.innerHeight) * 2;
      mousePos.current = { x: tx, y: ty };
      settingsRef.current.globalScale = .8 + (event.clientX / window.innerWidth) * .4;
      settingsRef.current.repulsion = .95 + (event.clientX / window.innerWidth) * .05;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (pixiApp.current) {
        pixiApp.current.destroy(true, { children: true, texture: true, baseTexture: true });
        pixiApp.current = null;
      }
    };
  }, []);

  const repositionAll = (speed) => {
    elements.current.forEach(el => {
      if (el && typeof el.updatePosition === 'function') {
        el.updatePosition(speed);
      }
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0"
      style={{ 
        background: 'linear-gradient(to bottom right, #1a1a2e, #16213e, #1a1a2e)',
      }}
    />
  );
};

export default InteractiveBackground;