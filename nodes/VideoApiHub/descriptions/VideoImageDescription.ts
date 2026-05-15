import type { INodeProperties } from 'n8n-workflow';

/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items */

const showFor = { resource: ['videoImage'] };

const allOps = ['thumbnail', 'thumbnailWithText', 'screenshots'];

export const videoImageDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Capture Thumbnail',
				value: 'thumbnail',
				action: 'Capture a thumbnail from a video',
				description: 'Grab a single frame from your video as an image',
			},
			{
				name: 'Capture Thumbnail with Text',
				value: 'thumbnailWithText',
				action: 'Capture a thumbnail with text overlay',
				description: 'Grab a frame and add text or a logo on top',
			},
			{
				name: 'Capture Screenshots',
				value: 'screenshots',
				action: 'Capture screenshots from a video',
				description: 'Grab multiple frames from your video as images',
			},
		],
		default: 'thumbnail',
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

	// ── Image Format ─────────────────────────────────────────
	{
		displayName: 'Image Format',
		name: 'imageFormat',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: allOps } },
		options: [
			{ name: 'JPG (Recommended)', value: 'jpg' },
			{ name: 'PNG (Higher Quality)', value: 'png' },
		],
		default: 'jpg',
		description: 'Choose the image format for the output',
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
				placeholder: 'my-folder/result.jpg',
				description: 'Where to save the result in your storage. Leave empty to auto-generate.',
			},
		],
	},

	// ═══════════════════════════════════════════════════════════
	// THUMBNAIL
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Capture At (Seconds)',
		name: 'atSecond',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['thumbnail'] } },
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 1,
		description: 'The time in the video to capture the image from',
	},

	// ═══════════════════════════════════════════════════════════
	// SCREENSHOTS
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Mode',
		name: 'screenshotMode',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['screenshots'] } },
		options: [
			{
				name: 'Fixed Number of Screenshots',
				value: 'count',
				description: 'Take a set number of screenshots, one per second from the start',
			},
			{
				name: 'At Specific Times',
				value: 'timestamps',
				description: 'Take screenshots at exact times you choose',
			},
			{
				name: 'Random',
				value: 'random',
				description: 'Take screenshots at random moments in the video',
			},
		],
		default: 'count',
	},
	{
		displayName: 'Number of Screenshots',
		name: 'screenshotCount',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['screenshots'], screenshotMode: ['count', 'random'] },
		},
		typeOptions: { minValue: 1 },
		default: 3,
		description: 'How many screenshots to capture',
	},
	{
		displayName: 'Times (Seconds)',
		name: 'timestamps',
		type: 'string',
		displayOptions: {
			show: {
				...showFor,
				operation: ['screenshots'],
				screenshotMode: ['timestamps'],
			},
		},
		default: '',
		placeholder: '1.5, 10, 30, 60',
		description: 'Comma-separated list of times to capture screenshots at (in seconds)',
	},
	{
		displayName: 'Video Length (Seconds)',
		name: 'videoDuration',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['screenshots'], screenshotMode: ['random'] },
		},
		typeOptions: { minValue: 0.1, numberPrecision: 1 },
		default: 60,
		description: 'Total length of your video in seconds (needed for random mode)',
	},

	// ═══════════════════════════════════════════════════════════
	// THUMBNAIL WITH TEXT
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Capture At (Seconds)',
		name: 'textThumbAtSecond',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['thumbnailWithText'] } },
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 2,
		description: 'The time in the video to capture the background image from',
	},
	{
		displayName: 'Overlay Text',
		name: 'overlayText',
		type: 'string',
		displayOptions: { show: { ...showFor, operation: ['thumbnailWithText'] } },
		default: '',
		placeholder: 'Episode 1',
		description: 'Text to display on the thumbnail (leave empty if using only an overlay image)',
	},
	{
		displayName: 'Text Position',
		name: 'textPosition',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['thumbnailWithText'] } },
		options: [
			{ name: 'Top Left', value: 'top_left' },
			{ name: 'Top Center', value: 'top_center' },
			{ name: 'Top Right', value: 'top_right' },
			{ name: 'Center', value: 'center' },
			{ name: 'Bottom Left', value: 'bottom_left' },
			{ name: 'Bottom Center', value: 'bottom_center' },
			{ name: 'Bottom Right', value: 'bottom_right' },
		],
		default: 'bottom_center',
		description: 'Where to place the text on the image',
	},
	{
		displayName: 'Text & Overlay Options',
		name: 'thumbnailTextOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: { show: { ...showFor, operation: ['thumbnailWithText'] } },
		default: {},
		options: [
			{
				displayName: 'Font',
				name: 'font',
				type: 'string',
				default: '',
				placeholder: 'Arial',
				description: 'Font name to use for the text',
			},
			{
				displayName: 'Font Size',
				name: 'fontSize',
				type: 'number',
				typeOptions: { minValue: 8, maxValue: 200 },
				default: 46,
				description: 'Size of the text',
			},
			{
				displayName: 'Font Color',
				name: 'fontColor',
				type: 'color',
				default: 'white',
				description: 'Color of the text (name like "white" or hex like "#FF0000")',
			},
			{
				displayName: 'Text Effect',
				name: 'effect',
				type: 'options',
				options: [
					{ name: 'Shadow', value: 'shadow' },
					{ name: 'Box', value: 'box' },
					{ name: 'Outline', value: 'outline' },
					{ name: 'None', value: 'none' },
				],
				default: 'shadow',
				description: 'Visual effect applied to the text',
			},
			{
				displayName: 'Overlay Image',
				name: 'overlayImageKey',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/logo.png',
				description: 'Link to an image (like a logo) to place on the thumbnail',
			},
			{
				displayName: 'Overlay Width (Pixels)',
				name: 'overlayWidth',
				type: 'number',
				default: 0,
				description: 'Width of the overlay image (0 = original size)',
			},
			{
				displayName: 'Overlay Height (Pixels)',
				name: 'overlayHeight',
				type: 'number',
				default: 0,
				description: 'Height of the overlay image (0 = original size)',
			},
		],
	},
];
