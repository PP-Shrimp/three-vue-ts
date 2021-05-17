<template>
  <div class="about">
    <div id="container"></div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default class HelloWorld extends Vue {
  camera: any;
  scene: any;
  spotLight: any;
  renderer: any;
  earthX = 100;
  earthY = 100;
  angle = 0;
  mesh: any;
  controls: any;
  sphereMesh: any;
  boxMesh: any;
  earthImg = require("@/assets/images/1.jpg");
  moonImg = require("@/assets/images/moon.jpg");
  sunImg = require("@/assets/images/sun.jpg");
  moonMesh: any;
  moonLocation = { x: 0, y: 0 };
  centerX = 0;
  centerY = 0;
  pointLight: any;
  sunMesh: any;
  angleEarth = 0;
  mounted() {
    const container = this.init();

    // 生成太阳
    this.generateSun();

    // 生成光源
    this.initPointLight();

    // 坐标系
    this.addAxis();

    // 添加地球
    this.generateSphere();

    // 添加月球
    this.generateMoon();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    //   @ts-ignore
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMapEnabled = true;
    container?.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(this.centerX, this.centerY, 0);
    this.animation();
  }
  // 生成基本场景,照相机
  init() {
    const container = document.getElementById("container");
    this.camera = new THREE.PerspectiveCamera(
      45,
      //   @ts-ignore
      container.clientWidth / container.clientHeight,
      1,
      100000
    );
    this.camera.position.x = 300;
    this.camera.position.y = 300;
    this.camera.position.z = 500;
    this.camera.up.x = 0;
    this.camera.up.y = 1;
    this.camera.up.z = 0;

    this.camera.lookAt(this.earthX, this.earthY, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#000000");
    return container;
  }

  // 生成太阳
  generateSun() {
    const texturePainting = new THREE.TextureLoader().load(this.sunImg);
    const materialPainting = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texturePainting,
    });

    const sunGeo = new THREE.SphereGeometry(20, 32, 32);
    const sun = new THREE.Mesh(sunGeo, materialPainting);
    this.sunMesh = sun;
    this.scene.add(sun);
  }

  // 生成地球
  generateSphere() {
    const texturePainting = new THREE.TextureLoader().load(this.earthImg);
    const materialPainting = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: texturePainting,
    });

    const earthGeo = new THREE.SphereGeometry(10, 32, 32);
    const earth = new THREE.Mesh(earthGeo, materialPainting);
    earth.up.x = 0;
    earth.up.y = 0;
    earth.up.z = 1;
    this.sphereMesh = earth;
    // earth.castShadow = true; //开启投影
    // earth.receiveShadow = true; //接收阴影
    this.scene.add(earth);
  }

  // 生成月球
  generateMoon() {
    const texturePainting = new THREE.TextureLoader().load(this.moonImg);
    const materialPainting = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: texturePainting,
    });

    const moonGeo = new THREE.SphereGeometry(3, 32, 32);
    const moon = new THREE.Mesh(moonGeo, materialPainting);
    moon.up.x = 0;
    moon.up.y = 0;
    moon.up.z = 1;
    this.moonMesh = moon;
    moon.castShadow = true; //开启投影
    moon.receiveShadow = true; //接收阴影
    this.scene.add(moon);
  }

  // 生成立方体
  generateBox() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshNormalMaterial({ lights: true });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.boxMesh = cube;
  }

  // 添加坐标系
  addAxis() {
    const axisHelper = new THREE.AxesHelper(15500);
    this.scene.add(axisHelper);
  }

  // 动画
  animation() {
    requestAnimationFrame(this.animation.bind(this));
    // 时间戳
    const time = +new Date();

    // 视角转动
    this.angle += 0.016;
    this.angleEarth += 0.006;
    // this.camera.position.x = 20 * Math.sin(this.angle) + this.earthX;
    // this.camera.position.z = 20 * Math.cos(this.angle) + this.earthY;

    // 地球自转
    this.sphereMesh.rotation.y = time / 1000;
    // 地球公转
    this.earthX = 100 * Math.sin(this.angleEarth);
    this.earthY = 100 * Math.cos(this.angleEarth);
    this.sphereMesh.position.x = this.earthX;
    this.sphereMesh.position.z = this.earthY;

    // 月球自转
    this.moonMesh.rotation.y = time / 500;
    this.moonMesh.position.x = 20 * Math.sin(this.angle) + this.earthX;
    this.moonMesh.position.z = 20 * Math.cos(this.angle) + this.earthY;

    // 照相机看向位置
    this.camera.lookAt(this.centerX, this.centerY, 0);
    this.renderer.render(this.scene, this.camera);
  }

  // 生成点光源
  initPointLight() {

    const sphere = new THREE.SphereBufferGeometry(20, 16, 8);

        this.pointLight = new THREE.PointLight(0xffffff, 5, 200);
        this.pointLight.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color : 0xFDF5E6})));

    // this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
    this.pointLight.position.set(0, 0, 0);
    this.pointLight.castShadow = true;
    this.scene.add(this.pointLight);

    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(
    //   this.pointLight,
    //   sphereSize
    // );
    // this.scene.add(pointLightHelper);
    // console.log(pointLightHelper);
    

    // this.spotLight = new THREE.SpotLight(0xffffff);
    // this.spotLight.castShadow = true;
    // this.spotLight.up.x = 0;
    // this.spotLight.up.y = 0;
    // this.spotLight.up.z = 1;
    // this.spotLight.intensity = 2;
    // this.spotLight.angle = 1.05;
    // this.spotLight.penumbra = 0;
    // this.spotLight.decay = 1;
    // this.spotLight.position.set(0, 0, 100);
    // this.scene.add(this.spotLight);
  }
}
</script>
<style scoped>
#container {
  width: 800px;
  height: 600px;
  border: 1px solid #ccc;
}
</style>