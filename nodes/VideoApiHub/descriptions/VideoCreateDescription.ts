import type { INodeProperties } from 'n8n-workflow';

/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-fixed-collection-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */

const showFor = { resource: ['videoCreate'] };

const allOps = ['createFromDesign', 'slideshow', 'merge'];

export const videoCreateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Create from Design',
				value: 'createFromDesign',
				action: 'Create a video from a design',
				description: 'Build a video with text, images, shapes, and animations',
			},
			{
				name: 'Create Slideshow',
				value: 'slideshow',
				action: 'Create a slideshow from images',
				description: 'Turn a series of images into a video with optional music',
			},
			{
				name: 'Merge Videos',
				value: 'merge',
				action: 'Merge multiple videos into one',
				description: 'Join several videos together, played one after another',
			},
		],
		default: 'createFromDesign',
	},

	// ── Output Format ────────────────────────────────────────
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: allOps } },
		options: [
			{ name: 'MP4 (Recommended)', value: 'mp4' },
			{ name: 'MOV', value: 'mov' },
			{ name: 'WebM', value: 'webm' },
			{ name: 'MKV', value: 'mkv' },
		],
		default: 'mp4',
		description: 'Choose the format for your output video',
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
				placeholder: 'my-folder/result.mp4',
				description: 'Where to save the result in your storage. Leave empty to auto-generate.',
			},
		],
	},
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Videos to Merge',
		name: 'videoKeys',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Video',
		},
		required: true,
		displayOptions: { show: { ...showFor, operation: ['merge'] } },
		default: {},
		options: [
			{
				name: 'videoValues',
				displayName: 'Video',
				values: [
					{
						displayName: 'Video Source',
						name: 'source',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/intro.mp4',
						description: 'Link to the video, or a file path from your storage',
					},
				],
			},
		],
		description: 'Videos to concatenate in order',
	},

	// ═══════════════════════════════════════════════════════════
	// SLIDESHOW
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Slides',
		name: 'slides',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Slide',
		},
		required: true,
		displayOptions: { show: { ...showFor, operation: ['slideshow'] } },
		default: {},
		options: [
			{
				name: 'slideValues',
				displayName: 'Slide',
				values: [
					{
						displayName: 'Image File',
						name: 'imageKey',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/slide1.jpg',
						description: 'Link to the image, or a file path from your storage',
					},
					{
						displayName: 'Show For (Seconds)',
						name: 'durationSeconds',
						type: 'number',
						typeOptions: { minValue: 0.1, numberPrecision: 1 },
						default: 3,
						description: 'How long to display this image',
					},
				],
			},
		],
		description: 'The images to include in the slideshow, in order',
	},
	{
		displayName: 'Background Music',
		name: 'slideshowAudioKey',
		type: 'string',
		displayOptions: { show: { ...showFor, operation: ['slideshow'] } },
		default: '',
		placeholder: 'https://example.com/music.mp3',
		description: 'Link to an audio file for background music (optional)',
	},

	// ═══════════════════════════════════════════════════════════
	// CREATE FROM DESIGN
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Canvas Size',
		name: 'canvasPreset',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['createFromDesign'] } },
		options: [
			{ name: '1920 × 1080 (Landscape / YouTube)', value: '1920x1080' },
			{ name: '1080 × 1920 (Portrait / Reels / TikTok)', value: '1080x1920' },
			{ name: '1080 × 1080 (Square / Instagram)', value: '1080x1080' },
			{ name: '1280 × 720 (HD Landscape)', value: '1280x720' },
			{ name: '720 × 1280 (HD Portrait)', value: '720x1280' },
			{ name: 'Custom', value: 'custom' },
		],
		default: '1920x1080',
		description: 'Size of the video canvas',
	},
	{
		displayName: 'Width (Pixels)',
		name: 'canvasWidth',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['createFromDesign'], canvasPreset: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1920,
	},
	{
		displayName: 'Height (Pixels)',
		name: 'canvasHeight',
		type: 'number',
		displayOptions: {
			show: { ...showFor, operation: ['createFromDesign'], canvasPreset: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1080,
	},
	{
		displayName: 'Video Length (Seconds)',
		name: 'designDuration',
		type: 'number',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['createFromDesign'] } },
		typeOptions: { minValue: 0.01, maxValue: 300, numberPrecision: 1 },
		default: 10,
		description: 'How long the video should be',
	},
	{
		displayName: 'Frames Per Second',
		name: 'fps',
		type: 'number',
		displayOptions: { show: { ...showFor, operation: ['createFromDesign'] } },
		typeOptions: { minValue: 1, maxValue: 60 },
		default: 30,
		description: 'Smoothness of the video (30 is standard)',
	},
	{
		displayName: 'Background Type',
		name: 'backgroundType',
		type: 'options',
		displayOptions: { show: { ...showFor, operation: ['createFromDesign'] } },
		options: [
			{ name: 'Solid Color', value: 'solid' },
			{ name: 'Gradient', value: 'gradient' },
		],
		default: 'solid',
	},
	{
		displayName: 'Background Color',
		name: 'backgroundColor',
		type: 'color',
		displayOptions: {
			show: { ...showFor, operation: ['createFromDesign'], backgroundType: ['solid'] },
		},
		default: '#000000',
		description: 'Background color for the video',
	},
	{
		displayName: 'Gradient Start Color',
		name: 'gradientFrom',
		type: 'color',
		displayOptions: {
			show: { ...showFor, operation: ['createFromDesign'], backgroundType: ['gradient'] },
		},
		default: '#000000',
		description: 'First color of the gradient',
	},
	{
		displayName: 'Gradient End Color',
		name: 'gradientTo',
		type: 'color',
		displayOptions: {
			show: { ...showFor, operation: ['createFromDesign'], backgroundType: ['gradient'] },
		},
		default: '#FFFFFF',
		description: 'Second color of the gradient',
	},
	{
		displayName: 'Gradient Direction',
		name: 'gradientDirection',
		type: 'options',
		displayOptions: {
			show: { ...showFor, operation: ['createFromDesign'], backgroundType: ['gradient'] },
		},
		options: [
			{ name: 'Top to Bottom', value: 'vertical' },
			{ name: 'Left to Right', value: 'horizontal' },
			{ name: 'Diagonal', value: 'diagonal' },
		],
		default: 'vertical',
	},
	{
		displayName: 'Layers',
		name: 'designLayers',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Layer',
			sortable: true,
		},
		displayOptions: { show: { ...showFor, operation: ['createFromDesign'] } },
		default: {},
		description: 'Visual elements stacked on the video. Later layers appear on top.',
		options: [
			{
				name: 'layerValues',
				displayName: 'Layer',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Text', value: 'text' },
							{ name: 'Image', value: 'image' },
							{ name: 'GIF', value: 'gif' },
							{ name: 'Video Clip', value: 'video' },
							{ name: 'Audio', value: 'audio' },
							{ name: 'Rectangle', value: 'rectangle' },
							{ name: 'Circle', value: 'circle' },
						],
						default: 'text',
						description: 'What kind of element to add',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						typeOptions: { rows: 2 },
						default: '',
						placeholder: 'Hello World',
						description: 'The text to display (for Text layers)',
					},
					{
						displayName: 'File Path',
						name: 'key',
						type: 'string',
						default: '',
						placeholder: 'uploads/logo.png',
						description: 'Path to the file in your storage (for Image, GIF, Video, Audio layers)',
					},
					{
						displayName: 'Or URL',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/image.png',
						description: 'Direct link to a file instead of using storage',
					},
					{
						displayName: 'Color',
						name: 'color',
						type: 'color',
						default: '#000000CC',
						description: 'Fill color (for Rectangle and Circle layers)',
					},
					{
						displayName: 'X Position',
						name: 'x',
						type: 'number',
						typeOptions: { minValue: 0 },
						default: 0,
						description: 'Horizontal position from the left edge (in pixels)',
					},
					{
						displayName: 'Y Position',
						name: 'y',
						type: 'number',
						typeOptions: { minValue: 0 },
						default: 0,
						description: 'Vertical position from the top edge (in pixels)',
					},
					{
						displayName: 'Width',
						name: 'width',
						type: 'number',
						typeOptions: { minValue: 0 },
						default: 0,
						description: 'Width in pixels (0 = auto)',
					},
					{
						displayName: 'Height',
						name: 'height',
						type: 'number',
						typeOptions: { minValue: 0 },
						default: 0,
						description: 'Height in pixels (0 = auto)',
					},
					{
						displayName: 'Appears At (Seconds)',
						name: 'startSeconds',
						type: 'number',
						typeOptions: { minValue: 0, numberPrecision: 1 },
						default: 0,
						description: 'When this layer appears in the video',
					},
					{
						displayName: 'Visible For (Seconds)',
						name: 'durationSeconds',
						type: 'number',
						typeOptions: { minValue: 0, numberPrecision: 1 },
						default: 0,
						description: 'How long this layer stays visible (0 = entire video)',
					},
					{
						displayName: 'Style',
						name: 'style',
						type: 'collection',
						placeholder: 'Add Style Option',
						default: {},
						options: [
							{
								displayName: 'Opacity',
								name: 'opacity',
								type: 'number',
								typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 1 },
								default: 1,
								description: 'Transparency (0 = invisible, 1 = fully visible)',
							},
							{
								displayName: 'Animation',
								name: 'animation',
								type: 'options',
								options: [
									{ name: 'None', value: 'none' },
									{ name: 'Fade In', value: 'fade_in' },
									{ name: 'Fade Out', value: 'fade_out' },
									{ name: 'Slide Left', value: 'slide_left' },
									{ name: 'Slide Right', value: 'slide_right' },
									{ name: 'Slide Up', value: 'slide_up' },
									{ name: 'Slide Down', value: 'slide_down' },
									{ name: 'Slide Left Out', value: 'slide_left_out' },
									{ name: 'Slide Right Out', value: 'slide_right_out' },
									{ name: 'Slide Up Out', value: 'slide_up_out' },
									{ name: 'Slide Down Out', value: 'slide_down_out' },
									{ name: 'Pop In (Bubble)', value: 'bubble' },
									{ name: 'Zoom In', value: 'zoom_in' },
									{ name: 'Zoom Out', value: 'zoom_out' },
									{ name: 'Typewriter (Text Only)', value: 'typewriter' },
								],
								default: 'none',
								description: 'Entrance or exit animation',
							},
							{
								displayName: 'Animation Speed',
								name: 'animationSpeed',
								type: 'number',
								typeOptions: { minValue: 0.25, maxValue: 10, numberPrecision: 1 },
								default: 1,
								description: 'How fast the animation plays (1 = normal)',
							},
							{
								displayName: 'Font',
								name: 'fontFamily',
								type: 'options',
								options: [
									{ name: 'Default (DejaVu Sans)', value: '' },
									{ name: 'Inter', value: 'Inter' },
									{ name: 'Noto Sans', value: 'Noto Sans' },
									{ name: 'Noto Serif', value: 'Noto Serif' },
									{ name: 'DejaVu Sans', value: 'DejaVu Sans' },
									{ name: 'DejaVu Serif', value: 'DejaVu Serif' },
									{ name: 'DejaVu Sans Mono', value: 'DejaVu Sans Mono' },
								],
								default: '',
								description: 'Font family (for Text layers)',
							},
							{
								displayName: 'Custom Font File',
								name: 'fontFileKey',
								type: 'string',
								default: '',
								placeholder: 'uploads/my-font.ttf',
								description: 'Path to a custom .ttf font in your storage (overrides Font)',
							},
							{
								displayName: 'Font Size',
								name: 'fontSize',
								type: 'number',
								typeOptions: { minValue: 1 },
								default: 64,
								description: 'Text size in pixels (for Text layers)',
							},
							{
								displayName: 'Font Color',
								name: 'fontColor',
								type: 'color',
								default: '#FFFFFF',
								description: 'Text color (for Text layers)',
							},
							{
								displayName: 'Font Weight',
								name: 'fontWeight',
								type: 'options',
								options: [
									{ name: 'Light', value: 300 },
									{ name: 'Regular', value: 400 },
									{ name: 'Semi Bold', value: 600 },
									{ name: 'Bold', value: 700 },
									{ name: 'Extra Bold', value: 800 },
								],
								default: 700,
								description: 'How thick the text appears (for Text layers)',
							},
							{
								displayName: 'Font Style',
								name: 'fontStyle',
								type: 'options',
								options: [
									{ name: 'Normal', value: 'normal' },
									{ name: 'Italic', value: 'italic' },
								],
								default: 'normal',
								description: 'Normal or italic (for Text layers)',
							},
							{
								displayName: 'Text Alignment',
								name: 'align',
								type: 'options',
								options: [
									{ name: 'Left', value: 'left' },
									{ name: 'Center', value: 'center' },
									{ name: 'Right', value: 'right' },
								],
								default: 'left',
								description: 'Horizontal text alignment (for Text layers)',
							},
							{
								displayName: 'Text Background',
								name: 'textBg',
								type: 'color',
								default: '',
								description: 'Background color behind text with padding (for Text layers)',
							},
						],
					},
				],
			},
		],
	},
];
