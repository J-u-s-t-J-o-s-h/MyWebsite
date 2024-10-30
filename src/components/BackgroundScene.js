import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BackgroundScene = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create gradient background
    const gradientGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
          vec3 color1 = vec3(0.1, 0.1, 0.2); // Dark blue
          vec3 color2 = vec3(0.2, 0.1, 0.3); // Purple
          vec3 color3 = vec3(0.1, 0.2, 0.3); // Teal
          
          float noise = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time) * 0.5 + 0.5;
          float pattern = sin(vUv.x * 8.0 + time * 0.5) * sin(vUv.y * 8.0 + time * 0.5);
          
          vec3 finalColor = mix(
            mix(color1, color2, noise),
            color3,
            pattern
          );
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true
    });

    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.z = -5;
    scene.add(gradientMesh);

    // Add floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000; // Reduced count for subtlety
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      // More subtle colors
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.3, 0.3); // Reduced saturation and lightness
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03, // Smaller particles
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.4 // More subtle
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Camera position
    camera.position.z = 5;

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update shader uniforms
      gradientMaterial.uniforms.time.value = elapsedTime * 0.2; // Slower animation

      // Animate particles
      particles.rotation.y = elapsedTime * 0.03; // Slower rotation
      particles.rotation.x = elapsedTime * 0.02;

      const positions = particles.geometry.attributes.position.array;
      for(let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.0005; // More subtle movement
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      gradientMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0"
      style={{ 
        background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
      }}
    />
  );
};

export default BackgroundScene;