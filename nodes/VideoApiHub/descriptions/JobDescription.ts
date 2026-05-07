import type { INodeProperties } from 'n8n-workflow';

const showForJob = { resource: ['job'] };

export const jobDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForJob },
		options: [
			{
				name: 'Check Status',
				value: 'getStatus',
				action: 'Check the status of a job',
				description: 'See if a video job is queued, processing, completed, or failed',
			},
			{
				name: 'Get Result',
				value: 'getResult',
				action: 'Get the result of a completed job',
				description: 'Download the output file or get a download link',
			},
		],
		default: 'getStatus',
	},

	// ── Check Status ─────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForJob, operation: ['getStatus'] } },
		default: '',
		placeholder: 'abc123-def456',
		description: 'The Task ID returned when you submitted the job',
	},

	// ── Get Result ───────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'resultTaskId',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForJob, operation: ['getResult'] } },
		default: '',
		placeholder: 'abc123-def456',
		description: 'The Task ID of the completed job',
	},
	{
		displayName: 'Return As',
		name: 'resultResponseType',
		type: 'options',
		displayOptions: { show: { ...showForJob, operation: ['getResult'] } },
		options: [
			{
				name: 'File',
				value: 'file',
				description: 'Download the output file directly',
			},
			{
				name: 'Download Link',
				value: 'url',
				description: 'Get a temporary download URL',
			},
		],
		default: 'file',
		description: 'How to return the result',
	},
];
