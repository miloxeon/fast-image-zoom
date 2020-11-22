const imagesToZoomSelector = `img[alt]:not([alt=""])`

const zoomImage = image => {
	const alreadyZoomed = image.classList.contains('image-zoom-zoomed')

	if (alreadyZoomed) {
		image.addEventListener(
			'transitionend',
			() => {
				image.classList.remove('image-zoom-zoomed')
			},
			{ once: true }
		)
		image.style.transform = 'scale(1)'
		return
	}

	const imageRect = image.getBoundingClientRect()

	const vw = Math.max(
		document.documentElement.clientWidth || 0,
		window.innerWidth || 0
	)
	const vh = Math.max(
		document.documentElement.clientHeight || 0,
		window.innerHeight || 0
	)

	const widthScale = vw / imageRect.width
	const heightScale = vh / imageRect.height

	const widthScaleIsOkay = imageRect.height * widthScale <= vh
	const scale = widthScaleIsOkay ? widthScale : heightScale

	image.classList.add('image-zoom-zoomed')
	image.style.transform = `scale(${scale})`
}

document.head.innerHTML += `
	<style>
		.image-zoom {
			transition: transform 300ms;
			will-change: transform;
		}

		.image-zoom-zoomed {
			position: relative;
			z-index: 99999;
		}
	</style>
`

Array.prototype.slice
	.call(document.querySelectorAll(imagesToZoomSelector))
	.forEach(image => {
		image.classList.add('image-zoom')
		image.style.transform = 'scale(1)'
		image.addEventListener('click', () => zoomImage(image))
	})
