import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class VideoApiHubCreate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Video Api Hub Create',
		name: 'videoApiHubCreate',
		icon: 'file:videoApiHubCreate.svg',
		group: ['transform'],
		version: 1,
		subtitle: 'Create Video',
		description: 'Create a video from text, images, shapes, and audio layers',
		defaults: {
			name: 'Create Video',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'videoApiHubApi',
				required: true,
			},
		],
		properties: [
			// ═══════════════════════════════════════════════════════
			// CANVAS
			// ═══════════════════════════════════════════════════════
			{
				displayName: 'Canvas Size',
				name: 'canvasPreset',
				type: 'options',
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
				typeOptions: { minValue: 64, maxValue: 3840 },
				default: 1920,
				displayOptions: { show: { canvasPreset: ['custom'] } },
			},
			{
				displayName: 'Height (Pixels)',
				name: 'canvasHeight',
				type: 'number',
				typeOptions: { minValue: 64, maxValue: 3840 },
				default: 1080,
				displayOptions: { show: { canvasPreset: ['custom'] } },
			},
			{
				displayName: 'Video Length (Seconds)',
				name: 'durationSeconds',
				type: 'number',
				typeOptions: { minValue: 0.1, maxValue: 300, numberPrecision: 1 },
				default: 10,
				description: 'Total duration of the video',
			},
			{
				displayName: 'Frames Per Second',
				name: 'fps',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 60 },
				default: 30,
				description: 'Smoothness of the video (30 is standard)',
			},
			{
				displayName: 'Save Result As',
				name: 'outputKey',
				type: 'string',
				required: true,
				default: 'default.mp4',
				placeholder: 'my-video.mp4',
				description: 'File name for the result (e.g. promo.mp4)',
			},

			// ═══════════════════════════════════════════════════════
			// BACKGROUND
			// ═══════════════════════════════════════════════════════
			{
				displayName: 'Background',
				name: 'backgroundType',
				type: 'options',
				options: [
					{ name: 'Solid Color', value: 'solid' },
					{ name: 'Gradient', value: 'gradient' },
				],
				default: 'solid',
			},
			{
				displayName: 'Background Color',
				name: 'bgColor',
				type: 'color',
				default: '#000000',
				displayOptions: { show: { backgroundType: ['solid'] } },
			},
			{
				displayName: 'Start Color',
				name: 'gradientFrom',
				type: 'color',
				default: '#1a1a2e',
				displayOptions: { show: { backgroundType: ['gradient'] } },
			},
			{
				displayName: 'End Color',
				name: 'gradientTo',
				type: 'color',
				default: '#16213e',
				displayOptions: { show: { backgroundType: ['gradient'] } },
			},
			{
				displayName: 'Gradient Direction',
				name: 'gradientDirection',
				type: 'options',
				options: [
					{ name: 'Top to Bottom', value: 'vertical' },
					{ name: 'Left to Right', value: 'horizontal' },
					{ name: 'Diagonal', value: 'diagonal' },
				],
				default: 'vertical',
				displayOptions: { show: { backgroundType: ['gradient'] } },
			},

			// ═══════════════════════════════════════════════════════
			// LAYERS
			// ═══════════════════════════════════════════════════════
			{
				displayName: 'Layers',
				name: 'layers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Layer',
					sortable: true,
				},
				default: {},
				description: 'Visual elements stacked on the video. Later layers appear on top.',
				options: [
					{
						name: 'layerValues',
						displayName: 'Layer',
						values: [
							// ── Type ────────────────────────────
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

							// ── Content ─────────────────────────
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
								description: 'Direct link to a file instead of using storage (for Image, GIF, Video, Audio layers)',
							},
							{
								displayName: 'Color',
								name: 'color',
								type: 'color',
								default: '#000000CC',
								description: 'Fill color (for Rectangle and Circle layers)',
							},

							// ── Position ────────────────────────
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

							// ── Timing ──────────────────────────
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

							// ── Style Options ───────────────────
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// ── Canvas ────────────────────────────
				const preset = this.getNodeParameter('canvasPreset', i) as string;
				let width: number;
				let height: number;

				if (preset === 'custom') {
					width = this.getNodeParameter('canvasWidth', i) as number;
					height = this.getNodeParameter('canvasHeight', i) as number;
				} else {
					const [w, h] = preset.split('x').map(Number);
					width = w;
					height = h;
				}

				const durationSeconds = this.getNodeParameter('durationSeconds', i) as number;
				const fps = this.getNodeParameter('fps', i) as number;

				// ── Background ────────────────────────
				const bgType = this.getNodeParameter('backgroundType', i) as string;
				let background: IDataObject;

				if (bgType === 'solid') {
					background = { color: this.getNodeParameter('bgColor', i) as string };
				} else {
					background = {
						gradient: {
							from: this.getNodeParameter('gradientFrom', i) as string,
							to: this.getNodeParameter('gradientTo', i) as string,
							direction: this.getNodeParameter('gradientDirection', i) as string,
						},
					};
				}

				// ── Layers ────────────────────────────
				const layersInput = this.getNodeParameter('layers', i, {}) as {
					layerValues?: Array<IDataObject>;
				};

				const layers: IDataObject[] = (layersInput.layerValues ?? []).map((entry) => {
					const layer: IDataObject = {
						type: entry.type as string,
					};

					const layerType = entry.type as string;

					// Content fields
					if (layerType === 'text' && entry.text) {
						layer.text = entry.text;
					}
					if (['image', 'gif', 'video', 'audio'].includes(layerType)) {
						if (entry.url) layer.url = entry.url;
						else if (entry.key) layer.key = entry.key;
					}
					if (['rectangle', 'circle'].includes(layerType) && entry.color) {
						layer.color = entry.color;
					}

					// Position (skip for audio)
					if (layerType !== 'audio') {
						if (entry.x) layer.x = entry.x;
						if (entry.y) layer.y = entry.y;
						if (entry.width) layer.width = entry.width;
						if (entry.height) layer.height = entry.height;
					}

					// Timing
					if (entry.startSeconds) layer.start_seconds = entry.startSeconds;
					if (entry.durationSeconds) layer.duration_seconds = entry.durationSeconds;

					// Style options
					const style = (entry.style ?? {}) as IDataObject;

					if (style.opacity !== undefined && style.opacity !== 1) {
						layer.opacity = style.opacity;
					}
					if (style.animation && style.animation !== 'none') {
						layer.animation = style.animation;
					}
					if (style.animationSpeed !== undefined && style.animationSpeed !== 1) {
						layer.animation_speed = style.animationSpeed;
					}

					// Text-specific style
					if (layerType === 'text') {
						if (style.fontFamily) layer.font_family = style.fontFamily;
						if (style.fontFileKey) layer.font_file_key = style.fontFileKey;
						if (style.fontSize) layer.font_size = style.fontSize;
						if (style.fontColor) layer.font_color = style.fontColor;
						if (style.fontWeight) layer.font_weight = style.fontWeight;
						if (style.fontStyle && style.fontStyle !== 'normal') {
							layer.font_style = style.fontStyle;
						}
						if (style.align && style.align !== 'left') {
							layer.align = style.align;
						}
						if (style.textBg) layer.text_bg = style.textBg;
					}

					return layer;
				});

				// ── Output key ────────────────────────
				const rawOutputKey = this.getNodeParameter('outputKey', i) as string;
				const outputKey = rawOutputKey.startsWith('outputs/')
					? rawOutputKey
					: `outputs/${rawOutputKey}`;

				// ── API call ──────────────────────────
				const options: IHttpRequestOptions = {
					method: 'POST',
					url: 'https://api.videoapihub.com/v1/video/create',
					json: true,
					body: {
						output_key: outputKey,
						spec: {
							width,
							height,
							duration_seconds: durationSeconds,
							fps,
							background,
							layers,
						},
					},
				};

				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'videoApiHubApi',
					options,
				);

				returnData.push({ json: responseData as IDataObject });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
