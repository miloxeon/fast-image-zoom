import styles from './styles'
import {
	debounce,
	unzoomImage,
	injectStyles,
	zoomImage,
	processImage,
} from './lib'

export default (selector = `img[alt]:not([alt=""])`, cb = () => {}) => {
	let zoomed = null
	const getImages = () =>
		Array.prototype.slice.call(document.querySelectorAll(selector))

	const handleClick = debounce(e => {
		const target = e.target

		if (zoomed) {
			unzoomImage(zoomed)
			zoomed = null
			return
		}

		if (target.matches(selector)) {
			if (!target.classList.contains('image-zoom')) {
				processImage(target)
			}
			zoomImage(target)
			zoomed = target
		}
	}, 500)

	const handleScroll = () => {
		if (zoomed) {
			unzoomImage(zoomed)
			zoomed = null
		}
	}

	const destroy = () => {
		document.body.removeEventListener('click', handleClick)
		window.removeEventListener('scroll', handleScroll)
		document.head.removeChild(document.getElementById('image-zoom-styles'))
	}

	const start = () => {
		injectStyles(styles)

		getImages().forEach(processImage)

		document.body.addEventListener('click', handleClick)
		window.addEventListener('scroll', handleScroll)

		cb()
	}

	if (document.readyState === 'interactive') {
		start()
	} else {
		document.addEventListener('DOMContentLoaded', start)
	}

	return destroy
}
