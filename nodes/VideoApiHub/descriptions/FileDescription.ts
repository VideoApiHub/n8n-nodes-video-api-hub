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
				name: 'Upload File',
				value: 'uploadFile',
				action: 'Upload a file',
				description: 'Upload a file directly to your storage',
			},
			{
				name: 'Download File',
				value: 'downloadFile',
				action: 'Download a file',
				description: 'Download a file from your storage',
			},
		],
		default: 'uploadFile',
	},

	// ── Upload File ──────────────────────────────────────────
	{
		displayName: 'Input Data Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForFile, operation: ['uploadFile'] } },
		default: 'data',
		description: 'Name of the field containing your file from a previous step. The default "data" works in most cases.',
	},

	// ── Download File ────────────────────────────────────────
	{
		displayName: 'File Path',
		name: 'fileKey',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForFile, operation: ['downloadFile'] } },
		default: '',
		placeholder: 'outputs/result.mp4',
		description: 'Path of the file in your storage',
	},
	{
		displayName: 'Return As',
		name: 'downloadResponseType',
		type: 'options',
		displayOptions: { show: { ...showForFile, operation: ['downloadFile'] } },
		options: [
			{
				name: 'File',
				value: 'file',
				description: 'Download the file directly as binary data',
			},
			{
				name: 'Download Link',
				value: 'url',
				description: 'Get a temporary download URL',
			},
		],
		default: 'file',
		description: 'How to return the file',
	},
];
