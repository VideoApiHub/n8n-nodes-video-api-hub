import type { INodeProperties } from 'n8n-workflow';

/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

const showFor = { resource: ['videoHtml'] };

export const videoHtmlDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Create HTML Video',
				value: 'createHtml',
				action: 'Create a video from an HTML composition',
				description: 'Render an HTML composition (Hyperframes) to video using headless Chrome',
			},
		],
		default: 'createHtml',
	},

	// ── HTML ──────────────────────────────────────────────────
	{
		displayName: 'HTML',
		name: 'html',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
		default: '',
		placeholder: '<div data-composition-id="main" data-start="0" data-width="1920" data-height="1080">...</div>',
		description: 'The HTML composition to render. Use GSAP for animations, CSS for styling, and Hyperframes data attributes for timing. The HTML will be Base64-encoded before sending to the API.',
	},

	// ── Width ──────────────────────────────────────────────────
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
		typeOptions: { minValue: 1, maxValue: 3840 },
		default: 1920,
		description: 'Video width in pixels (max 3840)',
	},

	// ── Height ─────────────────────────────────────────────────
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
		typeOptions: { minValue: 1, maxValue: 3840 },
		default: 1080,
		description: 'Video height in pixels (max 3840)',
	},

	// ── FPS ────────────────────────────────────────────────────
	{
		displayName: 'FPS',
		name: 'fps',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
		typeOptions: { minValue: 1, maxValue: 120 },
		default: 30,
		description: 'Frames per second',
	},

	// ── Output Format ────────────────────────────────────────
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
		options: [
			{ name: 'MP4 (Recommended)', value: 'mp4' },
			{ name: 'MOV', value: 'mov' },
		],
		default: 'mp4',
		description: 'Choose the format for your output video',
	},

	// ── How to Get the Result ─────────────────────────────────
	{
		displayName: 'How to Get the Result',
		name: 'outputType',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
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
		displayOptions: { show: { ...showFor, operation: ['createHtml'], outputType: ['signed_url'] } },
		typeOptions: { minValue: 60, maxValue: 86400 },
		default: 3600,
		description: 'How long the download link stays active. Default: 1 hour (3600 seconds).',
	},

	// ── Variables ─────────────────────────────────────────────
	{
		displayName: 'Variables',
		name: 'htmlVariables',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Variable',
		},
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
		default: {},
		options: [
			{
				name: 'variableValues',
				displayName: 'Variable',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'headline',
						description: 'Variable name — available in HTML as window.__hfVariables.name',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Summer Sale!',
						description: 'The value to inject',
					},
				],
			},
		],
		description: 'Key-value pairs injected as window.__hfVariables in the HTML composition',
	},

	// ── Advanced Settings ────────────────────────────────────
	{
		displayName: 'Advanced Settings',
		name: 'outputOptions',
		type: 'collection',
		placeholder: 'Add Setting',
		displayOptions: { show: { ...showFor, operation: ['createHtml'] } },
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
];
