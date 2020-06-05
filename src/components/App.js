import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';

import LogItem from './LogItem';
import AddLogItem from './AddLogItem';

const App = () => {
	const [logs, setLogs] = useState([
		{
			id: 1,
			text: 'This is the log text',
			priority: 'low',
			user: 'Vitalik',
			created: new Date().toString(),
		},
		{
			id: 2,
			text: 'This is the second log text',
			priority: 'high',
			user: 'Vitalik',
			created: new Date().toString(),
		},
		{
			id: 3,
			text: 'This is the second log text',
			priority: 'moderate',
			user: 'Vitalik',
			created: new Date().toString(),
		},
	]);
	const [alert, setAlert] = useState({
		show: false,
		message: '',
		variant: 'success',
	});

	const addNewLog = (log) => {
		setLogs([...logs, log]);
		showAlert('New Log added!');
	};

	const deleteLog = (id) => {
		setLogs(logs.filter((log) => log.id !== id));
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
					{logs.map((log) => (
						<LogItem log={log} deleteLog={deleteLog} />
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default App;
