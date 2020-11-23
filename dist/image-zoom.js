var imageZoom = (function () {
	'use strict';

	var styles = `
	<style id="image-zoom-styles">
		:root {
			overflow-x: hidden;
		}

		.image-zoom-wrapper::after {
			opacity: 0;
			transition: opacity 150ms cubic-bezier(.25, .1, .25 ,1);
			display: block;
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: black;
			z-index: 99998;
			pointer-events: none;
		}

		.image-zoom-wrapper.image-zoom-wrapper-zoomed::after {
			opacity: .6;
			cursor: zoom-out;
			pointer-events: all;
		}

		.image-zoom {
			transition: transform 300ms cubic-bezier(.25, .1, .25 ,1);
			cursor: zoom-in;
		}

		.image-zoom-zoomed {
			position: relative;
			z-index: 99999;
			cursor: zoom-out;
		}
	</style>
`;

	const debounce = (f, ms) => {
		let wait = false;

		return function (...args) {
			if (wait) return

			f.apply(this, args);
			wait = true;

			setTimeout(() => {
				wait = false;
			}, ms);
		}
	};

	const sumValues = (source, keys) => {
		let result = 0;

		keys.forEach(key => {
			const property = source[key];
			const value = parseInt(property, 10) || 0;
			result += value;
		});

		return result
	};

	const unzoomImage = image => {
		image.style.transform = 'scale(1)';
		image.parentNode.classList.remove('image-zoom-wrapper-zoomed');
		image.addEventListener(
			'transitionend',
			() => {
				image.classList.remove('image-zoom-zoomed');
			},
			{ once: true }
		);
	};

	const injectStyles = css => (document.head.innerHTML += css);

	const zoomImage = image => {
		const imageRect = image.getBoundingClientRect();
		const imageStyle = window.getComputedStyle(image);

		const imageWidth =
			imageRect.width -
			sumValues(imageStyle, [
				'borderLeftWidth',
				'borderRightWidth',
				'paddingLeft',
				'paddingRight',
			]);

		const imageHeight =
			imageRect.height -
			sumValues(imageStyle, [
				'borderTopWidth',
				'borderBottomWidth',
				'paddingTop',
				'paddingBottom',
			]);

		const vw = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0
		);
		const vh = Math.max(
			document.documentElement.clientHeight || 0,
			window.innerHeight || 0
		);

		const widthScale = vw / imageWidth;
		const heightScale = vh / imageHeight;

		const widthScaleIsOkay = imageHeight * widthScale <= vh;
		const scale = widthScaleIsOkay ? widthScale : heightScale;

		const doc = document.documentElement;
		const scrollLeft =
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
		const scrollTop =
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

		const imageCenterX = scrollLeft + imageRect.left + imageRect.width / 2;
		const imageCenterY = scrollTop + imageRect.top + imageRect.height / 2;

		const screenCenterX = scrollLeft + vw / 2;
		const screenCenterY = scrollTop + vh / 2;

		const translateX = (screenCenterX - imageCenterX) / scale;
		const translateY = (screenCenterY - imageCenterY) / scale;

		image.classList.add('image-zoom-zoomed');
		image.parentNode.classList.add('image-zoom-wrapper-zoomed');
		image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
	};

	const processImage = image => {
		// create an image wrapper element
		const wrapper = document.createElement('div');

		// let wrapper mimick pearl display property to not break anything
		wrapper.classList.add('image-zoom-wrapper');
		wrapper.style.display = window.getComputedStyle(image).display;
		image.parentNode.insertBefore(wrapper, image);
		wrapper.appendChild(image);

		image.classList.add('image-zoom');
		image.style.transform = 'scale(1)';
	};

	var index = (selector = `img[alt]:not([alt=""])`) => {
		let zoomed = null;
		const getImages = () =>
			Array.prototype.slice.call(document.querySelectorAll(selector));

		const handleClick = debounce(e => {
			const target = e.target;

			if (zoomed) {
				unzoomImage(zoomed);
				zoomed = null;
				return
			}

			if (target.matches(selector)) {
				if (!target.classList.contains('image-zoom')) {
					processImage(target);
				}
				zoomImage(target);
				zoomed = target;
			}
		}, 500);

		const handleScroll = () => {
			if (zoomed) {
				unzoomImage(zoomed);
				zoomed = null;
			}
		};

		const destroy = () => {
			document.body.removeEventListener('click', handleClick);
			window.removeEventListener('scroll', handleScroll);
			document.head.removeChild(document.getElementById('image-zoom-styles'));
		};

		const start = () => {
			injectStyles(styles);

			getImages().forEach(processImage);

			document.body.addEventListener('click', handleClick);
			window.addEventListener('scroll', handleScroll);
		};

		if (document.readyState === 'interactive') {
			start();
		} else {
			document.addEventListener('DOMContentLoaded', start);
		}

		return destroy
	};

	return index;

}());
