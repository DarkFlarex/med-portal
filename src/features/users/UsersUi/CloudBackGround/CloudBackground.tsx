import { useEffect, useRef } from "react";
import "./CloudBackground.css";

const CloudBackground = () => {
    const worldRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const world = worldRef.current;
        if (!world) return;

        let worldXAngle = 0;
        let worldYAngle = 0;
        let d = 0;

        const objects: HTMLDivElement[] = [];
        const layers: HTMLImageElement[] = [];

        const getWorld = () => worldRef.current as HTMLDivElement;

        function createCloud(): HTMLDivElement {
            const worldEl = getWorld();

            const div = document.createElement("div");
            div.className = "cloudBase";

            const rx = 256 - Math.random() * 512;
            const ry = 256 - Math.random() * 512;
            const rz = 400 - Math.random() * 800; // глубина
            div.style.transform = `translateX(${rx}px) translateY(${ry}px) translateZ(${rz}px)`;
            worldEl.appendChild(div);

            const cloudCount = 5 + Math.round(Math.random() * 10);
            for (let j = 0; j < cloudCount; j++) {
                const cloud = document.createElement("img");
                cloud.className = "cloudLayer";
                cloud.src = "https://pngimg.com/uploads/cloud/cloud_PNG19.png";
                cloud.style.opacity = "0.8";

                const x = (256 - Math.random() * 512) * 0.2;
                const y = (256 - Math.random() * 512) * 0.2;
                const z = 100 - Math.random() * 200;
                const a = Math.random() * 360;
                const s = 0.25 + Math.random();
                const speed = 0.05 + Math.random() * 0.05;

                cloud.dataset.x = x.toString();
                cloud.dataset.y = y.toString();
                cloud.dataset.z = z.toString();
                cloud.dataset.a = a.toString();
                cloud.dataset.s = s.toString();
                cloud.dataset.speed = speed.toString();

                cloud.style.transform = `
                    translateX(${x}px)
                    translateY(${y}px)
                    translateZ(${z}px)
                    rotateZ(${a}deg)
                    scale(${s})
                `;

                div.appendChild(cloud);
                layers.push(cloud);
            }

            return div;
        }

        function generate() {
            const worldEl = getWorld();
            while (worldEl.firstChild) {
                worldEl.removeChild(worldEl.firstChild);
            }

            for (let i = 0; i < 8; i++) {
                const cloud = createCloud();
                objects.push(cloud);
            }
        }

        function updateView() {
            const worldEl = getWorld();
            worldEl.style.transform = `
                translateZ(${d}px)
                rotateX(${worldXAngle}deg)
                rotateY(${worldYAngle}deg)
            `;
        }

        function update() {
            layers.forEach((layer) => {
                const angle = parseFloat(layer.dataset.a || "0") + parseFloat(layer.dataset.speed || "0");
                layer.dataset.a = angle.toString();
                layer.style.transform = `
                    translateX(${layer.dataset.x}px)
                    translateY(${layer.dataset.y}px)
                    translateZ(${layer.dataset.z}px)
                    rotateY(${-worldYAngle}deg)
                    rotateX(${-worldXAngle}deg)
                    rotateZ(${angle}deg)
                    scale(${layer.dataset.s})
                `;
            });
            requestAnimationFrame(update);
        }

        function onMouseMove(e: MouseEvent) {
            worldYAngle = -(.5 - e.clientX / window.innerWidth) * 180;
            worldXAngle = -(.5 - e.clientY / window.innerHeight) * 180;
            updateView();
        }

        function onWheel(e: WheelEvent) {
            d -= e.deltaY / 8;
            updateView();
        }

        generate();
        update();
        updateView();

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("wheel", onWheel);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <div id="viewport">
            <div id="world" ref={worldRef}></div>
        </div>
    );
};

export default CloudBackground;
