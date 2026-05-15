import type { INodeProperties } from 'n8n-workflow';

const showForTemplate = { resource: ['template'] };

export const templateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForTemplate },
		options: [
			{
				name: 'Render',
				value: 'render',
				action: 'Create a video from a template',
				description: 'Generate a video by filling in a saved template with your content',
			},
		],
		default: 'render',
	},

	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForTemplate, operation: ['render'] } },
		default: '',
		placeholder: 'e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6',
		description: 'The ID of the template to use',
	},
	{
		displayName: 'Output File Name',
		name: 'templateOutputKey',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForTemplate, operation: ['render'] } },
		default: 'default.mp4',
		placeholder: 'my-promo-video.mp4',
		description: 'Name for the output video file',
	},
	{
		displayName: 'Variables',
		name: 'templateVariables',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Variable',
		},
		displayOptions: { show: { ...showForTemplate, operation: ['render'] } },
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
						description: 'The variable name defined in the template',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Summer Sale!',
						description: 'The value to fill in',
					},
				],
			},
		],
		description: 'Fill in the template variables with your content',
	},
];
