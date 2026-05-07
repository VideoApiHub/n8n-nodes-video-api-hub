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
		],
		default: 'getStatus',
	},

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
];
