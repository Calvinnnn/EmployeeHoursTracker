// dashboardUI
export function renderDashboard() {
	const container = document.getElementById('dashboard') || document.createElement('div');
	container.id = 'dashboard';
	container.innerHTML = `
		<h2>Dashboard</h2>
		<p>Summary will appear here.</p>
	`;

	if (!document.getElementById('dashboard')) {
		document.body.appendChild(container);
	}
}
