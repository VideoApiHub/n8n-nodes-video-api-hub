import type { INodeProperties } from 'n8n-workflow';

const showFor = { resource: ['videoReact'] };

export const videoReactDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Create React Video',
				value: 'createReact',
				action: 'Create a video from a react component',
				description: 'Render a React/Remotion component to video',
			},
		],
		default: 'createReact',
	},

	// ── Component Code ───────────────────────────────────────
	{
		displayName: 'Component Code',
		name: 'componentCode',
		type: 'string',
		typeOptions: {
			rows: 12,
		},
		required: true,
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		default: '',
		placeholder: "import React from 'react';\nexport default function Scene() { return <div>Hello</div>; }",
		description: 'React/TSX source code. Must export default. Max 120 KB. Only react and remotion imports are allowed.',
	},

	// ── Props ─────────────────────────────────────────────────
	{
		displayName: 'Props (JSON)',
		name: 'props',
		type: 'json',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		default: '{}',
		description: 'JSON props passed to the React component',
	},

	// ── Width ─────────────────────────────────────────────────
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		typeOptions: { minValue: 320, maxValue: 3840 },
		default: 1920,
		description: 'Video width in pixels (320–3840)',
	},

	// ── Height ────────────────────────────────────────────────
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		typeOptions: { minValue: 320, maxValue: 3840 },
		default: 1080,
		description: 'Video height in pixels (320–3840)',
	},

	// ── FPS ───────────────────────────────────────────────────
	{
		displayName: 'FPS',
		name: 'fps',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		typeOptions: { minValue: 1, maxValue: 120 },
		default: 30,
		description: 'Frames per second (1–120)',
	},

	// ── Duration in Seconds ──────────────────────────────────
	{
		displayName: 'Duration in Seconds',
		name: 'durationInSeconds',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		typeOptions: { minValue: 1, maxValue: 600 },
		default: 20,
		description: 'Total duration of the video in seconds (1–600)',
	},

	// ── Codec ─────────────────────────────────────────────────
	{
		displayName: 'Codec',
		name: 'codec',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		options: [
			{ name: 'H.264 (Default)', value: 'h264' },
			{ name: 'H.265', value: 'h265' },
			{ name: 'ProRes', value: 'prores' },
			{ name: 'VP8', value: 'vp8' },
			{ name: 'VP9', value: 'vp9' },
		],
		default: 'h264',
		description: 'Video codec to use for encoding',
	},

	// ── Output Format ────────────────────────────────────────
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
		options: [
			{ name: 'MP4 (Recommended)', value: 'mp4' },
			{ name: 'WebM', value: 'webm' },
		],
		default: 'mp4',
		description: 'Choose the format for your output video',
	},

	// ── How to Get the Result ────────────────────────────────
	{
		displayName: 'How to Get the Result',
		name: 'outputType',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
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
		displayOptions: { show: { ...showFor, operation: ['createReact'], outputType: ['signed_url'] } },
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
		displayOptions: { show: { ...showFor, operation: ['createReact'] } },
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
