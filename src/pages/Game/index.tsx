
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Popconfirm, message, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import queryString from 'query-string';
import Search from 'antd/lib/transfer/search';
import title from '@/locales/vi-VN/global/title';
import { render } from 'react-dom';
import { set, values } from 'lodash';

const renderStatus = (quantity: number) => {
	if (quantity > 10) return <Tag color="success">Còn hàng</Tag>;
	if (quantity > 0) return <Tag color="warning">Sắp hết hàng</Tag>;
	return <Tag color="error">Hết hàng</Tag>;
};


const Game = () => {
	const [score, setScore] = useState(0);
	const [numberOfPlays, setNumberOfPlays] = useState(10);
	const [randomNumber, setRandomNumber] = useState(0);
	const [numberInput, setNumberInput] = useState<number | null>(null);
	const [mess, setMess] = useState<string>('');
	useEffect(() => {
		generateRandomNumber();
	}, []);

	const generateRandomNumber = () => {
		const num = Math.floor(Math.random() * 100) + 1;
		setRandomNumber(num);
	};

	const handlePlay = () => {
		console.log('Số ngẫu nhiên:', randomNumber);
		if (numberInput === null) {
			message.error('Vui lòng nhập một số từ 1 đến 100');
			return;
		}
		if (numberInput < 1 || numberInput > 100) {
			message.error('Số phải nằm trong khoảng từ 1 đến 100');
			return;
		}

		if (numberInput === randomNumber) {
			setScore(score + 10);
			setMess('Chúc mừng! Bạn đã đoán đúng');



		} else if (numberInput < randomNumber) {

			setMess('Sai rồi! Số bạn đoán quá thấp');
		} else {

			setMess('Sai rồi! Số bạn đoán quá cao');
		}
		setNumberOfPlays(numberOfPlays - 1);
	}

	const handleReset = () => {
		setNumberOfPlays(10);
		generateRandomNumber();
		setNumberInput(null);
		message.info('Game đã được reset!');
	}

	return (
		<div style={{ textAlign: 'center', marginTop: '50px', width: '400px', marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
			<div style={{ fontSize: '24px', marginBottom: '20px', width: '100%' }}>Điểm của bạn: {score}</div>

			<div style={{ fontSize: '18px', marginBottom: '20px' }}>Số lần chơi còn lại: {numberOfPlays}</div>
			<InputNumber
				min={1}
				max={100}
				value={numberInput}
				onChange={(value) => setNumberInput(value)}
				style={{ marginBottom: '20px', width: '100%' }}
				onPressEnter={() => handlePlay()}
			/>
			<br />
			<div style={{
				height: 'auto', fontSize: '15px', marginBottom: '20px',
				color: mess.includes('Chúc mừng') ? '#52c41a' : '#ff4d4f',
				fontWeight: mess.includes('Chúc mừng') ? 'bold' : 'normal'
			}}>
				{mess}
			</div>

			<Button type="primary" onClick={handlePlay} disabled={numberOfPlays === 0} style={{ marginRight: '10px' }}>
				Chơi
			</Button>
			<Button onClick={handleReset}>Reset Game</Button>
		</div>
	);
}

export default Game;
