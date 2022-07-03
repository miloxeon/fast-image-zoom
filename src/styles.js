export default `
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
		background-color: white;
		z-index: 99998;
		pointer-events: none;
	}

	.image-zoom-wrapper.image-zoom-wrapper-zoomed::after {
		opacity: 1;
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
`
