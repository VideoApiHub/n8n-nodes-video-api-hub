import type { INodeProperties } from 'n8n-workflow';

const showFor = { resource: ['videoAudio'] };

const allOps = ['addAudio', 'removeAudio', 'extractAudio'];

export const videoAudioDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Add Audio',
				value: 'addAudio',
				action: 'Add audio to a video',
				description: 'Add background music or replace the existing audio track',
			},
			{
				name: 'Remove Audio',
				value: 'removeAudio',
				action: 'Remove audio from a video',
				description: 'Strip all sound from your video',
			},
			{
				name: 'Extract Audio',
				value: 'extractAudio',
				action: 'Extract audio from a video',
				description: 'Save just the audio track as MP3, WAV, or AAC',
			},
		],
		default: 'addAudio',
	},

	// ── Video Source ──────────────────────────────────────────
	{
		displayName: 'Video Source',
		name: 'input',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showFor, operation: allOps } },
		default: '',
		placeholder: 'https://example.com/my-video.mp4',
		description: 'Paste a link to your video, or enter a file path from your storage',
	},

	// ── Output Format (video ops) ────────────────────────────
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['addAudio', 'removeAudio'] } },
		options: [
			{ name: 'MP4 (Recommended)', value: 'mp4' },
			{ name: 'MOV', value: 'mov' },
			{ name: 'WebM', value: 'webm' },
			{ name: 'MKV', value: 'mkv' },
		],
		default: 'mp4',
		description: 'Choose the format for your output video',
	},

	// ── Output Format (extract audio) ────────────────────────
	{
		displayName: 'Audio Format',
		name: 'audioFormat',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['extractAudio'] } },
		options: [
			{ name: 'MP3 (Recommended)', value: 'mp3' },
			{ name: 'WAV (Uncompressed)', value: 'wav' },
			{ name: 'AAC', value: 'aac' },
		],
		default: 'mp3',
		description: 'Choose the format for the extracted audio',
	},

	// ── How to Get the Result ─────────────────────────────────
	{
		displayName: 'How to Get the Result',
		name: 'outputType',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: allOps } },
		options: [
			{ name: 'File (Default)', value: 'file', description: 'Download the file directly when the job completes' },
			{ name: 'Public URL', value: 'public_url', description: 'Get a permanent public link — no authentication needed' },
			{ name: 'Download Link', value: 'signed_url', description: 'Get a temporary download link that expires' },
			{ name: 'Save to Storage Only', value: 'stored', description: 'View the file in your VideoApiHub dashboard, or use the File > Download node with the output key' },
		],
		default: 'file',
		description: 'How you want to receive the finished result',
	},
	{
		displayName: 'Link Expires After (Seconds)',
		name: 'outputExpiry',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: allOps, outputType: ['signed_url'] } },
		typeOptions: { minValue: 60, maxValue: 86400 },
		default: 3600,
		description: 'How long the download link stays active. Default: 1 hour (3600 seconds).',
	},

	// ── Advanced Settings ────────────────────────────────────
	{
		displayName: 'Advanced Settings',
		name: 'outputOptions',
		type: 'collection',
		placeholder: 'Add Setting',
		displayOptions: { show: { ...showFor, operation: allOps } },
		default: {},
		options: [
			{
				displayName: 'Custom Save Path',
				name: 'outputKey',
				type: 'string',
				default: '',
				placeholder: 'my-folder/result.mp4',
				description: 'Where to save the result in your storage. Leave empty to auto-generate.',
			},
		],
	},

	// ═══════════════════════════════════════════════════════════
	// ADD AUDIO
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Audio File',
		name: 'audioKey',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['addAudio'] } },
		default: '',
		placeholder: 'https://example.com/music.mp3',
		description: 'Link to the audio file, or a file path from your storage',
	},
	{
		displayName: 'Audio Mode',
		name: 'mixMode',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['addAudio'] } },
		options: [
			{
				name: 'Replace Original Audio',
				value: 'replace',
				description: 'Remove the original audio and use only the new audio',
			},
			{
				name: 'Mix with Original Audio',
				value: 'mix',
				description: 'Play the new audio on top of the original audio',
			},
		],
		default: 'replace',
	},
	{
		displayName: 'Audio Options',
		name: 'audioOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: { show: { ...showFor, operation: ['addAudio'] } },
		default: {},
		options: [
			{
				displayName: 'Volume',
				name: 'volume',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 1 },
				default: 1,
				description: 'Volume level (0 = silent, 1 = normal, 2 = double volume)',
			},
			{
				displayName: 'Start Audio From (Seconds)',
				name: 'audioStartSeconds',
				type: 'number',
				typeOptions: { minValue: 0, numberPrecision: 1 },
				default: 0,
				description: 'Skip ahead in the audio file and start from this point',
			},
			{
				displayName: 'Delay Audio By (Seconds)',
				name: 'videoOffsetSeconds',
				type: 'number',
				typeOptions: { minValue: 0, numberPrecision: 1 },
				default: 0,
				description: 'Wait this many seconds into the video before the audio begins',
			},
			{
				displayName: 'Max Audio Length (Seconds)',
				name: 'audioDurationSeconds',
				type: 'number',
				typeOptions: { minValue: 0, numberPrecision: 1 },
				default: 0,
				description: 'Maximum length of audio to use (0 = use full audio)',
			},
		],
	},
];
