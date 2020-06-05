import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

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

	const addNewLog = (log) => {
		setLogs([...logs, log]);
	};

	return (
		<Container>
			<AddLogItem addNewLog={addNewLog} />
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
						<LogItem log={log} />
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default App;
