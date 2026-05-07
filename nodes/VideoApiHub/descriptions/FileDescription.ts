import type { INodeProperties } from 'n8n-workflow';

const showForFile = { resource: ['file'] };

export const fileDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForFile },
		options: [
			{
				name: 'Get Upload Link',
				value: 'getUploadLink',
				action: 'Get a link to upload a file',
				description: 'Get a temporary link to upload a file to your storage',
			},
			{
				name: 'Get Download Link',
				value: 'getDownloadLink',
				action: 'Get a link to download a file',
				description: 'Get a temporary link to download a file from your storage',
			},
		],
		default: 'getUploadLink',
	},

	// ── Get Upload Link ──────────────────────────────────────
	{
		displayName: 'File Type',
		name: 'contentType',
		type: 'options',
		required: true,
		displayOptions: { show: { ...showForFile, operation: ['getUploadLink'] } },
		options: [
			{ name: 'Video - MP4', value: 'video/mp4' },
			{ name: 'Video - WebM', value: 'video/webm' },
			{ name: 'Video - MOV', value: 'video/quicktime' },
			{ name: 'Video - MKV', value: 'video/x-matroska' },
			{ name: 'Audio - MP3', value: 'audio/mpeg' },
			{ name: 'Audio - WAV', value: 'audio/wav' },
			{ name: 'Image - JPEG', value: 'image/jpeg' },
			{ name: 'Image - PNG', value: 'image/png' },
			{ name: 'Image - GIF', value: 'image/gif' },
		],
		default: 'video/mp4',
		description: 'The type of file you want to upload',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForFile, operation: ['getUploadLink'] } },
		default: '',
		placeholder: 'my-video.mp4',
		description: 'Name of the file you are uploading',
	},
	{
		displayName: 'Display Name',
		name: 'fileDisplayName',
		type: 'string',
		displayOptions: { show: { ...showForFile, operation: ['getUploadLink'] } },
		default: '',
		placeholder: 'My awesome video',
		description: 'A friendly name for the file (optional)',
	},

	// ── Get Download Link ────────────────────────────────────
	{
		displayName: 'File Path',
		name: 'fileKey',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForFile, operation: ['getDownloadLink'] } },
		default: '',
		placeholder: 'outputs/result.mp4',
		description: 'Path of the file in your storage',
	},
];
