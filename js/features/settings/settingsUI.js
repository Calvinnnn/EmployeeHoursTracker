// settingsUI
export function renderSettings() {
	const el = document.getElementById('settings') || document.createElement('div');
	el.id = 'settings';
	el.innerHTML = `
		<h2>Settings</h2>
		<p>Application settings will appear here.</p>
	`;

	if (!document.getElementById('settings')) {
		document.body.appendChild(el);
	}
}
