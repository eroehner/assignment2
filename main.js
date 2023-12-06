//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PARAMETERS
var gui;
const parameters = {
  Height: 75,
  PositionX: 25,
  PositionY: 25,
}

//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cubes
let sceneCubes = [];
let lastHeight = parameters.Height;
let lastPosX = parameters.PositionX;
let lastPosY = parameters.PositionY;

function main(){
  //GUI
  gui = new GUI;
  gui.add(parameters, 'Height', 0, 300, 1);
  gui.add(parameters, 'PositionX', 0, 49, 1);
  gui.add(parameters, 'PositionY', 0, 49, 1);

  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 15, width / height, 0.1, 5000);
  camera.position.set(300, 300, 300)

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  //GEOMETRY INITIATION
  // Initiate first cubes
  createCubes(50,50);


  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------
//GEOMETRY FUNCTIONS
// Create Cubes
function createCubes(x,y){

    const geometry = new THREE.BoxGeometry(0.8 , 0.8, 0.8);
    const material = new THREE.MeshPhysicalMaterial();
    material.color = new THREE.Color(Math.random() * 0xffffff);
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(x, parameters.Height/((Math.abs(x-parameters.PositionX))+Math.abs((y-parameters.PositionY))/2+3), y);
    cube.name = "cube " + x + y;
    sceneCubes.push(cube);

    scene.add(cube);
    

if (x>0){
  createCubes(x-1,y);
}
else if(y>0){
  createCubes(50,y-1)
}
}

//Remove 3D Objects and clean the caches
function removeObject(sceneObject){
  if (!(sceneObject instanceof THREE.Object3D)) return;

  //Remove the geometry to free GPU resources
  if(sceneObject.geometry) sceneObject.geometry.dispose();

  //Remove the material to free GPU resources
  if(sceneObject.material){
    if (sceneObject.material instanceof Array) {
      sceneObject.material.forEach(material => material.dispose());
    } else {
        sceneObject.material.dispose();
    }
  }

  //Remove object from scene
  sceneObject.removeFromParent();
}

//Remove the cubes
function removeCubes(){
  lastHeight = parameters.Height;
  lastPosX = parameters.PositionX;
  lastPosY = parameters.PositionY;


  sceneCubes.forEach(element =>{
    let scene_cube = scene.getObjectByName(element.name);
    removeObject(scene_cube);
  })

  sceneCubes = [];
}

//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}


//ANIMATE AND RENDER
function animate() {
	requestAnimationFrame( animate );
 
  control.update();

  if(lastHeight != parameters.Height || lastPosX != parameters.PositionX || lastPosY != parameters.PositionY){
    removeCubes();
    createCubes(50,50);

  }


 
	renderer.render( scene, camera );
}
//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();