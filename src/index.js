import barba from '@barba/core';
import {gsap} from "gsap";
import './scss/main.css';


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
        if (destination.index !== 1) {
            const title = section.querySelector('.title__text');
            const t1 = gsap.timeline();
            t1.fromTo(title, {x: '-100%', opacity: 0}, {x: '0', opacity: 1, duration: 1});

            const titleBorder = section.querySelector('.title__border');
            const t2 = gsap.timeline();
            t2.fromTo(titleBorder, {x: '-100%', opacity: 0}, {x: '0', opacity: 1, duration:1})
                .delay(0.2);

            const titleLead = section.querySelector('.title__lead');
            const t3 = gsap.timeline();
            t3.fromTo(titleLead, {x: '-100%', opacity: 0}, {x: '0', opacity: 1, duration:1})
                .delay(0.4);

            const image = section.querySelector('.image');
            const t4 = gsap.timeline();
            t4.fromTo(image, {x: '50%', opacity: 0, scale: 0}, {x: '0', opacity: 1, scale:1, duration:1.5});

        }
    }
})


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
