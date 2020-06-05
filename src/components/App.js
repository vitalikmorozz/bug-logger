import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';

import { ipcRenderer } from 'electron';

import LogItem from './LogItem';
import AddLogItem from './AddLogItem';

const App = () => {
	const [logs, setLogs] = useState([]);
	const [alert, setAlert] = useState({
		show: false,
		message: '',
		variant: 'success',
	});

	useEffect(() => {
		ipcRenderer.send('logs:load');
		ipcRenderer.on('logs:get', (e, logs) => {
			setLogs(JSON.parse(logs));
		});
		ipcRenderer.on('logs:clear', () => {
			setLogs([]);
			showAlert('Logs has been cleared!');
		});
	}, []);

	const addNewLog = (log) => {
		ipcRenderer.send('logs:add', log);
		showAlert('New Log added!');
	};

	const deleteLog = (id) => {
		ipcRenderer.send('logs:delete', id);
		showAlert('Log has been deleted!');
	};

	const showAlert = (message, variant = 'success', seconds = 3000) => {
		setAlert({ show: true, message, variant });
		setTimeout(() => {
			setAlert({ show: false, message, variant: 'success' });
		}, seconds);
	};

	return (
		<Container>
			<AddLogItem addNewLog={addNewLog} showAlert={showAlert} />
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<Table>
				<thead>
					<tr>
						<th>Priority</th>
						<th>Log Text</th>
						<th>User</th>
						<th>Created</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{logs.map((log, indx) => (
						<LogItem key={indx} log={log} deleteLog={deleteLog} />
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default App;
