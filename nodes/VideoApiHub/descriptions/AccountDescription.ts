import type { INodeProperties } from 'n8n-workflow';

const showForAccount = { resource: ['account'] };

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForAccount },
		options: [
			{
				name: 'My Account',
				value: 'me',
				action: 'Get your account info and usage',
				description: 'See your plan, API key details, and current usage',
			},
			{
				name: 'Health Check',
				value: 'healthCheck',
				action: 'Check if the service is running',
				description: 'Verify that Video Api Hub is up and running',
			},
			{
				name: 'View Plans',
				value: 'viewPlans',
				action: 'View available plans and pricing',
				description: 'See the available subscription plans and their features',
			},
		],
		default: 'me',
	},
];
