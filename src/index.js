import styles from './styles'
import { debounce, unzoomImage, injectStyles, zoomImage, processImage } from './lib'

const defaultConfig = {
	selector: `img[alt]:not([alt=""]):not([data-image-zoom-disabled])`,
	containerSelector: null,
	cb: () => {},
	padding: 20,
	exceed: false,
}

export default (config = defaultConfig) => {
	const { selector, containerSelector, cb } = Object.assign({}, defaultConfig, config)

	let zoomed = null
	const getImages = () => Array.prototype.slice.call(document.querySelectorAll(selector))
	const container = document.querySelector(containerSelector)

	if (container) container.style.overflowX = 'hidden'
	else document.documentElement.style.overflowX = 'hidden'

	const interactiveElement = container || window

	const handleClick = debounce(e => {
		const target = e.target

		if (zoomed) {
			unzoomImage(zoomed)
			zoomed = null
			return
		}

		if (target.matches(selector)) {
			if (!target.classList.contains('image-zoom')) processImage(target)
			zoomImage(target, config)
			zoomed = target
		}
	}, 500)

	const handleUnzoomingInteraction = () => {
		if (!zoomed) return
		unzoomImage(zoomed)
		zoomed = null
	}

	const handleKeydown = e => {
		if (e.code !== 'Escape') return
		e.preventDefault()
		if (!zoomed) return
		unzoomImage(zoomed)
		zoomed = null
	}

	const destroy = () => {
		document.head.removeChild(document.getElementById('image-zoom-styles'))
		interactiveElement.removeEventListener('click', handleClick)
		interactiveElement.removeEventListener('scroll', handleUnzoomingInteraction)
		window.removeEventListener('resize', handleUnzoomingInteraction)
		document.removeEventListener('keydown', handleKeydown)
	}

	const start = () => {
		injectStyles(styles)
		getImages().forEach(processImage)

		interactiveElement.addEventListener('click', handleClick)
		interactiveElement.addEventListener('scroll', handleUnzoomingInteraction)
		window.addEventListener('resize', handleUnzoomingInteraction)
		document.addEventListener('keydown', handleKeydown)

		cb()
	}

	if (document.readyState === 'interactive' || document.readyState === 'complete') {
		start()
	} else {
		document.addEventListener('DOMContentLoaded', start)
	}

	return destroy
}
