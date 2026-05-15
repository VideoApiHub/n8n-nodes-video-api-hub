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
				name: 'Get Result',
				value: 'getResult',
				action: 'Get the result of a job',
				description: 'Check status and get the result — returns status if still processing, or the finished output',
			},
		],
		default: 'getResult',
	},

	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForJob, operation: ['getResult'] } },
		default: '',
		placeholder: 'abc123-def456',
		description: 'The Task ID returned when you submitted the job',
	},
	{
		displayName: 'Return As',
		name: 'resultResponseType',
		type: 'options',
		displayOptions: { show: { ...showForJob, operation: ['getResult'] } },
		options: [
			{
				name: 'Auto (Use Job Settings)',
				value: 'auto',
				description: 'Use the output type set when the job was created',
			},
			{
				name: 'File',
				value: 'file',
				description: 'Download the output file directly',
			},
			{
				name: 'Public URL',
				value: 'public_url',
				description: 'Get a permanent public link — no authentication needed',
			},
			{
				name: 'Download Link',
				value: 'url',
				description: 'Get a temporary download URL',
			},
		],
		default: 'auto',
		description: 'How to return the result when the job is complete',
	},
];
