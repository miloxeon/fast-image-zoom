const zoomAvailable = `img[alt]:not([alt=""])`

const debounce = (f, ms) => {
	let wait = false

	return function (...args) {
		if (wait) return

		f.apply(this, args)
		wait = true

		setTimeout(() => {
			wait = false
		}, ms)
	}
}

const sumValues = (source, keys) => {
	let result = 0

	keys.forEach(key => {
		const property = source[key]
		const value = parseInt(property, 10) || 0
		result += value
	})

	return result
}

const unzoomImage = image => {
	image.addEventListener(
		'transitionend',
		() => {
			image.classList.remove('image-zoom-zoomed')
			busy = false
		},
		{ once: true }
	)
	image.style.transform = 'scale(1)'
}

const unzoomImageRough = image => {
	image.classList.remove('image-zoom-zoomed')
	image.style.transform = 'scale(1)'
	image.addEventListener(
		'transitionend',
		() => {
			busy = false
		},
		{ once: true }
	)
}

const zoomImage = image => {
	const imageRect = image.getBoundingClientRect()
	const imageStyle = window.getComputedStyle(image)

	const imageWidth =
		imageRect.width -
		sumValues(imageStyle, [
			'borderLeftWidth',
			'borderRightWidth',
			'paddingLeft',
			'paddingRight',
		])

	const imageHeight =
		imageRect.height -
		sumValues(imageStyle, [
			'borderTopWidth',
			'borderBottomWidth',
			'paddingTop',
			'paddingBottom',
		])

	const vw = Math.max(
		document.documentElement.clientWidth || 0,
		window.innerWidth || 0
	)
	const vh = Math.max(
		document.documentElement.clientHeight || 0,
		window.innerHeight || 0
	)

	const widthScale = vw / imageWidth
	const heightScale = vh / imageHeight

	const widthScaleIsOkay = imageHeight * widthScale <= vh
	const scale = widthScaleIsOkay ? widthScale : heightScale

	const doc = document.documentElement
	const scrollLeft =
		(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
	const scrollTop =
		(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

	const imageCenterX = scrollLeft + imageRect.left + imageRect.width / 2
	const imageCenterY = scrollTop + imageRect.top + imageRect.height / 2

	const screenCenterX = scrollLeft + vw / 2
	const screenCenterY = scrollTop + vh / 2

	const translateX = (screenCenterX - imageCenterX) / scale
	const translateY = (screenCenterY - imageCenterY) / scale

	image.classList.add('image-zoom-zoomed')
	image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`
	image.addEventListener(
		'transitionend',
		() => {
			busy = false
		},
		{ once: true }
	)
}

document.head.innerHTML += `
	<style>
		:root {
			overflow-x: hidden;
		}

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
	.call(document.querySelectorAll(zoomAvailable))
	.forEach(image => {
		image.classList.add('image-zoom')
		image.style.transform = 'scale(1)'
	})

let zoomed = null

const handleClick = debounce(e => {
	const target = e.target

	if (target.matches(zoomAvailable)) {
		if (zoomed === target) {
			unzoomImage(zoomed)
			zoomed = null
			return
		}

		if (zoomed) {
			unzoomImageRough(zoomed)
			zoomed = null
		}

		zoomImage(target)
		zoomed = target
	} else if (zoomed) {
		unzoomImage(zoomed)
	}
}, 500)

document.body.addEventListener('click', handleClick)
window.addEventListener('scroll', () => {
	if (zoomed) {
		unzoomImage(zoomed)
		zoomed = null
	}
})
