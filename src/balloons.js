/**
 * Balloon Eye Tracker
 * Creates floating balloons with expressive eyes that track the cursor everywhere on the screen.
 */

(function () {
    // Avoid double injection
    if (document.getElementById('balloon-eyes-container')) return;

    function initBalloonEyes() {
        const container = document.createElement('div');
        container.id = 'balloon-eyes-container';
        container.className = 'balloon-eyes-container';

        // 3 floating balloons with different sizes, colors, and float animations
        container.innerHTML = `
            <!-- Balloon 1: Left floating obsidian balloon -->
            <div class="balloon-wrapper balloon-left" style="--float-dur: 4.2s; --float-delay: 0s;">
                <div class="balloon balloon-dark">
                    <div class="balloon-highlight"></div>
                    <div class="balloon-face">
                        <div class="eye"><div class="pupil"></div></div>
                        <div class="eye"><div class="pupil"></div></div>
                    </div>
                    <div class="balloon-knot"></div>
                    <svg class="balloon-string" width="20" height="90" viewBox="0 0 20 90">
                        <path d="M10,0 Q3,25 10,50 T10,90" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
                    </svg>
                </div>
            </div>

            <!-- Balloon 2: Right floating silver/white balloon -->
            <div class="balloon-wrapper balloon-right" style="--float-dur: 4.8s; --float-delay: -1.8s;">
                <div class="balloon balloon-light">
                    <div class="balloon-highlight"></div>
                    <div class="balloon-face">
                        <div class="eye"><div class="pupil"></div></div>
                        <div class="eye"><div class="pupil"></div></div>
                    </div>
                    <div class="balloon-knot"></div>
                    <svg class="balloon-string" width="20" height="100" viewBox="0 0 20 100">
                        <path d="M10,0 Q17,25 10,55 T10,100" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
                    </svg>
                </div>
            </div>

            <!-- Balloon 3: Bottom right floating slate balloon -->
            <div class="balloon-wrapper balloon-bottom-right" style="--float-dur: 5.5s; --float-delay: -3.2s;">
                <div class="balloon balloon-slate">
                    <div class="balloon-highlight"></div>
                    <div class="balloon-face">
                        <div class="eye"><div class="pupil"></div></div>
                        <div class="eye"><div class="pupil"></div></div>
                    </div>
                    <div class="balloon-knot"></div>
                    <svg class="balloon-string" width="20" height="85" viewBox="0 0 20 85">
                        <path d="M10,0 Q5,22 12,45 T10,85" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
                    </svg>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        const eyes = container.querySelectorAll('.eye');

        // Eye tracking logic
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let isMoving = false;

        function updateEyes() {
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.pupil');
                if (!pupil) return;

                const rect = eye.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;

                const deltaX = mouseX - eyeCenterX;
                const deltaY = mouseY - eyeCenterY;
                const angle = Math.atan2(deltaY, deltaX);

                // Max distance pupil can move within eye (radius limit)
                const eyeRadius = rect.width / 2;
                const pupilRadius = pupil.offsetWidth / 2;
                const maxTravel = eyeRadius - pupilRadius - 1;

                const distance = Math.min(maxTravel, Math.hypot(deltaX, deltaY) / 12);

                const moveX = Math.cos(angle) * distance;
                const moveY = Math.sin(angle) * distance;

                pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            isMoving = false;
        }

        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateEyes);
            }
        });

        // Touch support for mobile devices
        window.addEventListener('touchmove', function (e) {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                if (!isMoving) {
                    isMoving = true;
                    requestAnimationFrame(updateEyes);
                }
            }
        }, { passive: true });

        // Initial eye position calculation
        updateEyes();

        // Add interactive bounce when clicking balloons
        const balloons = container.querySelectorAll('.balloon');
        balloons.forEach(balloon => {
            balloon.addEventListener('click', function () {
                balloon.classList.add('balloon-pop');
                setTimeout(() => balloon.classList.remove('balloon-pop'), 600);
            });
        });

        // Random blinking animation
        function blink() {
            eyes.forEach(eye => {
                eye.classList.add('blink');
                setTimeout(() => eye.classList.remove('blink'), 180);
            });
            const nextBlink = Math.random() * 4000 + 3000;
            setTimeout(blink, nextBlink);
        }
        setTimeout(blink, 2500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBalloonEyes);
    } else {
        initBalloonEyes();
    }
})();
