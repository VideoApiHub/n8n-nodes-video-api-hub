import type { INodeProperties } from 'n8n-workflow';

/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */

const showFor = { resource: ['videoEdit'] };

const allOps = ['clip', 'multiClip', 'resize', 'convertFormat', 'customCommand'];

export const videoEditDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Clip Video',
				value: 'clip',
				action: 'Clip a section from a video',
				description: 'Cut out a specific time range from your video',
			},
			{
				name: 'Clip Multiple Sections',
				value: 'multiClip',
				action: 'Clip multiple sections from a video',
				description: 'Cut out several time ranges from your video at once',
			},
			{
				name: 'Resize / Change Aspect Ratio',
				value: 'resize',
				action: 'Resize a video',
				description: 'Change the size or aspect ratio (e.g. landscape to portrait)',
			},
			{
				name: 'Convert Format',
				value: 'convertFormat',
				action: 'Convert video format',
				description: 'Convert between MP4, MOV, WebM, and MKV',
			},
			{
				name: 'Run Custom FFmpeg Command',
				value: 'customCommand',
				action: 'Run a custom ffmpeg command',
				description: 'Run your own FFmpeg command for advanced processing',
			},
		],
		default: 'clip',
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

	// ── Output Format ────────────────────────────────────────
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: allOps } },
		options: [
			{ name: 'MP4 (Recommended)', value: 'mp4' },
			{ name: 'MOV', value: 'mov' },
			{ name: 'WebM', value: 'webm' },
			{ name: 'MKV', value: 'mkv' },
		],
		default: 'mp4',
		description: 'Choose the format for your output video',
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
				displayName: 'How to Get the Result',
				name: 'outputType',
				type: 'options',
				options: [
					{ name: 'Download Link (Default)', value: 'signed_url', description: 'Get a temporary download link' },
					{ name: 'Direct File Download', value: 'file', description: 'Download the file directly' },
					{ name: 'Save to Storage Only', value: 'stored', description: 'Just save it — no download link' },
				],
				default: 'signed_url',
				description: 'How you want to receive the finished result',
			},
			{
				displayName: 'Link Expires After (Seconds)',
				name: 'outputExpiry',
				type: 'number',
				typeOptions: { minValue: 60, maxValue: 86400 },
				default: 3600,
				description: 'How long the download link stays active. Default: 1 hour.',
			},
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
	// CLIP
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Start At (Seconds)',
		name: 'startSeconds',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['clip'] } },
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 0,
		description: 'When to start cutting (in seconds from the beginning)',
	},
	{
		displayName: 'Length (Seconds)',
		name: 'durationSeconds',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['clip'] } },
		typeOptions: { minValue: 0.1, numberPrecision: 1 },
		default: 5,
		description: 'How long the clip should be',
	},

	// ═══════════════════════════════════════════════════════════
	// MULTI CLIP
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Clip Mode',
		name: 'clipMode',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['multiClip'] } },
		options: [
			{
				name: 'Pick Specific Segments',
				value: 'custom',
				description: 'Choose exact start times and durations for each clip',
			},
			{
				name: 'Evenly Spaced Clips',
				value: 'even',
				description: 'Create clips at regular intervals',
			},
		],
		default: 'custom',
	},
	{
		displayName: 'Segments',
		name: 'segments',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Segment',
		},
		displayOptions: {
			show: { ...showFor, operation: ['multiClip'], clipMode: ['custom'] },
		},
		default: {},
		options: [
			{
				name: 'segmentValues',
				displayName: 'Segment',
				values: [
					{
						displayName: 'Start At (Seconds)',
						name: 'startSeconds',
						type: 'number',
						typeOptions: { minValue: 0, numberPrecision: 1 },
						default: 0,
						description: 'When this segment starts',
					},
					{
						displayName: 'Length (Seconds)',
						name: 'durationSeconds',
						type: 'number',
						typeOptions: { minValue: 0.1, numberPrecision: 1 },
						default: 5,
						description: 'How long this segment lasts',
					},
				],
			},
		],
		description: 'The segments you want to extract',
	},
	{
		displayName: 'Start At (Seconds)',
		name: 'evenStartSeconds',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 0,
		description: 'When to start the first clip',
	},
	{
		displayName: 'Each Clip Length (Seconds)',
		name: 'evenDurationSeconds',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 0.1, numberPrecision: 1 },
		default: 4,
		description: 'How long each clip should be',
	},
	{
		displayName: 'Gap Between Clips (Seconds)',
		name: 'gapSeconds',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 0,
		description: 'Time to skip between each clip',
	},
	{
		displayName: 'Number of Clips',
		name: 'clipCount',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 1 },
		default: 3,
		description: 'How many clips to create',
	},

	// ═══════════════════════════════════════════════════════════
	// RESIZE
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Size Mode',
		name: 'sizeMode',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['resize'] } },
		options: [
			{
				name: 'Choose a Preset Ratio',
				value: 'preset',
				description: 'Pick from common aspect ratios like 16:9 or 9:16',
			},
			{
				name: 'Enter Custom Size',
				value: 'custom',
				description: 'Set exact width and height in pixels',
			},
		],
		default: 'preset',
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		displayOptions: {
			show: { ...showFor, operation: ['resize'], sizeMode: ['preset'] },
		},
		options: [
			{ name: '16:9 (Landscape / YouTube)', value: 'landscape_16_9' },
			{ name: '9:16 (Portrait / Reels / TikTok)', value: 'mobile_9_16' },
			{ name: '1:1 (Square / Instagram)', value: 'square_1_1' },
			{ name: '4:3 (Classic)', value: 'standard_4_3' },
			{ name: '4:5 (Portrait / Facebook)', value: 'portrait_4_5' },
			{ name: '21:9 (Ultra-wide)', value: 'ultrawide_21_9' },
		],
		default: 'landscape_16_9',
		description: 'The shape to resize your video to',
	},
	{
		displayName: 'Width (Pixels)',
		name: 'customWidth',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['resize'], sizeMode: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1920,
		description: 'Width of the output video',
	},
	{
		displayName: 'Height (Pixels)',
		name: 'customHeight',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['resize'], sizeMode: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1080,
		description: 'Height of the output video',
	},
	{
		displayName: 'Fit Mode',
		name: 'fitMode',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['resize'] } },
		options: [
			{
				name: 'Fill & Crop (No Bars)',
				value: 'cover',
				description: 'Scale and crop to completely fill the frame',
			},
			{
				name: 'Fit Inside (May Add Bars)',
				value: 'contain',
				description: 'Scale to fit inside the frame, adding black bars if needed',
			},
			{
				name: 'Stretch to Fill',
				value: 'stretch',
				description: 'Stretch the video to fill the frame exactly',
			},
		],
		default: 'cover',
	},

	// ═══════════════════════════════════════════════════════════
	// CUSTOM COMMAND
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Command',
		name: 'command',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['customCommand'] } },
		default: '',
		placeholder: '-i {input} -vf "scale=640:480" {output}',
		description:
			'The processing command to run. Use {input} as a placeholder for the source file and {output} for the result file.',
	},
];
