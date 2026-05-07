import type { INodeProperties } from 'n8n-workflow';

const showForVideo = { resource: ['video'] };

const opsWithInput = [
	'clip',
	'multiClip',
	'thumbnail',
	'screenshots',
	'removeAudio',
	'extractAudio',
	'addAudio',
	'convertFormat',
	'resize',
	'thumbnailWithText',
	'customCommand',
];

const allVideoOps = [...opsWithInput, 'slideshow', 'createFromDesign'];

export const videoDescription: INodeProperties[] = [
	// ── Operation selector ───────────────────────────────────
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForVideo },
		options: [
			// ── Create ──────────────────────────────
			{
				name: 'Create from Design',
				value: 'createFromDesign',
				action: 'Create a video from a design',
				description: 'Build a video from a JSON design with text, images, and shapes',
			},
			{
				name: 'Create Slideshow',
				value: 'slideshow',
				action: 'Create a video from images',
				description: 'Turn a series of images into a video with optional music',
			},
			// ── Edit ────────────────────────────────
			{
				name: 'Clip',
				value: 'clip',
				action: 'Cut a section from a video',
				description: 'Extract a specific time range from your video',
			},
			{
				name: 'Extract Multiple Clips',
				value: 'multiClip',
				action: 'Cut multiple sections from a video',
				description: 'Extract several time ranges from your video at once',
			},
			{
				name: 'Resize',
				value: 'resize',
				action: 'Resize a video',
				description: 'Change the dimensions or aspect ratio of your video',
			},
			{
				name: 'Convert Format',
				value: 'convertFormat',
				action: 'Convert a video to another format',
				description: 'Change the file format of your video',
			},
			// ── Audio ───────────────────────────────
			{
				name: 'Add Audio',
				value: 'addAudio',
				action: 'Add audio to a video',
				description: 'Add background music or replace the existing audio',
			},
			{
				name: 'Remove Audio',
				value: 'removeAudio',
				action: 'Remove audio from a video',
				description: 'Remove the sound track from your video',
			},
			{
				name: 'Extract Audio',
				value: 'extractAudio',
				action: 'Extract audio from a video',
				description: 'Save the audio track from your video as an MP3 file',
			},
			// ── Thumbnails ──────────────────────────
			{
				name: 'Get Thumbnail',
				value: 'thumbnail',
				action: 'Capture a frame as an image',
				description: 'Save a single frame from your video as a JPEG image',
			},
			{
				name: 'Thumbnail with Text',
				value: 'thumbnailWithText',
				action: 'Create a thumbnail with text overlay',
				description: 'Capture a frame and add text or a logo on top',
			},
			{
				name: 'Take Screenshots',
				value: 'screenshots',
				action: 'Capture multiple frames as images',
				description: 'Save multiple frames from your video as JPEG images',
			},
			// ── Advanced ────────────────────────────
			{
				name: 'Run Custom Command',
				value: 'customCommand',
				action: 'Run a custom video command',
				description: 'Run a custom FFmpeg command for advanced processing',
			},
		],
		default: 'createFromDesign',
	},

	// ── Shared: Source File ──────────────────────────────────
	{
		displayName: 'Source File',
		name: 'inputKey',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForVideo, operation: opsWithInput } },
		default: '',
		placeholder: 'uploads/my-video.mp4',
		description: 'Path to your file in Video Api Hub storage',
	},

	// ── Shared: Save Result As ───────────────────────────────
	{
		displayName: 'Save Result As',
		name: 'outputKey',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForVideo, operation: allVideoOps } },
		default: 'default.mp4',
		placeholder: 'my-video.mp4',
		description: 'File name for the result (e.g. my-clip.mp4)',
	},

	// ═══════════════════════════════════════════════════════════
	// CLIP
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Start At (Seconds)',
		name: 'startSeconds',
		type: 'number',
		displayOptions: { show: { ...showForVideo, operation: ['clip'] } },
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 0,
		description: 'When to start cutting (in seconds from the beginning)',
	},
	{
		displayName: 'Length (Seconds)',
		name: 'durationSeconds',
		type: 'number',
		displayOptions: { show: { ...showForVideo, operation: ['clip'] } },
		typeOptions: { minValue: 0.1, numberPrecision: 1 },
		default: 5,
		description: 'How long the clip should be',
	},

	// ═══════════════════════════════════════════════════════════
	// MULTI CLIP
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Clip Mode',
		name: 'clipMode',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['multiClip'] } },
		options: [
			{
				name: 'Pick Specific Segments',
				value: 'custom',
				description: 'Choose exact start times and durations for each clip',
			},
			{
				name: 'Evenly Spaced Clips',
				value: 'even',
				description: 'Create clips at regular intervals',
			},
		],
		default: 'custom',
	},
	{
		displayName: 'Segments',
		name: 'segments',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Segment',
		},
		displayOptions: {
			show: { ...showForVideo, operation: ['multiClip'], clipMode: ['custom'] },
		},
		default: {},
		options: [
			{
				name: 'segmentValues',
				displayName: 'Segment',
				values: [
					{
						displayName: 'Start At (Seconds)',
						name: 'startSeconds',
						type: 'number',
						typeOptions: { minValue: 0, numberPrecision: 1 },
						default: 0,
						description: 'When this segment starts',
					},
					{
						displayName: 'Length (Seconds)',
						name: 'durationSeconds',
						type: 'number',
						typeOptions: { minValue: 0.1, numberPrecision: 1 },
						default: 5,
						description: 'How long this segment lasts',
					},
				],
			},
		],
		description: 'The segments you want to extract',
	},
	{
		displayName: 'Start At (Seconds)',
		name: 'evenStartSeconds',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 0,
		description: 'When to start the first clip',
	},
	{
		displayName: 'Each Clip Length (Seconds)',
		name: 'evenDurationSeconds',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 0.1, numberPrecision: 1 },
		default: 4,
		description: 'How long each clip should be',
	},
	{
		displayName: 'Gap Between Clips (Seconds)',
		name: 'gapSeconds',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 0,
		description: 'Time to skip between each clip',
	},
	{
		displayName: 'Number of Clips',
		name: 'clipCount',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['multiClip'], clipMode: ['even'] },
		},
		typeOptions: { minValue: 1 },
		default: 3,
		description: 'How many clips to create',
	},

	// ═══════════════════════════════════════════════════════════
	// THUMBNAIL
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Capture At (Seconds)',
		name: 'atSecond',
		type: 'number',
		displayOptions: { show: { ...showForVideo, operation: ['thumbnail'] } },
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 1,
		description: 'The time in the video to capture the image from',
	},

	// ═══════════════════════════════════════════════════════════
	// SCREENSHOTS
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Mode',
		name: 'screenshotMode',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['screenshots'] } },
		options: [
			{
				name: 'Fixed Number of Screenshots',
				value: 'count',
				description: 'Take a set number of screenshots, one per second from the start',
			},
			{
				name: 'At Specific Times',
				value: 'timestamps',
				description: 'Take screenshots at exact times you choose',
			},
			{
				name: 'Random',
				value: 'random',
				description: 'Take screenshots at random moments in the video',
			},
		],
		default: 'count',
	},
	{
		displayName: 'Number of Screenshots',
		name: 'screenshotCount',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['screenshots'], screenshotMode: ['count', 'random'] },
		},
		typeOptions: { minValue: 1 },
		default: 3,
		description: 'How many screenshots to capture',
	},
	{
		displayName: 'Times (Seconds)',
		name: 'timestamps',
		type: 'string',
		displayOptions: {
			show: {
				...showForVideo,
				operation: ['screenshots'],
				screenshotMode: ['timestamps'],
			},
		},
		default: '',
		placeholder: '1.5, 10, 30, 60',
		description: 'Comma-separated list of times to capture screenshots at (in seconds)',
	},
	{
		displayName: 'Video Length (Seconds)',
		name: 'videoDuration',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['screenshots'], screenshotMode: ['random'] },
		},
		typeOptions: { minValue: 0.1, numberPrecision: 1 },
		default: 60,
		description: 'Total length of your video in seconds (needed for random mode)',
	},

	// ═══════════════════════════════════════════════════════════
	// ADD AUDIO
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Audio File',
		name: 'audioKey',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForVideo, operation: ['addAudio'] } },
		default: '',
		placeholder: 'uploads/background-music.mp3',
		description: 'Path to the audio file in your storage',
	},
	{
		displayName: 'Audio Mode',
		name: 'mixMode',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['addAudio'] } },
		options: [
			{
				name: 'Replace Original Audio',
				value: 'replace',
				description: 'Remove the original audio and use only the new audio',
			},
			{
				name: 'Mix with Original Audio',
				value: 'mix',
				description: 'Play the new audio on top of the original audio',
			},
		],
		default: 'replace',
	},
	{
		displayName: 'Audio Options',
		name: 'audioOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: { show: { ...showForVideo, operation: ['addAudio'] } },
		default: {},
		options: [
			{
				displayName: 'Volume',
				name: 'volume',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 1 },
				default: 1,
				description: 'Volume level (0 = silent, 1 = normal, 2 = double volume)',
			},
			{
				displayName: 'Start Audio From (Seconds)',
				name: 'audioStartSeconds',
				type: 'number',
				typeOptions: { minValue: 0, numberPrecision: 1 },
				default: 0,
				description: 'Skip ahead in the audio file and start from this point',
			},
			{
				displayName: 'Delay Audio By (Seconds)',
				name: 'videoOffsetSeconds',
				type: 'number',
				typeOptions: { minValue: 0, numberPrecision: 1 },
				default: 0,
				description: 'Wait this many seconds into the video before the audio begins',
			},
			{
				displayName: 'Max Audio Length (Seconds)',
				name: 'audioDurationSeconds',
				type: 'number',
				typeOptions: { minValue: 0, numberPrecision: 1 },
				default: 0,
				description: 'Maximum length of audio to use (0 = use full audio)',
			},
		],
	},

	// ═══════════════════════════════════════════════════════════
	// CONVERT FORMAT
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Target Format',
		name: 'targetFormat',
		type: 'options',
		required: true,
		displayOptions: { show: { ...showForVideo, operation: ['convertFormat'] } },
		options: [
			{ name: 'MP4', value: 'mp4' },
			{ name: 'WebM', value: 'webm' },
			{ name: 'MOV', value: 'mov' },
			{ name: 'MKV', value: 'mkv' },
		],
		default: 'mp4',
		description: 'The format to convert your video to',
	},

	// ═══════════════════════════════════════════════════════════
	// RESIZE
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Size Mode',
		name: 'sizeMode',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['resize'] } },
		options: [
			{
				name: 'Choose a Preset Ratio',
				value: 'preset',
				description: 'Pick from common aspect ratios like 16:9 or 9:16',
			},
			{
				name: 'Enter Custom Size',
				value: 'custom',
				description: 'Set exact width and height in pixels',
			},
		],
		default: 'preset',
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		displayOptions: {
			show: { ...showForVideo, operation: ['resize'], sizeMode: ['preset'] },
		},
		options: [
			{ name: '16:9 (Landscape / YouTube)', value: '16:9' },
			{ name: '9:16 (Portrait / Reels / TikTok)', value: '9:16' },
			{ name: '1:1 (Square / Instagram)', value: '1:1' },
			{ name: '4:3 (Classic)', value: '4:3' },
			{ name: '4:5 (Portrait / Facebook)', value: '4:5' },
			{ name: '21:9 (Ultra-wide)', value: '21:9' },
		],
		default: '16:9',
		description: 'The shape to resize your video to',
	},
	{
		displayName: 'Width (Pixels)',
		name: 'customWidth',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['resize'], sizeMode: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1920,
		description: 'Width of the output video',
	},
	{
		displayName: 'Height (Pixels)',
		name: 'customHeight',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['resize'], sizeMode: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1080,
		description: 'Height of the output video',
	},
	{
		displayName: 'Fit Mode',
		name: 'fitMode',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['resize'] } },
		options: [
			{
				name: 'Fill & Crop (No Bars)',
				value: 'cover',
				description: 'Scale and crop to completely fill the frame',
			},
			{
				name: 'Fit Inside (May Add Bars)',
				value: 'contain',
				description: 'Scale to fit inside the frame, adding black bars if needed',
			},
		],
		default: 'cover',
	},

	// ═══════════════════════════════════════════════════════════
	// THUMBNAIL WITH TEXT
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Capture At (Seconds)',
		name: 'textThumbAtSecond',
		type: 'number',
		displayOptions: { show: { ...showForVideo, operation: ['thumbnailWithText'] } },
		typeOptions: { minValue: 0, numberPrecision: 1 },
		default: 2,
		description: 'The time in the video to capture the background image from',
	},
	{
		displayName: 'Overlay Text',
		name: 'overlayText',
		type: 'string',
		displayOptions: { show: { ...showForVideo, operation: ['thumbnailWithText'] } },
		default: '',
		placeholder: 'Episode 1',
		description: 'Text to display on the thumbnail (leave empty if using only an overlay image)',
	},
	{
		displayName: 'Text Position',
		name: 'textPosition',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['thumbnailWithText'] } },
		options: [
			{ name: 'Top Left', value: 'top_left' },
			{ name: 'Top Center', value: 'top_center' },
			{ name: 'Top Right', value: 'top_right' },
			{ name: 'Center', value: 'center' },
			{ name: 'Bottom Left', value: 'bottom_left' },
			{ name: 'Bottom Center', value: 'bottom_center' },
			{ name: 'Bottom Right', value: 'bottom_right' },
		],
		default: 'bottom_center',
		description: 'Where to place the text on the image',
	},
	{
		displayName: 'Text & Overlay Options',
		name: 'thumbnailTextOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: { show: { ...showForVideo, operation: ['thumbnailWithText'] } },
		default: {},
		options: [
			{
				displayName: 'Font Size',
				name: 'fontSize',
				type: 'number',
				typeOptions: { minValue: 8, maxValue: 200 },
				default: 46,
				description: 'Size of the text',
			},
			{
				displayName: 'Font Color',
				name: 'fontColor',
				type: 'string',
				default: 'white',
				description: 'Color of the text (name like "white" or hex like "#FF0000")',
			},
			{
				displayName: 'Text Effect',
				name: 'effect',
				type: 'options',
				options: [
					{ name: 'Shadow', value: 'shadow' },
					{ name: 'Outline', value: 'outline' },
					{ name: 'None', value: 'none' },
				],
				default: 'shadow',
				description: 'Visual effect applied to the text',
			},
			{
				displayName: 'Overlay Image',
				name: 'overlayImageKey',
				type: 'string',
				default: '',
				placeholder: 'uploads/logo.png',
				description: 'Path to an image (like a logo) to place on the thumbnail',
			},
			{
				displayName: 'Overlay Width (Pixels)',
				name: 'overlayWidth',
				type: 'number',
				default: 0,
				description: 'Width of the overlay image (0 = original size)',
			},
			{
				displayName: 'Overlay Height (Pixels)',
				name: 'overlayHeight',
				type: 'number',
				default: 0,
				description: 'Height of the overlay image (0 = original size)',
			},
		],
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
		displayOptions: { show: { ...showForVideo, operation: ['slideshow'] } },
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
						placeholder: 'uploads/slide1.jpg',
						description: 'Path to the image in your storage',
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
		displayOptions: { show: { ...showForVideo, operation: ['slideshow'] } },
		default: '',
		placeholder: 'uploads/music.mp3',
		description: 'Path to an audio file to play in the background (optional)',
	},

	// ═══════════════════════════════════════════════════════════
	// CREATE FROM DESIGN
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Canvas Size',
		name: 'canvasPreset',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['createFromDesign'] } },
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
			show: { ...showForVideo, operation: ['createFromDesign'], canvasPreset: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1920,
	},
	{
		displayName: 'Height (Pixels)',
		name: 'canvasHeight',
		type: 'number',
		displayOptions: {
			show: { ...showForVideo, operation: ['createFromDesign'], canvasPreset: ['custom'] },
		},
		typeOptions: { minValue: 64, maxValue: 3840 },
		default: 1080,
	},
	{
		displayName: 'Video Length (Seconds)',
		name: 'designDuration',
		type: 'number',
		required: true,
		displayOptions: { show: { ...showForVideo, operation: ['createFromDesign'] } },
		typeOptions: { minValue: 0.01, maxValue: 300, numberPrecision: 1 },
		default: 10,
		description: 'How long the video should be',
	},
	{
		displayName: 'Frames Per Second',
		name: 'fps',
		type: 'number',
		displayOptions: { show: { ...showForVideo, operation: ['createFromDesign'] } },
		typeOptions: { minValue: 1, maxValue: 60 },
		default: 30,
		description: 'Smoothness of the video (30 is standard)',
	},
	{
		displayName: 'Background Type',
		name: 'backgroundType',
		type: 'options',
		displayOptions: { show: { ...showForVideo, operation: ['createFromDesign'] } },
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
			show: { ...showForVideo, operation: ['createFromDesign'], backgroundType: ['solid'] },
		},
		default: '#000000',
		description: 'Background color for the video',
	},
	{
		displayName: 'Gradient Start Color',
		name: 'gradientFrom',
		type: 'color',
		displayOptions: {
			show: { ...showForVideo, operation: ['createFromDesign'], backgroundType: ['gradient'] },
		},
		default: '#000000',
		description: 'First color of the gradient',
	},
	{
		displayName: 'Gradient End Color',
		name: 'gradientTo',
		type: 'color',
		displayOptions: {
			show: { ...showForVideo, operation: ['createFromDesign'], backgroundType: ['gradient'] },
		},
		default: '#FFFFFF',
		description: 'Second color of the gradient',
	},
	{
		displayName: 'Gradient Direction',
		name: 'gradientDirection',
		type: 'options',
		displayOptions: {
			show: { ...showForVideo, operation: ['createFromDesign'], backgroundType: ['gradient'] },
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
		displayOptions: { show: { ...showForVideo, operation: ['createFromDesign'] } },
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

	// ═══════════════════════════════════════════════════════════
	// CUSTOM COMMAND
	// ═══════════════════════════════════════════════════════════
	{
		displayName: 'Command',
		name: 'command',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showForVideo, operation: ['customCommand'] } },
		default: '',
		placeholder: '-i {input} -vf "scale=640:480" {output}',
		description:
			'The processing command to run. Use {input} as a placeholder for the source file and {output} for the result file.',
	},
];
