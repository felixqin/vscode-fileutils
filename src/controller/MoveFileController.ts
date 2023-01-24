import expand from "brace-expansion";
import * as path from "path";
import { FileType, Uri, workspace } from "vscode";
import { FileItem } from "../FileItem";
import {
    BaseFileController,
    GetTargetPathInputBoxValueOptions as BaseGetTargetPathInputBoxValueOptions,
} from "./BaseFileController";
import { DialogOptions, ExecuteOptions } from "./FileController";

export interface MoveFileDialogOptions extends DialogOptions {
    showPath?: boolean;
}

type GetTargetPathInputBoxValueOptions = BaseGetTargetPathInputBoxValueOptions & MoveFileDialogOptions;

export class MoveFileController extends BaseFileController {
    public async showDialog(options: MoveFileDialogOptions): Promise<FileItem | undefined> {
        const { uri } = options;
        const sourcePath = await this.getSourcePath({ uri });

        if (!sourcePath) {
            throw new Error();
        }

        const targetPath = await this.getTargetPath(sourcePath, options);

        if (targetPath) {
            const isDir = (await workspace.fs.stat(Uri.file(sourcePath))).type === FileType.Directory;

            return expand(targetPath)
                .map((filePath) => new FileItem(sourcePath, filePath, isDir))
                .at(0);
        }
    }

    public async execute(options: ExecuteOptions): Promise<FileItem> {
        const { fileItem } = options;
        await this.ensureWritableFile(fileItem);
        return fileItem.move();
    }

    protected async getTargetPathInputBoxValue(
        sourcePath: string,
        options: GetTargetPathInputBoxValueOptions
    ): Promise<string> {
        const { showPath } = options;
        const value = showPath
            ? await this.getFullTargetPathInputBoxValue(sourcePath, options)
            : path.basename(sourcePath);

        return super.getTargetPathInputBoxValue(value, options);
    }

    private async getFullTargetPathInputBoxValue(
        sourcePath: string,
        options: GetTargetPathInputBoxValueOptions
    ): Promise<string> {
        const { typeahead, workspaceFolderPath } = options;

        if (!typeahead) {
            return sourcePath;
        }

        if (!workspaceFolderPath) {
            throw new Error();
        }

        const rootPath = await this.getFileSourcePathAtRoot(workspaceFolderPath, { relativeToRoot: true, typeahead });
        const fileName = path.basename(sourcePath);

        return path.join(rootPath, fileName);
    }

    protected getFilenameSelection(value: string): [number, number] {
        const basename = path.basename(value);
        const start = value.length - basename.length;
        const dot = basename.lastIndexOf(".");
        const exclusiveEndIndex = dot <= 0 ? value.length : start + dot;

        return [start, exclusiveEndIndex];
    }
}
