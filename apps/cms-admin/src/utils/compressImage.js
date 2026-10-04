export const COMPRESS_PRESETS = {
	hero:      { maxWidth: 1920, maxSizeMB: 1.5 },
	content:   { maxWidth: 1200, maxSizeMB: 1.0 },
	card:      { maxWidth: 800,  maxSizeMB: 0.5 },
	thumbnail: { maxWidth: 400,  maxSizeMB: 0.3 },
};

export function compressImage(file, { maxWidth = 1920, maxSizeMB = 1.5 } = {}) {
	if (file.size <= maxSizeMB * 1024 * 1024) return Promise.resolve(file);

	return new Promise((resolve) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(objectUrl);
			let { width, height } = img;
			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width);
				width = maxWidth;
			}
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.getContext("2d").drawImage(img, 0, 0, width, height);

			const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
			const quality = outputType === "image/jpeg" ? 0.82 : undefined;

			canvas.toBlob(
				(blob) => {
					if (!blob || blob.size >= file.size) {
						resolve(file);
					} else {
						resolve(new File([blob], file.name, { type: outputType }));
					}
				},
				outputType,
				quality
			);
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(file);
		};

		img.src = objectUrl;
	});
}
