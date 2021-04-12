import barba from '@barba/core';
import {gsap} from "gsap";
import './scss/main.css';
import vanillaTilt from 'vanilla-tilt';


const imgDoc = document.querySelector(".header__name");
const hover = gsap.to(imgDoc, {scale: 1.12, color: "blue", duration: 1.5, paused: true, ease: "power1.inOut"});

imgDoc.addEventListener("mouseenter", () => hover.play());
imgDoc.addEventListener("mouseleave", () => hover.reverse());

// fullpage
new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
    navigationTooltips: ['Home', 'Works', 'About Me', 'Contact'],
    scrollHorizontally: true,
    slidesNavigation: true,
    slidesNavPosition: 'bottom',
    fixedElements: 'header',
    onLeave: (origin, destination, direction) => {

        const section = destination.item;
        const title = section.querySelector('.title__text');
        const titleBorder = section.querySelector('.title__border');
        const titleLead = section.querySelector('.title__lead');
        const image = section.querySelector('.image');

        //remove vanillaTilt on image before the animation
        if(image.vanillaTilt){
            image.vanillaTilt.destroy();
        }

        const tl = gsap.timeline();
        tl.fromTo(title, {
            x: '-100%',
            opacity: 0
        }, {
            x: '0',
            opacity: 1,
            duration: 1
        })
            .fromTo(titleBorder, {
                x: '-100%', opacity: 0
            }, {
                x: '0', opacity: 1, duration: 1
            }, "-=0.8")
            .fromTo(titleLead, {
                x: '-100%', opacity: 0
            }, {
                x: '0',
                opacity: 1,
                duration: 1.5,
                ease: 'power2.out'
            }, "-=0.8")
            .fromTo(image, {
                x: '50%', opacity: 0, scale: 0
            }, {
                x: '0',
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: 'power2.out'
            }, "-=1.5");

        tl.eventCallback("onComplete", initTilt, [image]);
    }

})

function initTilt(image) {
    vanillaTilt.init(image, {
        glare: true,
        maxGlare: .3,
        maxTilt: 7,
        speed: 750
    });
}


// barba js
function pageTransition() {
    let t1Page = gsap.timeline();
    t1Page.to('ul.transition li', {duration: .5, scaleY: 1, transformOrigin: 'bottom left', stagger: .2});
    t1Page.to('ul.transition li', {duration: .5, scaleY: 0, transformOrigin: 'bottom left', stagger: .1, delay: .1});
}

function contentAnimation() {
    let t1Content = gsap.timeline();
    t1Content.from('.left', {duration: 1.5, translateY: 50, opacity: 0});
    t1Content.to('img', {clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"});
}

function delay(n) {
    n = n || 2000;
    return new Promise(done => {
        setTimeout(() => {
            done();
        }, n)
    });
}


barba.init({
    sync: true,
    transitions: [{
        async leave(data) {
            const done = this.async();
            pageTransition();
            await delay(1500);
            done();
        },

        async enter(data) {
            contentAnimation();
        },

        async once(data) {
            contentAnimation();
        }
    }]
})


