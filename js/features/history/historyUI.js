// historyUI
export function renderHistory() {
	const el = document.getElementById('history') || document.createElement('div');
	el.id = 'history';
	el.innerHTML = `
		<h2>History</h2>
		<p>Work session history will appear here.</p>
	`;

	if (!document.getElementById('history')) {
		document.body.appendChild(el);
	}
}
