import { randomUUID } from "crypto";
import { unlink } from "fs/promises";
import { mkdir } from "fs/promises";
import { join } from "path";

class ImageService {
	private readonly uploadDir = "./uploads";

	constructor() {
		// Ensure uploads directory exists
		mkdir(this.uploadDir, { recursive: true });
	}

	async uploadImage(file: File) {
		try {
			const fileExtension = file.type.split("/")[1];
			const fileName = `${randomUUID()}.${fileExtension}`;
			const filePath = join(this.uploadDir, fileName);

			const arrayBuffer = await file.arrayBuffer();
			await Bun.write(filePath, arrayBuffer);

			return {
				id: fileName,
				url: `/uploads/${fileName}`,
				name: file.name,
				size: file.size,
				type: file.type,
			};
		} catch (error) {
			console.error("Error in uploadImage:", error);
			throw new Error("Failed to upload image");
		}
	}

	async deleteImage(imageId: string) {
		try {
			const filePath = join(this.uploadDir, imageId);
			await Bun.write(filePath, ""); // Create empty file
			await unlink(filePath); // Use node's unlink instead
		} catch (error) {
			console.error("Error in deleteImage:", error);
			throw new Error("Failed to delete image");
		}
	}
}

export const imageService = new ImageService();
