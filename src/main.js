import './style.css'
import * as THREE from 'three'

// Scene, camera and renderer


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement)

//cube

const gridSize = 15;
const spacing = 0.4;

const nodeGeometry = new THREE.BufferGeometry();
const nodeMaterial = new THREE.PointsMaterial({ color: 0x000000, size: 0.1 });

const positions = []; // stores x, y and z positions for each node
const nodes = []; // stores node objects for reference (used by connect the lines)

for (let x = -gridSize / 2; x < gridSize / 2; x++) {
  for (let y = -gridSize / 2; y < gridSize / 2; y++) {
    for (let z = -gridSize / 2; z < gridSize / 2; z++) {

      const posX = x * spacing;
      const posY = y * spacing;
      const posZ = z * spacing;

      positions.push(posX, posY, posZ);

      nodes.push({ x: posX, y: posY, z: posZ });
    }
  }
}


// Assign the position data to BufferGeometry (nodeGeometry)

nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

// Create a points object and add it to the scene

const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
scene.add(nodePoints);

// create connections (lines)

const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];
const lineColors = [];

for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const dist = Math.hypot(
      nodes[i].x - nodes[j].x,
      nodes[i].y - nodes[j].y,
      nodes[i].z - nodes[j].z,
    );
    if (dist < spacing * 2.5 && Math.random() > 0.5) {
      linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
      lineColors.push('6ec4b3', 0, 0, 1, 1, 1);
    }
  }
}

lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3))

const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5 });
const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lineSegments);


function animate(){
  renderer.render(scene, camera);

  nodePoints.rotation.x +=0.02
  nodePoints.rotation.y +=0.02
  nodePoints.rotation.z +=0.02

  lineSegments.rotation.x +=0.02
  lineSegments.rotation.y +=0.02
  lineSegments.rotation.z +=0.02

  requestAnimationFrame(animate);
}

animate();