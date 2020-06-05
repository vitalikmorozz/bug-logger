import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Moment from 'react-moment';

const LogItem = ({ log, deleteLog }) => {
	const setVariant = () => {
		if (log.priority === 'high') return 'danger';
		if (log.priority === 'moderate') return 'warning';
		if (log.priority === 'low') return 'success';
	};
	return (
		<tr>
			<td>
				<Badge variant={setVariant()} className="p-2">
					{log.priority.charAt(0).toUpperCase() + log.priority.slice(1)}
				</Badge>
			</td>
			<td>{log.text}</td>
			<td>{log.user}</td>
			<td>
				<Moment format="MMMM Do YYYY, h:mm:ss a">{new Date(log.created)}</Moment>
			</td>
			<td>
				<Button variant="danger" onClick={() => deleteLog(log.id)}>
					Delete
				</Button>
			</td>
		</tr>
	);
};

export default LogItem;
