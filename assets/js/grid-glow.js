// 简单的视差交互：让背景气泡随鼠标微动
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    gsap.to(".blob.pink", { x: moveX * 2, y: moveY * 2, duration: 2 });
    gsap.to(".blob.blue", { x: -moveX * 3, y: -moveY * 3, duration: 2 });
    gsap.to(".blob.green", { x: moveX * 1.5, y: -moveY * 1.5, duration: 2 });
});

// 让所有 glass-panel 在鼠标进入时有轻微的倾斜感 (Tilt Effect)
const cards = document.querySelectorAll('.glass-panel');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5
        });
    });
});