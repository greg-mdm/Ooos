// Only for sound effect & click event.
// No need for neurmorphism effect

const buttons  = document.querySelectorAll('.nav__btn');

const inSound  = new Audio('http://data.tomazki.com/inSound.mp3');
const outSound = new Audio('http://data.tomazki.com/outSound.mp3');

[inSound, outSound].forEach(a => {
	a.preload = 'auto';
	a.volume  = 0.03;
});


buttons.forEach(btn => {
	
	// on click add active class & play sound effect
	btn.addEventListener('click', () => {
		if (btn.classList.contains('active')) {
			btn.classList.remove('active');
			outSound.currentTime = 0;
			outSound.play().catch(() => {});
		} else {
			const otherActiveButtons = [...buttons].filter(b => b !== btn && b.classList.contains('active'));

			btn.classList.add('active');
			inSound.currentTime = 0;
			inSound.play().catch(() => {});

			if (otherActiveButtons.length > 0) {
				setTimeout(() => {
					otherActiveButtons.forEach(b => b.classList.remove('active'));
					outSound.currentTime = 0;
					outSound.play().catch(() => {});
				}, 240);
			}
		}
	});

	// CSS focus only & play sound effect
	//   btn.addEventListener('pointerdown', () => {
	//     inSound.currentTime = 0;
	//     inSound.play().catch(() => {});
	// 		btn.classList.add('active');
	//   });

	//   btn.addEventListener('pointerup', () => {
	//     outSound.currentTime = 0;
	//     outSound.play().catch(() => {});
	//   });
});