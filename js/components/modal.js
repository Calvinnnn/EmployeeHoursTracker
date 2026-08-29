export function showModal(content) {
	const existing = document.getElementById('app-modal');
	if (existing) existing.remove();

	const modal = document.createElement('div');
	modal.id = 'app-modal';
	modal.style.position = 'fixed';
	modal.style.left = 0;
	modal.style.top = 0;
	modal.style.right = 0;
	modal.style.bottom = 0;
	modal.style.display = 'flex';
	modal.style.alignItems = 'center';
	modal.style.justifyContent = 'center';
	modal.style.background = 'rgba(0,0,0,0.4)';
	modal.style.zIndex = 10000;

	const box = document.createElement('div');
	box.style.background = '#fff';
	box.style.padding = '1rem';
	box.style.borderRadius = '8px';
	box.style.maxWidth = '90%';
	box.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
	box.innerHTML = typeof content === 'string' ? content : '';

	const close = document.createElement('button');
	close.textContent = 'Close';
	close.style.marginTop = '0.75rem';
	close.addEventListener('click', () => modal.remove());

	box.appendChild(close);
	modal.appendChild(box);
	document.body.appendChild(modal);
}
