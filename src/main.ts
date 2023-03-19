import "./style.scss";
import initWebGL from "./webgl";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

initWebGL(canvas);
