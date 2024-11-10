import { protocol } from 'electron';
import sharp from 'sharp';
import querystring from 'node:querystring';

sharp.cache(false);

export async function registerProtocol() {
	protocol.handle('thumb', async (request) => {
		const replace = 'thumb://';
		const src = request.url;
		let url = src.replace(replace, '');

		if (process.platform === 'win32') {
			const prefix = url.slice(0, 1);
			const suffix = url.slice(1);
			url = `${prefix}:${suffix}`
		}

		const buffer = await sharp(querystring.unescape(url))
			.keepMetadata()
			.resize({ width: 128 })
			.webp({ quality: 60 })
			.toBuffer();

		return new Response(buffer, {
			status: 200
		});
	});
}
