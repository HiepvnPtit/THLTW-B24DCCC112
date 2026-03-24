
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Popconfirm, message, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import queryString from 'query-string';
import Search from 'antd/lib/transfer/search';
import title from '@/locales/vi-VN/global/title';
import { render } from 'react-dom';
import { set, values } from 'lodash';

const GameOanTuTi = () => {
	const styles = {
		container: {

			textAlign: 'center',
			width: '60%',
			margin: '40px auto',
			padding: '20px',
			border: '1px solid #ddd',
			borderRadius: '5px',

			backgroundColor: '#f9f9f9'
		},
		button: {
			padding: '10px 20px',
			margin: '0 15px',

			borderRadius: '0px',
			border: '1px solid #04AA6D',


		},
		resultBox: {
			marginTop: '20px',
			padding: '15px',
			backgroundColor: '#fff',
			borderRadius: '10px',
			border: '1px dashed #ccc'
		},
		historyList: {
			textAlign: 'left',
			maxHeight: '150px',
			overflowY: 'auto',
			padding: '10px',
			backgroundColor: '#eee',
			borderRadius: '5px',
			listStyle: 'none'
		}
	};
	interface GameResult {
		STT : number;
		playerChoice: string;
		computerChoice: string;
		result: string;
	}
	const [options, setOptions] = useState<string[]>(['Kéo', 'Búa', 'Bao']);
	const [playerChoice, setPlayerChoice] = useState<string>('');
	const [computerChoice, setComputerChoice] = useState<string>('');
	const [result, setResult] = useState<string>('');
	const [arr, setArr] = useState<GameResult[]>([]);

	const handlePlayerChoice = (choice: string) => {
		setPlayerChoice(choice);
		const randomIndex = Math.floor(Math.random() * options.length);
		const computerSelection = options[randomIndex];
		setComputerChoice(computerSelection);
		determineWinner(choice, computerSelection);
	};

	const determineWinner = (player: string, computer: string) => {
		if (player === computer) {
			setResult('Hòa!');
		} else if (
			(player === 'Kéo' && computer === 'Bao') ||
			(player === 'Búa' && computer === 'Kéo') ||
			(player === 'Bao' && computer === 'Búa')
		) {
			setResult('Bạn thắng!');
		} else {
			setResult('Máy thắng!');
		}

		arr.unshift({ STT: arr.length + 1, playerChoice, computerChoice, result });
		setArr([...arr]);
	};
	const columns = [
		{
			title: 'Ván chơi',
			dataIndex: 'STT',
			key: 'STT',
			align: 'center',
		},
		{
			title: 'Bạn chọn',
			dataIndex: 'playerChoice',
			key: 'playerChoice',
			align: 'center',
		},
		{
			title: 'Máy chọn',
			dataIndex: 'computerChoice',
			key: 'computerChoice',
			align: 'center',
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
			align: 'center',
		},
	];
	return (
		<div style={styles.container}>
			<h1>Game Oẳn Tù Tì</h1>
			<div>
				{options.map((option) => (
					<Button style={styles.button}
						key={option}
						
						onClick={() => handlePlayerChoice(option)}
					>
						{option}
					</Button>
				))}
			</div>
			<div style={styles.resultBox}>
				<p><strong>Lựa chọn của bạn:</strong> {playerChoice || 'Chưa chọn'}</p>
				<p><strong>Lựa chọn của máy:</strong> {computerChoice || 'Chưa chọn'}</p>
				<h2>{result}</h2>
			</div>
			<h2>Lịch sử chơi</h2>
			<Table
				dataSource={arr}
				columns={columns}
				pagination={{ pageSize: 5 }}
				rowKey="STT"
			/>
	
	
		</div>

	);
	
}

export default GameOanTuTi;