import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { fileDescription } from './descriptions/FileDescription';
import { videoDescription } from './descriptions/VideoDescription';
import { templateDescription } from './descriptions/TemplateDescription';
import { accountDescription } from './descriptions/AccountDescription';

async function apiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.videoapihub.com${endpoint}`,
		json: true,
	};
	if (body) {
		options.body = body;
	}
	return this.helpers.httpRequestWithAuthentication.call(
		this,
		'videoApiHubApi',
		options,
	) as Promise<IDataObject>;
}

export class VideoApiHub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'VideoApiHub',
		name: 'videoApiHub',
		icon: 'file:videoApiHub.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Process, create, and transform videos with VideoApiHub',
		defaults: {
			name: 'VideoApiHub',
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
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Video', value: 'video' },
					{ name: 'File', value: 'file' },
					{ name: 'Template', value: 'template' },
					{ name: 'Account', value: 'account' },
				],
				default: 'video',
			},
			...fileDescription,
			...videoDescription,
			...templateDescription,
			...accountDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: IDataObject;

				if (resource === 'file') {
					responseData = await executeFile.call(this, operation, i);
				} else if (resource === 'video') {
					responseData = await executeVideo.call(this, operation, i);
				} else if (resource === 'template') {
					responseData = await executeTemplate.call(this, operation, i);
				} else if (resource === 'account') {
					responseData = await executeAccount.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex: i,
					});
				}

				returnData.push({ json: responseData });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
				} else {
					if ((error as NodeOperationError).context) {
						(error as NodeOperationError).context.itemIndex = i;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}

// ═══════════════════════════════════════════════════════════════
// FILE
// ═══════════════════════════════════════════════════════════════

async function executeFile(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	if (operation === 'getUploadLink') {
		const body: IDataObject = {
			content_type: this.getNodeParameter('contentType', i) as string,
			file_name: this.getNodeParameter('fileName', i) as string,
		};
		const displayName = this.getNodeParameter('fileDisplayName', i, '') as string;
		if (displayName) {
			body.display_name = displayName;
		}
		return apiRequest.call(this, 'POST', '/v1/storage/upload-url', body);
	}

	if (operation === 'getDownloadLink') {
		const body: IDataObject = {
			key: this.getNodeParameter('fileKey', i) as string,
		};
		return apiRequest.call(this, 'POST', '/v1/storage/download-url', body);
	}

	throw new NodeOperationError(this.getNode(), `Unknown file operation: ${operation}`, {
		itemIndex: i,
	});
}

// ═══════════════════════════════════════════════════════════════
// VIDEO
// ═══════════════════════════════════════════════════════════════

async function executeVideo(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	const outputKey = this.getNodeParameter('outputKey', i) as string;

	const needsInput = [
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
	const inputKey = needsInput.includes(operation)
		? (this.getNodeParameter('inputKey', i) as string)
		: undefined;

	// ── Clip ──────────────────────────────────────────────────
	if (operation === 'clip') {
		return apiRequest.call(this, 'POST', '/v1/video/clip', {
			input_key: inputKey,
			output_key: outputKey,
			options: {
				start_seconds: this.getNodeParameter('startSeconds', i) as number,
				duration_seconds: this.getNodeParameter('durationSeconds', i) as number,
			},
		} as IDataObject);
	}

	// ── Multi Clip ───────────────────────────────────────────
	if (operation === 'multiClip') {
		const clipMode = this.getNodeParameter('clipMode', i) as string;
		const options: IDataObject = {};

		if (clipMode === 'custom') {
			const segmentsData = this.getNodeParameter('segments', i) as {
				segmentValues?: Array<{ startSeconds: number; durationSeconds: number }>;
			};
			options.segments = (segmentsData.segmentValues ?? []).map((s) => ({
				start_seconds: s.startSeconds,
				duration_seconds: s.durationSeconds,
			}));
		} else {
			options.start_seconds = this.getNodeParameter('evenStartSeconds', i) as number;
			options.duration_seconds = this.getNodeParameter('evenDurationSeconds', i) as number;
			options.gap_seconds = this.getNodeParameter('gapSeconds', i) as number;
			options.count = this.getNodeParameter('clipCount', i) as number;
		}

		return apiRequest.call(this, 'POST', '/v1/video/multi-clip', {
			input_key: inputKey,
			output_key: outputKey,
			options,
		} as IDataObject);
	}

	// ── Thumbnail ────────────────────────────────────────────
	if (operation === 'thumbnail') {
		return apiRequest.call(this, 'POST', '/v1/video/thumbnail', {
			input_key: inputKey,
			output_key: outputKey,
			options: {
				at_second: this.getNodeParameter('atSecond', i) as number,
			},
		} as IDataObject);
	}

	// ── Screenshots ──────────────────────────────────────────
	if (operation === 'screenshots') {
		const mode = this.getNodeParameter('screenshotMode', i) as string;
		const options: IDataObject = { mode };

		if (mode === 'count') {
			options.count = this.getNodeParameter('screenshotCount', i) as number;
		} else if (mode === 'timestamps') {
			const tsStr = this.getNodeParameter('timestamps', i) as string;
			options.timestamps = tsStr
				.split(',')
				.map((t) => parseFloat(t.trim()))
				.filter((t) => !isNaN(t));
		} else if (mode === 'random') {
			options.count = this.getNodeParameter('screenshotCount', i) as number;
			options.video_duration = this.getNodeParameter('videoDuration', i) as number;
		}

		return apiRequest.call(this, 'POST', '/v1/video/screenshots', {
			input_key: inputKey,
			output_key: outputKey,
			options,
		} as IDataObject);
	}

	// ── Remove Audio ─────────────────────────────────────────
	if (operation === 'removeAudio') {
		return apiRequest.call(this, 'POST', '/v1/video/remove-audio', {
			input_key: inputKey,
			output_key: outputKey,
		} as IDataObject);
	}

	// ── Extract Audio ────────────────────────────────────────
	if (operation === 'extractAudio') {
		return apiRequest.call(this, 'POST', '/v1/video/extract-audio', {
			input_key: inputKey,
			output_key: outputKey,
		} as IDataObject);
	}

	// ── Add Audio ────────────────────────────────────────────
	if (operation === 'addAudio') {
		const options: IDataObject = {
			audio_key: this.getNodeParameter('audioKey', i) as string,
			mix_mode: this.getNodeParameter('mixMode', i) as string,
		};
		const extra = this.getNodeParameter('audioOptions', i, {}) as IDataObject;
		if (extra.volume !== undefined) options.volume = extra.volume;
		if (extra.audioStartSeconds !== undefined)
			options.audio_start_seconds = extra.audioStartSeconds;
		if (extra.videoOffsetSeconds !== undefined)
			options.video_offset_seconds = extra.videoOffsetSeconds;
		if (extra.audioDurationSeconds !== undefined)
			options.audio_duration_seconds = extra.audioDurationSeconds;

		return apiRequest.call(this, 'POST', '/v1/video/add-audio', {
			input_key: inputKey,
			output_key: outputKey,
			options,
		} as IDataObject);
	}

	// ── Convert Format ───────────────────────────────────────
	if (operation === 'convertFormat') {
		return apiRequest.call(this, 'POST', '/v1/video/convert-format', {
			input_key: inputKey,
			output_key: outputKey,
			options: {
				format: this.getNodeParameter('targetFormat', i) as string,
			},
		} as IDataObject);
	}

	// ── Resize ───────────────────────────────────────────────
	if (operation === 'resize') {
		const sizeMode = this.getNodeParameter('sizeMode', i) as string;
		const options: IDataObject = {};

		if (sizeMode === 'preset') {
			options.aspect_ratio = this.getNodeParameter('aspectRatio', i) as string;
		} else {
			options.width = this.getNodeParameter('customWidth', i) as number;
			options.height = this.getNodeParameter('customHeight', i) as number;
		}
		options.fit_mode = this.getNodeParameter('fitMode', i) as string;

		return apiRequest.call(this, 'POST', '/v1/video/convert-aspect-ratio', {
			input_key: inputKey,
			output_key: outputKey,
			options,
		} as IDataObject);
	}

	// ── Thumbnail with Text ──────────────────────────────────
	if (operation === 'thumbnailWithText') {
		const options: IDataObject = {
			at_second: this.getNodeParameter('textThumbAtSecond', i) as number,
		};
		const text = this.getNodeParameter('overlayText', i, '') as string;
		if (text) options.text = text;

		options.position = this.getNodeParameter('textPosition', i) as string;

		const extra = this.getNodeParameter('thumbnailTextOptions', i, {}) as IDataObject;
		if (extra.fontSize !== undefined) options.font_size = extra.fontSize;
		if (extra.fontColor !== undefined) options.font_color = extra.fontColor;
		if (extra.effect !== undefined) options.effect = extra.effect;
		if (extra.overlayImageKey !== undefined) options.overlay_image_key = extra.overlayImageKey;
		if (extra.overlayWidth !== undefined) options.overlay_width = extra.overlayWidth;
		if (extra.overlayHeight !== undefined) options.overlay_height = extra.overlayHeight;

		return apiRequest.call(this, 'POST', '/v1/video/thumbnail-with-text', {
			input_key: inputKey,
			output_key: outputKey,
			options,
		} as IDataObject);
	}

	// ── Slideshow ────────────────────────────────────────────
	if (operation === 'slideshow') {
		const slidesData = this.getNodeParameter('slides', i) as {
			slideValues?: Array<{ imageKey: string; durationSeconds: number }>;
		};
		const segments = (slidesData.slideValues ?? []).map((s) => ({
			image_key: s.imageKey,
			duration_seconds: s.durationSeconds,
		}));

		const options: IDataObject = { segments };
		const audioKey = this.getNodeParameter('slideshowAudioKey', i, '') as string;
		if (audioKey) options.audio_key = audioKey;

		return apiRequest.call(this, 'POST', '/v1/video/image-sequence', {
			output_key: outputKey,
			options,
		} as IDataObject);
	}

	// ── Create from Design ───────────────────────────────────
	if (operation === 'createFromDesign') {
		const spec: IDataObject = {
			width: this.getNodeParameter('canvasWidth', i) as number,
			height: this.getNodeParameter('canvasHeight', i) as number,
			duration_seconds: this.getNodeParameter('designDuration', i) as number,
			fps: this.getNodeParameter('fps', i) as number,
		};

		const bgType = this.getNodeParameter('backgroundType', i) as string;
		if (bgType === 'solid') {
			spec.background = { color: this.getNodeParameter('backgroundColor', i) as string };
		} else {
			spec.background = {
				gradient: {
					from: this.getNodeParameter('gradientFrom', i) as string,
					to: this.getNodeParameter('gradientTo', i) as string,
					direction: this.getNodeParameter('gradientDirection', i) as string,
				},
			};
		}

		const layersJson = this.getNodeParameter('layers', i, '[]') as string;
		try {
			spec.layers = typeof layersJson === 'string' ? JSON.parse(layersJson) : layersJson;
		} catch {
			throw new NodeOperationError(
				this.getNode(),
				'The Layers field contains invalid JSON. Please check the format.',
				{ itemIndex: i },
			);
		}

		return apiRequest.call(this, 'POST', '/v1/video/create', {
			output_key: outputKey,
			spec,
		} as IDataObject);
	}

	// ── Custom Command ───────────────────────────────────────
	if (operation === 'customCommand') {
		return apiRequest.call(this, 'POST', '/v1/video/ffmpeg-custom', {
			input_key: inputKey,
			output_key: outputKey,
			options: {
				command: this.getNodeParameter('command', i) as string,
			},
		} as IDataObject);
	}

	throw new NodeOperationError(this.getNode(), `Unknown video operation: ${operation}`, {
		itemIndex: i,
	});
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE
// ═══════════════════════════════════════════════════════════════

async function executeTemplate(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	if (operation === 'render') {
		const templateId = this.getNodeParameter('templateId', i) as string;
		const outputKey = this.getNodeParameter('templateOutputKey', i) as string;

		const varsData = this.getNodeParameter('templateVariables', i, {}) as {
			variableValues?: Array<{ name: string; value: string }>;
		};
		const variables: IDataObject = {};
		for (const v of varsData.variableValues ?? []) {
			if (v.name) variables[v.name] = v.value;
		}

		return apiRequest.call(
			this,
			'POST',
			`/v1/templates/${encodeURIComponent(templateId)}/render`,
			{
				output_key: outputKey,
				variables,
			} as IDataObject,
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown template operation: ${operation}`, {
		itemIndex: i,
	});
}

// ═══════════════════════════════════════════════════════════════
// ACCOUNT
// ═══════════════════════════════════════════════════════════════

async function executeAccount(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	if (operation === 'me') {
		return apiRequest.call(this, 'GET', '/v1/me');
	}

	if (operation === 'healthCheck') {
		return apiRequest.call(this, 'GET', '/health');
	}

	if (operation === 'viewPlans') {
		return apiRequest.call(this, 'GET', '/v1/pricing');
	}

	throw new NodeOperationError(this.getNode(), `Unknown account operation: ${operation}`, {
		itemIndex: i,
	});
}
