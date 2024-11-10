import { app, Menu, protocol } from 'electron';
import { registerIpcMain } from '@egoist/tipc/main';
import { restoreOrCreateWindow } from './window';
import { registerProtocol } from './protocol';
import { router, registerUIHandlers } from './tipc';

app.on('window-all-closed', () => {
	app.quit();
});

if (process.platform !== 'darwin') {
	app.commandLine.appendSwitch('--enable-features', 'FluentOverlayScrollbar');
}

protocol.registerSchemesAsPrivileged([
	{
		scheme: "thumb",
		privileges: {
			standard: true,
			secure: true,
			supportFetchAPI: true
		}
	}
])

app
	.whenReady()
	.then(registerProtocol)
	.then(restoreOrCreateWindow)
	.then((browserWindow) => {
		registerUIHandlers(browserWindow);

		if (process.platform !== 'darwin') {
			app.setAppUserModelId('PixZip Lite');
		}
	})
	.catch((e) => console.error('create window failed: ', e));

const menus = Menu.buildFromTemplate([
	{
		label: app.getName(),
		submenu: [
			{
				label: 'About',
				role: 'about'
			}
		]
	}
]);
Menu.setApplicationMenu(menus);
app.setAboutPanelOptions({
	applicationName: app.getName(),
	applicationVersion: app.getVersion(),
	version: ''
});

registerIpcMain(router);
