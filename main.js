const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
require('dotenv').config();

let mainWindow;

let isDev = false;
const isMac = process.platform === 'darwin';

const connectDB = require('./config/db')();
const Log = require('./model/Log');

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
	isDev = true;
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: isDev ? 1400 : 1100,
		height: 800,
		show: false,
		backgroundColor: 'white',
		icon: `${__dirname}/assets/icon.png`,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	let indexPath;

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		});
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		});
	}

	mainWindow.loadURL(indexPath);

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();

		// Open devtools if dev
		if (isDev) {
			const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) => console.log('Error loading React DevTools: ', err));
			mainWindow.webContents.openDevTools();
		}
	});

	mainWindow.on('closed', () => (mainWindow = null));
}

const menu = [
	...(isMac ? [{ role: 'appMenu' }] : []),
	{ role: 'fileMenu' },
	{ role: 'editMenu' },
	{
		label: 'logs',
		submenu: [
			{
				label: 'Clear Logs',
				click: () => clearLogs(),
			},
		],
	},
	...(isDev
		? [
				{
					label: 'Developer',
					submenu: [{ role: 'reload' }, { role: 'forcereload' }, { role: 'separator' }, { role: 'toggledevtools' }],
				},
		  ]
		: []),
];

ipcMain.on('logs:load', sendLogs);
ipcMain.on('logs:add', async (e, item) => {
	try {
		await Log.create(item);
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

ipcMain.on('logs:delete', async (e, id) => {
	try {
		await Log.deleteOne({ id });
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

async function clearLogs() {
	try {
		await Log.deleteMany({});
		mainWindow.webContents.send('logs:clear');
	} catch (err) {
		console.log(err);
	}
}

async function sendLogs() {
	try {
		const logs = await Log.find().sort({ created: 1 });
		mainWindow.webContents.send('logs:get', JSON.stringify(logs));
	} catch (err) {
		console.log(err);
	}
}

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow();
	}
});

// Stop error
app.allowRendererProcessReuse = true;
