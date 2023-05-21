import { FileItem } from "../FileItem";
import { ExecuteOptions } from "./FileController";
import { MoveFileController } from "./MoveFileController";

export class DecryptFileController extends MoveFileController {
    public async execute(options: ExecuteOptions): Promise<FileItem> {
        const { fileItem } = options;
        await this.ensureWritableFile(fileItem);
        return fileItem.decrypt();
    }
}
