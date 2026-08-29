// voiceUI
export function setupVoiceControls() {
	// Minimal setup: no-op if SpeechRecognition unavailable
	if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
		console.info('Speech recognition not available in this browser.');
		return;
	}

	// Real setup can be added later; keep this minimal so imports succeed.
}
