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
            const title = section.querySelector('h1');
            console.log(title);
            const t1 = gsap.timeline();
            t1.fromTo(title, 1, {x: '-30%', opacity: 0}, {x: '10%', opacity: 1});
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
