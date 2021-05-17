<template>
  <div class="hello">
    <div id="container"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Options({
  props: {
    msg: String,
  },
})
export default class HelloWorld extends Vue {
  [x: string]: any;
  msg!: string;
  camera: any;
  scene: any;
  geometry: any;
  material: any;
  mesh: any;
  renderer: any;
  map = require("../assets/file/file_get.json");
  angle = 0;
  X: any = 0;
  Y: any = 0;
  Z: any = 0;
  centerY: any = 0;
  centerX: any = 0;
  spotLight: any;
  mounted() {
    const container = document.getElementById("container");
    this.camera = new THREE.PerspectiveCamera(
      120,
      //   @ts-ignore
      container.clientWidth / container.clientHeight,
      0.01,
      10000
    );
    this.camera.position.z = 220;
    // this.camera.position.x = 50;
    // this.camera.position.y = -50;
    this.camera.up.x = 0;
    this.camera.up.y = 0;
    this.camera.up.z = 1;
    console.log(this.camera);
    // this.camera.lookAt(62, 158, 0);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#e3edf8");

    const axisHelper = new THREE.AxesHelper(15500);
    this.scene.add(axisHelper);

    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.castShadow = true;
    this.spotLight.up.x = 0;
    this.spotLight.up.y = 0;
    this.spotLight.up.z = 1;
    this.spotLight.intensity = 2;
    this.spotLight.angle = 1.05
    this.spotLight.penumbra = 0;
    this.spotLight.decay = 1
    this.scene.add(this.spotLight);

    const columns = this.map.EntityList[0].Elements.Columns;
    const doors = this.map.EntityList[0].Elements.Doors;
    const spaces = this.map.EntityList[0].Elements.Spaces;
    const walls = this.map.EntityList[0].Elements.Walls;
    const windows = this.map.EntityList[0].Elements.Windows;
    const virtualWalls = this.map.EntityList[0].Elements.VirtualWalls;

    // this.geometry = new THREE.BoxGeometry(6, 6, 6);
    // this.material = new THREE.MeshNormalMaterial();
    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.mesh);

    // const points = [],
    //   length = 100,
    //   circle = 10;
    // for (let i = 0; i <= length; i++) {
    //   points.push(
    //     new THREE.Vector2(
    //       circle * Math.cos((Math.PI * 2 * i) / length),
    //       circle * Math.sin((Math.PI * 2 * i) / length)
    //     )
    //   );
    // }
    // const shape = new THREE.Shape(points);
    // const arcMaterial = new THREE.MeshNormalMaterial();
    // const geo = new THREE.ExtrudeGeometry(shape,{})
    // this.mesh = new THREE.Mesh(geo, arcMaterial)
    // this.scene.add(this.mesh)

    const columnMaterial = new THREE.MeshNormalMaterial({
      lights: true,
    });
    for (let i = 0; i < columns.length; i++) {
      const points = columns[i].OutLine[0].map((t: any) => {
        return new THREE.Vector2(t.X / 100, t.Y / 100);
      });
      const shape = new THREE.Shape(points);
      const geo = new THREE.ExtrudeGeometry(shape, { bevelSize: 0, depth: 15 });
      const mesh = new THREE.Mesh(geo, columnMaterial);
      this.scene.add(mesh);
    }

    const virtualWallMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#a0dbf7"),
      transparent: true,
      opacity: 0.5,
    });
    for (let i = 0; i < virtualWalls.length; i++) {
      const points = virtualWalls[i].OutLine[0].map((t: any) => {
        return new THREE.Vector2(t.X / 100, t.Y / 100);
      });
      const shape = new THREE.Shape(points);
      const geo = new THREE.ExtrudeGeometry(shape, { bevelSize: 0, depth: 15 });
      const mesh = new THREE.Mesh(geo, virtualWallMaterial);
      this.scene.add(mesh);
    }

    let minX, minY, maxX, maxY;

    const wallMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("0x6b6b6b"),
      emissive: new THREE.Color(0x0),
      specular: new THREE.Color(0x0),
      shininess: 0,
      flatShading: true,
    });
    for (let i = 0; i < walls.length; i++) {
      if (!walls[i].OutLine[0]) {
        break
      }
      const points = walls[i].OutLine[0].map((t: any) => {
        return new THREE.Vector2(t.X / 100, t.Y / 100);
      });
      const shape = new THREE.Shape(points);
      const geo = new THREE.ExtrudeGeometry(shape, { bevelSize: 0, depth: 15 });
      geo.computeBoundingBox();

      if (minX) {
        if (geo.boundingBox.min.x < minX) {
          minX = geo.boundingBox.min.x;
        }
      } else {
        minX = geo.boundingBox.min.x;
      }
      if (minY) {
        if (geo.boundingBox.min.y < minY) {
          minY = geo.boundingBox.min.y;
        }
      } else {
        minY = geo.boundingBox.min.y;
      }
      if (maxX) {
        if (geo.boundingBox.max.x > maxX) {
          maxX = geo.boundingBox.max.x;
        }
      } else {
        maxX = geo.boundingBox.max.x;
      }
      if (maxY) {
        if (geo.boundingBox.max.y > maxY) {
          maxY = geo.boundingBox.max.y;
        }
      } else {
        maxY = geo.boundingBox.max.y;
      }
      const mesh = new THREE.Mesh(geo, wallMaterial);
      this.scene.add(mesh);
    }

    const spaceMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ebf0d2"),
    });
    for (let i = 0; i < spaces.length; i++) {
      if (!spaces[i].OutLine[0]) {
        break
      }
      const points = spaces[i].OutLine[0].map((t: any) => {
        return new THREE.Vector2(t.X / 100, t.Y / 100);
      });
      const shape = new THREE.Shape(points);
      const geo = new THREE.ExtrudeGeometry(shape, {
        bevelSize: 0,
        depth: 0.1,
      });
      const mesh = new THREE.Mesh(geo, spaceMaterial);
      this.scene.add(mesh);
    }

    this.centerX = (minX + maxX) / 2;
    this.centerY = (minY + maxY) / 2;
    // this.camera.lookAt(this.centerX, this.centerY, 0);
    this.spotLight.position.set(this.centerX, this.centerY, 180);
    this.camera.position.x = 300 + this.centerX;
    this.camera.position.y = 300 + this.centerY;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    //   @ts-ignore
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    // this.renderer.setAnimationLoop(this.animation);
    container?.appendChild(this.renderer.domElement);
    console.log(this.scene);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(this.centerX, this.centerY, 0)
    // this.renderer.render(this.scene, this.camera);
    this.animation()
    console.log(window);
    
    // controls.update();
  }
  animation() {
    // time: number
    requestAnimationFrame(this.animation.bind(this));
    // this.mesh.rotation.x = time / 2000;
    // this.mesh.rotation.y = time / 1000;
    // this.angle += 0.008;
    // this.spotLight.position.x = 300 * Math.sin(this.angle) + this.centerX;
    // this.spotLight.position.y = 300 * Math.cos(this.angle) + this.centerY;
    // this.camera.position.x = 300 * Math.sin(this.angle) + this.centerX;
    // this.camera.position.y = 300 * Math.cos(this.angle) + this.centerY;
    // this.camera.lookAt(this.centerX, this.centerY, 0);
    this.controls.update()
    this.renderer.render(this.scene, this.camera);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#container {
  width: 800px;
  height: 600px;
}
</style>
