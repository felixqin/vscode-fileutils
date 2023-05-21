import { Uri } from "vscode";
import { FileItem } from "../FileItem";
import { MoveFileController } from "../controller/MoveFileController";
import { BaseCommand } from "./BaseCommand";

export class DecryptFileCommand extends BaseCommand<MoveFileController> {
    public async execute(uri?: Uri): Promise<void> {
        const sourcePath = await this.controller.getSourcePath({ uri });
        const targetPath = sourcePath + ".dec.txt";
        const fileItem = new FileItem(sourcePath, targetPath);
        await this.executeController(fileItem, { openFileInEditor: true });
    }
}
