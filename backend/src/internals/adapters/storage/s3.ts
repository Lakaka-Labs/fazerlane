import {S3Client, PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import {v4 as uuidv4} from 'uuid';
import type {StorageRepository} from "../../domain/storage/repository.ts";
import type {StorageCredentials} from "../../../packages/secret";
import type {FileParameter} from "../../domain/objects";
import { readFile } from 'fs/promises';


export class S3StorageClass implements StorageRepository {
    private readonly s3Client: S3Client;
    private readonly storageCredentials: StorageCredentials
    constructor(s3Client: S3Client, storageCredentials: StorageCredentials) {
        this.s3Client = s3Client;
        this.storageCredentials = storageCredentials
    }

    public async upload(file: FileParameter): Promise<string> {
        const key = uuidv4();

        const fileBuffer = await readFile(file.path);


        const params = {
            Bucket: this.storageCredentials.storageBucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: file.mimeType,
            region: 'auto'
        };

        try {

            const parallelUploads3 = new Upload({
                client: this.s3Client,
                params,
            })

            parallelUploads3.on("httpUploadProgress", (progress) => {
            });

            await parallelUploads3.done();

            const encodedKey = encodeURIComponent(key);
            let objectUrl: string;

            objectUrl = `${this.storageCredentials.storageBucketPublicDomain}/${encodedKey}`;

            return objectUrl;

        } catch (error: any) {
            throw new Error(`S3 Upload Failed: ${error.message || 'Unknown S3 error'}`);
        }
    }

    public async deleteAttachment(fileUrl: string, bucketName: string): Promise<void> {
        try {
            // Extract the S3 key from the file URL (e.g., https://bucket.s3.region.amazonaws.com/key)
            const key = fileUrl.split(`${this.storageCredentials.storageBucketPublicDomain}/`)[1];
            if (!key) {
                throw new Error("Invalid file URL: Unable to extract S3 key");
            }

            const decodedKey = decodeURIComponent(key);

            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: decodedKey,
            });

            await this.s3Client.send(command);
        } catch (error: any) {
            console.error("S3 Delete Error in deleteAttachment:", error);
            if (error.Code === "NoSuchKey") {
                throw new Error("File not found in S3");
            } else if (error.Code === "ExpiredToken") {
                throw new Error("Failed to delete file: AWS token has expired. Please refresh your AWS credentials.");
            }
            throw new Error(`S3 Delete Failed: ${error.message || 'Unknown S3 error'}`);
        }
    }
}

