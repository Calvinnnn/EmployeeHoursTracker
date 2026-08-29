export function showLoading(show = true) {
	let el = document.getElementById('app-loading');

	if (show) {
		if (!el) {
			el = document.createElement('div');
			el.id = 'app-loading';
			el.textContent = 'Loading...';
			el.style.position = 'fixed';
			el.style.right = '1rem';
			el.style.bottom = '1rem';
			el.style.padding = '0.5rem 0.75rem';
			el.style.background = 'rgba(0,0,0,0.7)';
			el.style.color = '#fff';
			el.style.borderRadius = '6px';
			el.style.zIndex = 9999;
			document.body.appendChild(el);
		}
	} else {
		if (el) el.remove();
	}
}
