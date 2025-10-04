import type {FileParameter} from "../objects";

export interface StorageRepository {
    upload: (file: FileParameter) => Promise<string>
    deleteAttachment(fileUrl: string, containerName: string): Promise<void>;
}