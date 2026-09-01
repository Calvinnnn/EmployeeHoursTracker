export function showModal(content, options = {}) {
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
	box.style.color = '#111827';
	box.style.minWidth = '280px';
	box.innerHTML = typeof content === 'string' ? content : '';
	box.setAttribute('role', 'dialog');
	box.setAttribute('aria-modal', 'true');

	const actions = document.createElement('div');
	actions.style.display = 'flex';
	actions.style.justifyContent = 'flex-end';
	actions.style.gap = '0.75rem';
	actions.style.marginTop = '1rem';

	if (options.onCancel || options.cancelText) {
		const cancel = document.createElement('button');
		cancel.type = 'button';
		cancel.textContent = options.cancelText || 'إلغاء';
		cancel.addEventListener('click', () => {
			try {
				if (options.onCancel) options.onCancel();
				else modal.remove();
			} finally {
				cleanup();
			}
		});
		actions.appendChild(cancel);
	}

	if (options.onConfirm || options.confirmText) {
		const confirm = document.createElement('button');
		confirm.type = 'button';
		confirm.textContent = options.confirmText || 'تأكيد';
		confirm.style.background = '#dc2626';
		confirm.addEventListener('click', async () => {
			try {
				if (options.onConfirm) await options.onConfirm();
			} finally {
				cleanup();
			}
		});
		actions.appendChild(confirm);
	}

	if (!options.onConfirm && !options.confirmText && !options.onCancel && !options.cancelText) {
		const close = document.createElement('button');
		close.textContent = 'Close';
		close.style.marginTop = '0.75rem';
		close.addEventListener('click', () => cleanup());
		box.appendChild(close);
	}

	box.appendChild(actions);
	modal.appendChild(box);
	document.body.appendChild(modal);

	// Accessibility: focus management and keyboard handling
	const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
	const focusable = Array.from(box.querySelectorAll(focusableSelector)).filter((el) => !el.hasAttribute('disabled'));

	function focusFirst() {
		if (focusable.length > 0) {
			focusable[0].focus();
		} else {
			box.setAttribute('tabindex', '-1');
			box.focus();
		}
	}

	function handleKeyDown(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			if (options.onCancel) options.onCancel();
			cleanup();
			return;
		}

		if (e.key === 'Tab') {
			if (focusable.length === 0) {
				e.preventDefault();
				return;
			}
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	document.addEventListener('keydown', handleKeyDown);

	function cleanup() {
		try {
			const existing = document.getElementById('app-modal');
			if (existing) existing.remove();
		} finally {
			document.removeEventListener('keydown', handleKeyDown);
		}
	}

	// set initial focus
	setTimeout(focusFirst, 0);

	return modal;
}
