import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const DistortionSlider = ({ images, currentIndex }) => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const materialsRef = useRef([]);
  const currentImageRef = useRef(0);
  const animationFrameId = useRef(null);
  const isActive = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

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

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    // Create materials and meshes for each image
    const loadTextures = async () => {
      try {
        const textureLoader = new THREE.TextureLoader();
        const loadedMaterials = await Promise.all(
          images.map(async (imageUrl, index) => {
            const texture = await new Promise((resolve, reject) => {
              textureLoader.load(
                imageUrl,
                resolve,
                undefined,
                reject
              );
            });
            
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;

            const material = new THREE.ShaderMaterial({
              uniforms: {
                uTexture: { value: texture },
                uHoverState: { value: 0 },
                uAlpha: { value: index === currentImageRef.current ? 1 : 0 },
                uOffset: { value: new THREE.Vector2(0.0, 0.0) }
              },
              vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                uniform float uHoverState;
                
                void main() {
                  vUv = uv;
                  vPosition = position;
                  vec3 pos = position;
                  pos.z += uHoverState * 10.0;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
              `,
              fragmentShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                uniform sampler2D uTexture;
                uniform float uHoverState;
                uniform float uAlpha;
                uniform vec2 uOffset;
                
                void main() {
                  vec2 uv = vUv;
                  
                  vec2 distortedPosition = vec2(
                    uv.x + sin(uv.y * 10.0 + uHoverState) * 0.1,
                    uv.y + sin(uv.x * 10.0 + uHoverState) * 0.1
                  );
                  
                  vec4 texture1 = texture2D(uTexture, distortedPosition);
                  vec4 texture2 = texture2D(uTexture, distortedPosition + uOffset);
                  vec4 texture3 = texture2D(uTexture, distortedPosition - uOffset);

                  gl_FragColor = vec4(
                    texture1.r,
                    texture2.g,
                    texture3.b,
                    uAlpha
                  );
                }
              `,
              transparent: true
            });

            return material;
          })
        );

        materialsRef.current = loadedMaterials;
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading textures:', error);
      }
    };

    loadTextures();

    // Animation
    const animate = () => {
      if (!isActive.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      materialsRef.current.forEach(material => {
        if (material && material.uniforms && material.uniforms.uHoverState) {
          material.uniforms.uHoverState.value *= 0.95;
        }
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      isActive.current = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
      materialsRef.current = [];
      if (sceneRef.current) {
        while(sceneRef.current.children.length > 0) { 
          sceneRef.current.remove(sceneRef.current.children[0]);
        }
      }
    };
  }, [images]);

  // Handle hover
  useEffect(() => {
    if (!isLoaded) return;
    
    const container = containerRef.current;
    const handleMouseMove = (event) => {
      if (!materialsRef.current || materialsRef.current.length === 0) return;

      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height;

      materialsRef.current.forEach(material => {
        if (material && material.uniforms && material.uniforms.uOffset) {
          gsap.to(material.uniforms.uOffset.value, {
            x: (x - 0.5) * 0.01,
            y: (y - 0.5) * 0.01,
            duration: 0.5
          });
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isLoaded]);

  // Handle image transitions
  useEffect(() => {
    if (!isLoaded || currentIndex === currentImageRef.current) return;
    if (!materialsRef.current || !materialsRef.current[currentImageRef.current] || !materialsRef.current[currentIndex]) return;

    const currentMaterial = materialsRef.current[currentImageRef.current];
    const nextMaterial = materialsRef.current[currentIndex];

    if (currentMaterial.uniforms && nextMaterial.uniforms) {
      gsap.timeline()
        .to(currentMaterial.uniforms.uHoverState, {
          value: 1,
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(currentMaterial.uniforms.uAlpha, {
          value: 0,
          duration: 1
        }, 0)
        .to(nextMaterial.uniforms.uAlpha, {
          value: 1,
          duration: 1
        }, 0)
        .to(nextMaterial.uniforms.uHoverState, {
          value: 1,
          duration: 1,
          ease: 'power2.inOut'
        }, 0);

      currentImageRef.current = currentIndex;
    }
  }, [currentIndex, isLoaded]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default DistortionSlider;