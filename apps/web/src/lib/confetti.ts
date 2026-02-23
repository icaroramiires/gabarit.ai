import confetti from "canvas-confetti"

export function fireConfetti() {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#2563eb', '#16a34a', '#d97706']
        })
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#2563eb', '#16a34a', '#d97706']
        })

        if (Date.now() < end) {
            requestAnimationFrame(frame)
        }
    }

    frame()
}

export function fireSchoolPride() {
    var end = Date.now() + (2 * 1000);

    // go Buckeyes!
    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
