import { Uri } from "vscode";
import { MoveFileController } from "../controller/MoveFileController";
import { BaseCommand } from "./BaseCommand";

export class DecryptFileCommand extends BaseCommand<MoveFileController> {
    public async execute(uri?: Uri): Promise<void> {
        const dialogOptions = { prompt: "Decrypt To", uri };
        const fileItem = await this.controller.showDialog(dialogOptions);
        await this.executeController(fileItem, { openFileInEditor: !fileItem?.isDir });
    }
}
