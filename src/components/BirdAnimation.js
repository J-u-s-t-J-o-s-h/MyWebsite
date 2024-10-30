import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BirdAnimation = () => {
  const containerRef = useRef();
  
  useEffect(() => {
    let scene, camera, renderer;
    let hemisphereLight, shadowLight;
    let bird, sky;
    let mousePos = { x: 0, y: 0 };

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.z = 2000;
      camera.position.y = 300;

      renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      containerRef.current.appendChild(renderer.domElement);

      // Lights
      hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
      shadowLight = new THREE.DirectionalLight(0xffffff, .9);
      shadowLight.position.set(150, 350, 350);
      shadowLight.castShadow = true;
      scene.add(hemisphereLight);
      scene.add(shadowLight);

      // Bird
      bird = new Bird();
      scene.add(bird.mesh);

      // Sky
      sky = new Sky();
      scene.add(sky.mesh);

      document.addEventListener('mousemove', handleMouseMove, false);
      animate();
    }

    class Bird {
      constructor() {
        this.mesh = new THREE.Object3D();
        
        // Body
        const bodyGeom = new THREE.BoxGeometry(40, 40, 40);
        const bodyMat = new THREE.MeshPhongMaterial({
          color: 0xff3434,
          flatShading: true
        });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.castShadow = true;
        this.mesh.add(body);

        // Wings
        const wingGeom = new THREE.BoxGeometry(30, 5, 120);
        const wingMat = new THREE.MeshPhongMaterial({
          color: 0xff9999,
          flatShading: true
        });
        this.wingL = new THREE.Mesh(wingGeom, wingMat);
        this.wingR = this.wingL.clone();
        this.wingL.position.x = 20;
        this.wingR.position.x = -20;
        this.mesh.add(this.wingL);
        this.mesh.add(this.wingR);
      }

      fly() {
        this.wingL.rotation.z = Math.sin(Date.now() * 0.005) * Math.PI / 4;
        this.wingR.rotation.z = -this.wingL.rotation.z;
      }
    }

    class Sky {
      constructor() {
        this.mesh = new THREE.Object3D();
        this.nClouds = 20;
        this.clouds = [];
        const stepAngle = Math.PI * 2 / this.nClouds;
        
        for(let i = 0; i < this.nClouds; i++) {
          const c = new Cloud();
          const a = stepAngle * i;
          const h = 750 + Math.random() * 200;
          c.mesh.position.y = Math.sin(a) * h;
          c.mesh.position.x = Math.cos(a) * h;
          c.mesh.rotation.z = a + Math.PI/2;
          c.mesh.position.z = -400-Math.random()*400;
          this.mesh.add(c.mesh);
          this.clouds.push(c);
        }
      }
    }

    class Cloud {
      constructor() {
        this.mesh = new THREE.Object3D();
        const geom = new THREE.BoxGeometry(20,20,20);
        const mat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
        });
        
        const nBlocs = 3+Math.floor(Math.random()*3);
        for(let i=0; i<nBlocs; i++) {
          const m = new THREE.Mesh(geom.clone(), mat);
          m.position.x = i*15;
          m.position.y = Math.random()*10;
          m.position.z = Math.random()*10;
          m.rotation.z = Math.random()*Math.PI*2;
          m.rotation.y = Math.random()*Math.PI*2;
          const s = .1 + Math.random()*.9;
          m.scale.set(s,s,s);
          m.castShadow = true;
          m.receiveShadow = true;
          this.mesh.add(m);
        }
      }
    }

    function handleMouseMove(event) {
      const tx = -1 + (event.clientX / window.innerWidth) * 2;
      const ty = 1 - (event.clientY / window.innerHeight) * 2;
      mousePos = { x: tx, y: ty };
    }

    function animate() {
      if (bird && bird.mesh) {
        bird.fly();
        bird.mesh.position.y = 100 + Math.sin(Date.now() * 0.002) * 30;
        bird.mesh.rotation.y = Math.PI/2 + (mousePos.x * Math.PI/8);
        bird.mesh.rotation.z = (mousePos.y * Math.PI/8);
      }

      if (sky && sky.mesh) {
        sky.mesh.rotation.z += 0.001;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    init();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0"
      style={{ 
        background: 'linear-gradient(to bottom, #6fb1fc, #4faefe)',
      }}
    />
  );
};

export default BirdAnimation; 