import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const WebGLSlider = ({ slides }) => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const currentIndexRef = useRef(0);
  const materialsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const touchStartRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState(null);

  // Touch and swipe handlers
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current || isAnimatingRef.current) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0 && currentIndex < slides.length - 1) {
        setDragDirection('left');
      } else if (diff < 0 && currentIndex > 0) {
        setDragDirection('right');
      }
    }
  };

  const handleTouchEnd = () => {
    if (dragDirection === 'left') {
      goToSlide(currentIndex + 1);
    } else if (dragDirection === 'right') {
      goToSlide(currentIndex - 1);
    }
    touchStartRef.current = null;
    setDragDirection(null);
  };

  // Content animation variants
  const contentVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  useEffect(() => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D uMainTexture;
      uniform sampler2D uNextTexture;
      uniform float uProgress;
      uniform vec2 uMouse;

      void main() {
        vec2 uv = vUv;
        
        // Simple directional wipe effect
        float wipePosition = uProgress * (1.0 + 0.2);
        float wipeWidth = 0.2;
        float edge = smoothstep(wipePosition - wipeWidth, wipePosition, uv.x);
        
        vec4 currentTexture = texture2D(uMainTexture, uv);
        vec4 nextTexture = texture2D(uNextTexture, uv);
        
        // Clean transition with subtle fade
        gl_FragColor = mix(currentTexture, nextTexture, edge);
      }
    `;

    const mountedContainer = containerRef.current;
    const width = mountedContainer.offsetWidth;
    const height = mountedContainer.offsetHeight;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    );
    cameraRef.current.position.z = 1;

    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(width, height);
    mountedContainer.appendChild(rendererRef.current.domElement);

    // Load textures and create materials
    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.PlaneGeometry(width, height);

    slides.forEach((slide, index) => {
      const mainTexture = textureLoader.load(slide.image);
      mainTexture.minFilter = THREE.LinearFilter;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMainTexture: { value: mainTexture },
          uNextTexture: { value: null },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) }
        },
        vertexShader,
        fragmentShader,
        transparent: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = index === 0;
      sceneRef.current.add(mesh);
      materialsRef.current.push({ material, mesh });
    });

    // Add mouse movement handler
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - (e.clientY / window.innerHeight);
      
      materialsRef.current.forEach(({ material }) => {
        if (material.uniforms.uMouse) {
          material.uniforms.uMouse.value.set(x, y);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Store refs in variables that will be used in cleanup
    const materials = materialsRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const clock = new THREE.Clock();
    let animationFrameId;

    // Animation function
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      if (materials) {
        materials.forEach(({ material }) => {
          if (material?.uniforms?.uTime) {
            material.uniforms.uTime.value = elapsedTime;
          }
        });
      }

      if (renderer && scene && cameraRef.current) {
        renderer.render(scene, cameraRef.current);
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (mountedContainer && renderer?.domElement) {
        mountedContainer.removeChild(renderer.domElement);
      }

      // Clean up materials and meshes
      if (materials) {
        materials.forEach(({ mesh, material }) => {
          if (mesh) {
            mesh.geometry.dispose();
            material.dispose();
          }
        });
      }

      // Clean up scene
      if (scene) {
        while(scene.children.length > 0) { 
          scene.remove(scene.children[0]);
        }
      }

      // Clean up renderer
      if (renderer) {
        renderer.dispose();
      }

      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [slides]);

  const goToSlide = (index) => {
    if (isAnimatingRef.current || index === currentIndexRef.current) return;
    
    const currentMaterial = materialsRef.current[currentIndexRef.current].material;
    const nextMaterial = materialsRef.current[index].material;
    
    // Set up next texture
    currentMaterial.uniforms.uNextTexture.value = nextMaterial.uniforms.uMainTexture.value;

    // Animate transition
    gsap.to(currentMaterial.uniforms.uProgress, {
      value: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        currentMaterial.uniforms.uProgress.value = 0;
        currentIndexRef.current = index;
        setCurrentIndex(index);
        isAnimatingRef.current = false;
      }
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Slide Content */}
      <AnimatePresence initial={false} custom={dragDirection}>
        <motion.div
          key={currentIndex}
          custom={dragDirection}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-8"
            >
              {slides[currentIndex].icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
            >
              {slides[currentIndex].title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl md:text-2xl text-white/80"
            >
              {slides[currentIndex].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 pointer-events-none">
        {currentIndex > 0 && (
          <motion.button
            onClick={() => goToSlide(currentIndex - 1)}
            className="p-3 rounded-full bg-white/5 backdrop-blur-sm text-white pointer-events-auto border border-white/10 hover:bg-white/10 transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}
        {currentIndex < slides.length - 1 && (
          <motion.button
            onClick={() => goToSlide(currentIndex + 1)}
            className="p-3 rounded-full bg-white/5 backdrop-blur-sm text-white pointer-events-auto border border-white/10 hover:bg-white/10 transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default WebGLSlider; 