// voiceParser
export function parseVoice(text) {
	// Minimal parser: return the raw text and a null command
	return {
		command: null,
		text: String(text || "").trim()
	};
}
