import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IHttpRequestMethods,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError, NodeOperationError } from 'n8n-workflow';

/* eslint-disable @n8n/community-nodes/options-sorted-alphabetically */
/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import { fileDescription } from './descriptions/FileDescription';
import { videoCreateDescription } from './descriptions/VideoCreateDescription';
import { videoEditDescription } from './descriptions/VideoEditDescription';
import { videoAudioDescription } from './descriptions/VideoAudioDescription';
import { videoImageDescription } from './descriptions/VideoImageDescription';
import { templateDescription } from './descriptions/TemplateDescription';
import { jobDescription } from './descriptions/JobDescription';

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
		displayName: 'Video Api Hub',
		name: 'videoApiHub',
		icon: 'file:videoApiHub.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Process, create, and transform videos with Video Api Hub',
		defaults: {
			name: 'Video Api Hub',
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
					{ name: 'Template', value: 'template' },
					{ name: 'Create Video', value: 'videoCreate' },
					{ name: 'Edit Video', value: 'videoEdit' },
					{ name: 'Video Audio', value: 'videoAudio' },
					{ name: 'Video Thumbnail', value: 'videoImage' },
					{ name: 'Job', value: 'job' },
					{ name: 'File', value: 'file' },
				],
				default: 'videoCreate',
			},
			...templateDescription,
			...videoCreateDescription,
			...videoEditDescription,
			...videoAudioDescription,
			...videoImageDescription,
			...jobDescription,
			...fileDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let result: INodeExecutionData;

				if (resource === 'template') {
					const responseData = await executeTemplate.call(this, operation, i);
					result = { json: responseData, pairedItem: { item: i } };
				} else if (resource === 'videoCreate' || resource === 'videoEdit' || resource === 'videoAudio' || resource === 'videoImage') {
					const responseData = await executeVideo.call(this, operation, i);
					result = { json: responseData, pairedItem: { item: i } };
				} else if (resource === 'job') {
					result = await executeJob.call(this, operation, i);
				} else if (resource === 'file') {
					result = await executeFile.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex: i,
					});
				}

				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
				} else {
					if (error instanceof NodeApiError) {
						error.context = { ...error.context, itemIndex: i };
						throw error;
					}
					if (error instanceof NodeOperationError) {
						error.context = { ...error.context, itemIndex: i };
						throw error;
					}
					// Wrap any other error as NodeApiError
					throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
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
): Promise<INodeExecutionData> {
	if (operation === 'uploadFile') {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
		const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
		const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

		const options: IHttpRequestOptions = {
			method: 'POST',
			url: 'https://api.videoapihub.com/v1/storage/upload',
			json: true,
			body: {
				file: {
					value: buffer,
					options: {
						filename: binaryData.fileName ?? 'file',
						contentType: binaryData.mimeType ?? 'application/octet-stream',
					},
				},
			},
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'videoApiHubApi',
			options,
		) as IDataObject;
		return { json: responseData };
	}

	if (operation === 'downloadFile') {
		const fileKey = this.getNodeParameter('fileKey', i) as string;
		const responseType = this.getNodeParameter('downloadResponseType', i) as string;

		if (responseType === 'url') {
			const responseData = await apiRequest.call(
				this,
				'POST',
				'/v1/storage/download-url',
				{ key: fileKey },
			);
			return { json: responseData };
		}

		// Download as binary file
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'videoApiHubApi',
			{
				method: 'GET',
				url: `https://api.videoapihub.com/v1/storage/download?key=${encodeURIComponent(fileKey)}`,
				encoding: 'arraybuffer',
				returnFullResponse: true,
				json: false,
			} as IHttpRequestOptions,
		) as { body: Buffer; headers: IDataObject };

		const fileName = fileKey.split('/').pop() ?? 'file';
		const contentType = (response.headers?.['content-type'] as string) ?? 'application/octet-stream';
		const binaryOutput = await this.helpers.prepareBinaryData(
			Buffer.from(response.body),
			fileName,
			contentType,
		);

		return { json: { key: fileKey }, binary: { data: binaryOutput } };
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
	const resource = this.getNodeParameter('resource', i) as string;
	let outputFormat: string;
	if (resource === 'videoImage') {
		outputFormat = this.getNodeParameter('imageFormat', i) as string;
	} else if (resource === 'videoAudio' && operation === 'extractAudio') {
		outputFormat = this.getNodeParameter('audioFormat', i) as string;
	} else {
		outputFormat = this.getNodeParameter('outputFormat', i) as string;
	}

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
	const input = needsInput.includes(operation)
		? (this.getNodeParameter('input', i) as string)
		: undefined;

	// Build common request body
	const baseBody: IDataObject = { output_format: outputFormat };
	if (input) baseBody.input = input;

	const outputType = this.getNodeParameter('outputType', i) as string;
	baseBody.output_type = outputType;

	if (outputType === 'signed_url') {
		const outputExpiry = this.getNodeParameter('outputExpiry', i, 3600) as number;
		baseBody.output_expiry = outputExpiry;
	}

	const outputOpts = this.getNodeParameter('outputOptions', i, {}) as IDataObject;
	if (outputOpts.outputKey) baseBody.output_key = outputOpts.outputKey;

	// ── Clip ──────────────────────────────────────────────────
	if (operation === 'clip') {
		return apiRequest.call(this, 'POST', '/v1/video/clip', {
			...baseBody,
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
			...baseBody,
			options,
		} as IDataObject);
	}

	// ── Merge ─────────────────────────────────────────────────
	if (operation === 'merge') {
		const videoKeysData = this.getNodeParameter('videoKeys', i) as {
			videoValues?: Array<{ source: string }>;
		};
		const videoKeys = (videoKeysData.videoValues ?? []).map((v) => v.source);
		return apiRequest.call(this, 'POST', '/v1/video/merge', {
			...baseBody,
			options: { video_keys: videoKeys },
		} as IDataObject);
	}

	// ── Thumbnail ────────────────────────────────────────────
	if (operation === 'thumbnail') {
		return apiRequest.call(this, 'POST', '/v1/video/thumbnail', {
			...baseBody,
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
			...baseBody,
			options,
		} as IDataObject);
	}

	// ── Remove Audio ─────────────────────────────────────────
	if (operation === 'removeAudio') {
		return apiRequest.call(this, 'POST', '/v1/video/remove-audio', {
			...baseBody,
		} as IDataObject);
	}

	// ── Extract Audio ────────────────────────────────────────
	if (operation === 'extractAudio') {
		return apiRequest.call(this, 'POST', '/v1/video/extract-audio', {
			...baseBody,
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
			...baseBody,
			options,
		} as IDataObject);
	}

	// ── Convert Format ───────────────────────────────────────
	if (operation === 'convertFormat') {
		return apiRequest.call(this, 'POST', '/v1/video/convert-format', {
			...baseBody,
			options: {
				format: outputFormat,
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
			...baseBody,
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
		if (extra.font !== undefined) options.font = extra.font;
		if (extra.fontSize !== undefined) options.font_size = extra.fontSize;
		if (extra.fontColor !== undefined) options.font_color = extra.fontColor;
		if (extra.effect !== undefined) options.effect = extra.effect;
		if (extra.overlayImageKey !== undefined) options.overlay_image_key = extra.overlayImageKey;
		if (extra.overlayWidth !== undefined) options.overlay_width = extra.overlayWidth;
		if (extra.overlayHeight !== undefined) options.overlay_height = extra.overlayHeight;

		return apiRequest.call(this, 'POST', '/v1/video/thumbnail-with-text', {
			...baseBody,
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
			...baseBody,
			options,
		} as IDataObject);
	}

	// ── Create from Design ───────────────────────────────────
	if (operation === 'createFromDesign') {
		const preset = this.getNodeParameter('canvasPreset', i) as string;
		let specWidth: number;
		let specHeight: number;

		if (preset === 'custom') {
			specWidth = this.getNodeParameter('canvasWidth', i) as number;
			specHeight = this.getNodeParameter('canvasHeight', i) as number;
		} else {
			const [w, h] = preset.split('x').map(Number);
			specWidth = w;
			specHeight = h;
		}

		const spec: IDataObject = {
			width: specWidth,
			height: specHeight,
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

		const layersInput = this.getNodeParameter('designLayers', i, {}) as {
			layerValues?: Array<IDataObject>;
		};

		spec.layers = (layersInput.layerValues ?? []).map((entry) => {
			const layer: IDataObject = { type: entry.type as string };
			const layerType = entry.type as string;

			if (layerType === 'text' && entry.text) layer.text = entry.text;
			if (['image', 'gif', 'video', 'audio'].includes(layerType)) {
				if (entry.url) layer.url = entry.url;
				else if (entry.key) layer.key = entry.key;
			}
			if (['rectangle', 'circle'].includes(layerType) && entry.color) {
				layer.color = entry.color;
			}

			if (layerType !== 'audio') {
				if (entry.x) layer.x = entry.x;
				if (entry.y) layer.y = entry.y;
				if (entry.width) layer.width = entry.width;
				if (entry.height) layer.height = entry.height;
			}

			if (entry.startSeconds) layer.start_seconds = entry.startSeconds;
			if (entry.durationSeconds) layer.duration_seconds = entry.durationSeconds;

			const style = (entry.style ?? {}) as IDataObject;
			if (style.opacity !== undefined && style.opacity !== 1) layer.opacity = style.opacity;
			if (style.animation && style.animation !== 'none') layer.animation = style.animation;
			if (style.animationSpeed !== undefined && style.animationSpeed !== 1) {
				layer.animation_speed = style.animationSpeed;
			}

			if (layerType === 'text') {
				if (style.fontFamily) layer.font_family = style.fontFamily;
				if (style.fontFileKey) layer.font_file_key = style.fontFileKey;
				if (style.fontSize) layer.font_size = style.fontSize;
				if (style.fontColor) layer.font_color = style.fontColor;
				if (style.fontWeight) layer.font_weight = style.fontWeight;
				if (style.fontStyle && style.fontStyle !== 'normal') layer.font_style = style.fontStyle;
				if (style.align && style.align !== 'left') layer.align = style.align;
				if (style.textBg) layer.text_bg = style.textBg;
			}

			return layer;
		});

		return apiRequest.call(this, 'POST', '/v1/video/create', {
			...baseBody,
			spec,
		} as IDataObject);
	}

	// ── Custom Command ───────────────────────────────────────
	if (operation === 'customCommand') {
		return apiRequest.call(this, 'POST', '/v1/video/ffmpeg-custom', {
			...baseBody,
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
		const rawOutputKey = this.getNodeParameter('templateOutputKey', i) as string;
		const outputKey = rawOutputKey.startsWith('outputs/') ? rawOutputKey : `outputs/${rawOutputKey}`;

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
// JOB
// ═══════════════════════════════════════════════════════════════

async function executeJob(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'getResult') {
		const taskId = this.getNodeParameter('taskId', i) as string;
		const responseType = this.getNodeParameter('resultResponseType', i) as string;

		// Build query string for response override
		let query = '';
		if (responseType === 'url') query = '?response=url';
		else if (responseType === 'file') query = '?response=file';
		// public_url and auto: no query param — uses the job's stored output_type

		if (responseType === 'url' || responseType === 'public_url') {
			// URL mode — always returns JSON
			const responseData = await apiRequest.call(
				this,
				'GET',
				`/v1/result/${encodeURIComponent(taskId)}${query}`,
			);
			return { json: responseData };
		}

		// Auto or File — may return binary, so use arraybuffer
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'videoApiHubApi',
			{
				method: 'GET',
				url: `https://api.videoapihub.com/v1/result/${encodeURIComponent(taskId)}${query}`,
				encoding: 'arraybuffer',
				returnFullResponse: true,
				json: false,
			} as IHttpRequestOptions,
		) as { body: Buffer; headers: IDataObject; statusCode: number };

		const contentType = (response.headers?.['content-type'] as string) ?? '';

		// If response is JSON (still processing, failed, or signed_url result)
		if (contentType.includes('application/json')) {
			const jsonData = JSON.parse(Buffer.from(response.body).toString('utf-8')) as IDataObject;
			return { json: jsonData };
		}

		// Binary file response
		const contentDisposition = (response.headers?.['content-disposition'] as string) ?? '';
		const fileNameMatch = contentDisposition.match(/filename="?([^";\s]+)"?/);
		const fileName = fileNameMatch?.[1] ?? `${taskId}.bin`;
		const binaryOutput = await this.helpers.prepareBinaryData(
			Buffer.from(response.body),
			fileName,
			contentType || 'application/octet-stream',
		);

		return { json: { task_id: taskId, status: 'completed' }, binary: { data: binaryOutput } };
	}

	throw new NodeOperationError(this.getNode(), `Unknown job operation: ${operation}`, {
		itemIndex: i,
	});
}


