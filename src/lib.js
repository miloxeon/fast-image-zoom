export const debounce = (f, ms) => {
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

export const sumValues = (source, keys) => {
	let result = 0

	keys.forEach(key => {
		const property = source[key]
		const value = parseInt(property, 10) || 0
		result += value
	})

	return result
}

export const unzoomImage = image => {
	image.style.transform = 'scale(1)'
	image.parentNode.classList.remove('image-zoom-wrapper-zoomed')
	image.addEventListener('transitionend', () => {
		image.classList.remove('image-zoom-zoomed')
	}, {
		once: true
	})
}

export const injectStyles = css => {
	const style = document.createElement('style')
	style.innerHTML = css
	style.setAttribute('id', 'image-zoom-styles')
	document.head.appendChild(style)
}

const getScale = (imageHeight, imageWidth, maxHeight, maxWidth) => {
	const widthScale = maxWidth / imageWidth
	const heightScale = maxHeight / imageHeight
	const widthScaleIsOkay = imageHeight * widthScale <= maxHeight
	return widthScaleIsOkay ? widthScale : heightScale
}

export const zoomImage = (image, config) => {
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
	
	const shouldExceed = config.exceed || image.dataset?.imageZoomExceed === 'true'
	let scale = getScale(imageHeight, imageWidth, vh, vw)

	if (!shouldExceed) {
		const limitedScale = getScale(
			imageHeight,
			imageWidth,
			image.naturalHeight,
			image.naturalWidth
		)
		scale = Math.min(scale, limitedScale)
	}

	const isPaddingNeeded = config.padding > Math.min(
		vh - imageHeight * scale,
		vw - imageWidth * scale
	) / 2

	if (isPaddingNeeded) {
		let scaleWithPaddingBeforeExceed = getScale(
			imageHeight + config.padding,
			imageWidth + config.padding,
			vh,
			vw
		)

		if (!shouldExceed) {
			const limitedScale = getScale(
				imageHeight,
				imageWidth,
				image.naturalHeight - config.padding,
				image.naturalWidth - config.padding
			)
			scaleWithPaddingBeforeExceed = Math.min(scaleWithPaddingBeforeExceed, limitedScale)
		}

		scale = scaleWithPaddingBeforeExceed
	}

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
	image.parentNode.classList.add('image-zoom-wrapper-zoomed')
	image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`
}

export const processImage = image => {
	// create an image wrapper element
	const wrapper = document.createElement('div')

	// let wrapper mimick pearl display property to not break anything
	wrapper.classList.add('image-zoom-wrapper')
	wrapper.style.display = window.getComputedStyle(image).display
	image.parentNode.insertBefore(wrapper, image)
	wrapper.appendChild(image)

	image.classList.add('image-zoom')
	image.style.transform = 'scale(1)'
}
