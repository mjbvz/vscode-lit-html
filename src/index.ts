import * as vscode from 'vscode';

const typeScriptExtensionId = 'vscode.typescript-language-features';
const litHtmlPluginId = 'typescript-lit-html-plugin';
const configurePluginCommand = '_typescript.configurePlugin';
const configurationSection = 'lit-html';

interface SynchronizedConfiguration {
    tags?: ReadonlyArray<string>;
}

export async function activate(context: vscode.ExtensionContext) {
    const extension = vscode.extensions.getExtension(typeScriptExtensionId);
    if (!extension) {
        return;
    }

    await extension.activate();
    if (!extension.exports) {
        return;
    }

    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(configurationSection)) {
            synchronizeConfiguration();
        }
    }, undefined, context.subscriptions);

    synchronizeConfiguration();
}

function synchronizeConfiguration() {
    vscode.commands.executeCommand(configurePluginCommand, litHtmlPluginId, getConfiguration());
}

function getConfiguration(): SynchronizedConfiguration {
    const config = vscode.workspace.getConfiguration(configurationSection);
    const outConfig: SynchronizedConfiguration = Object.create(null);

    if (config.has('tags')) {
        outConfig.tags = config.get<string[]>('tags');
    }

    return outConfig;
}
