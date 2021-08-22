import { gsap } from "gsap";
import { listeners, getMousePos, getSiblings } from "./utils";

// Grab the mouse position and set it to mouse state
let mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (ev) => (mouse = getMousePos(ev)));

export default class Cursor {
    constructor(el) {
        // Varibles
        this.Cursor = el;
        this.Cursor.style.opacity = 0;
        this.Item = document.querySelectorAll(".hero-inner-link-item");
        this.Hero = document.querySelector(".hero-inner");
        this.bounds = this.Cursor.getBoundingClientRect();
        this.CursorConfigs = {
            x: { previous:0, current: 0, amt: 0.2 },
            y: { previous:0, current: 0, amt: 0.2 },
        };
        // Define mouse move function
        this.onMouseMoveEv = () => {
            this.CursorConfigs.x.previous = this.CursorConfigs.x.current = mouse.x;
            this.CursorConfigs.y.previous = this.CursorConfigs.y.current = mouse.y;
            // Set cursor opacity to 1 when hovered on screen
            gsap.to(this.Cursor, {
                duration: 1,
                ease: "Power3.easeOut",
                opacity: 1,
            });

            //Execute Scale
            this.onScaleMouse();

            // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
            requestAnimationFrame(() => this.render());
            //Clean up function
            window.removeEventListener("mousemove", this.onMouseMoveEv);
        };

        //assign the mouse function
        window.addEventListener("mousemove", this.onMouseMoveEV);

    }

    //Scale the media of the mosue 
    onScaleMouse() {
        this.Item.forEach((link) => {
            if (link.matches(":hover")) {
                this.setvideo(link);
                this.scaleAnimation(this.Cursor.children[0], 0.8);
            }

            link.addEventListener("mouseenter", () => {
                // Gsap animation for scaling media
                this.setvideo(link);
                this.scaleAnimation(this.Cursor.children[0], 0.8);
            });
            //Scale down media on hover off
            link.addEventListener("mouseleave", () => {
                this.scaleAnimation(this.Cursor.children[0], 0);
            });
            //Hover on a tag to expand to 1.2
            link.children[1].addEventListener("mouseenter", () => {
                this.Cursor.classList.add("media-blend")
                this.scaleAnimation(this.Cursor.children[0], 1.2);
            });
            //Off Hover scale to .8
            link.children[1].addEventListener("mouseleave", () => {
                this.Cursor.classList.remove("media-blend")
                this.scaleAnimation(this.Cursor.children[0], 0.8);
            });
        });
    }

    //Scale Animation
    scaleAnimation(el, amt) {
        gsap.to(el, {
            duration: 0.6,
            scale: amt,
            ease: "Power3.easeOut",
        });
    }

    //set video
    setvideo(el) {
        // Grab the data-video-src and ensure it matches the video that would be displayed
        let src = el.getAttribute("data-video-src");
        let video = document.querySelector('#${src}');
        let siblings = getSiblings(video);

        if (video.id == src) {
            gsap.set(video, { zIndex: 4, opacity: 1});
            siblings.forEach((i) => {
                gsap.set(i, { zIndex: 1, opacity: 0 });
            });
        }

    }

    render(){
        this.CursorConfigs.x.current = mouse.x;
        this.CursorConfigs.y.current = mouse.y;

        // lerp
        for (const key in this.cursorConfigs) {
            this.cursorConfigs[key].previous = lerp(
                this.cursorConfigs[key].previous,
                this.cursorConfigs[key].current,
                this.cursorConfigs[key].amt
            );
        }
        // Setting the cursor x and y to our cursoer html element
        this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px)
        translateY(${this.cursorConfigs.y.previous}px)`;
    // RAF
    requestAnimationFrame(() => this.render());
    }
}