import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';

const { Text } = Typography;

const QuanLyThePage = () => {
	const { tags, getTagUsageCount, addTag, updateTag, deleteTag } = useModel('blogapp' as any) as any;
	const [visibleModal, setVisibleModal] = useState(false);
	const [editingTag, setEditingTag] = useState<any>(null);
	const [form] = Form.useForm();

	const dataSource = useMemo(
		() =>
			tags
				.map((item: any) => ({
					...item,
					usageCount: getTagUsageCount(item.name),
				}))
				.sort((a: any, b: any) => b.usageCount - a.usageCount),
		[tags, getTagUsageCount],
	);

	const openCreate = () => {
		setEditingTag(null);
		form.resetFields();
		setVisibleModal(true);
	};

	const openEdit = (tag: any) => {
		setEditingTag(tag);
		form.setFieldsValue({ name: tag.name });
		setVisibleModal(true);
	};

	const onSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (editingTag) updateTag(editingTag.id, values.name);
			else addTag(values.name);
			setVisibleModal(false);
			form.resetFields();
		} catch (error: any) {
			if (error?.errorFields) return;
			message.error(error?.message || 'Khong the luu the');
		}
	};

	const columns = [
		{
			title: 'Ten the',
			dataIndex: 'name',
			key: 'name',
			render: (value: string) => <Text strong>#{value}</Text>,
		},
		{
			title: 'So bai viet dang su dung',
			dataIndex: 'usageCount',
			key: 'usageCount',
			align: 'center' as const,
		},
		{
			title: 'Hanh dong',
			key: 'actions',
			align: 'center' as const,
			render: (_: any, record: any) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEdit(record)}>
						Sua
					</Button>
					<Popconfirm
						title='Ban chac chan muon xoa the nay?'
						onConfirm={() => {
							try {
								deleteTag(record.id);
							} catch (error: any) {
								message.error(error?.message || 'Khong the xoa the');
							}
						}}
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xoa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Card
				title='Quan ly the bai viet'
				extra={
					<Button type='primary' icon={<PlusCircleOutlined />} onClick={openCreate}>
						Them the
					</Button>
				}
			>
				<Table rowKey='id' columns={columns} dataSource={dataSource} pagination={{ pageSize: 10 }} />
			</Card>

			<Modal
				title={editingTag ? 'Chinh sua the' : 'Them the moi'}
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				onOk={onSubmit}
				okText='Luu'
				cancelText='Huy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='name'
						label='Ten the'
						rules={[{ required: true, message: 'Vui long nhap ten the' }]}
					>
						<Input placeholder='vi du: react' />
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default QuanLyThePage;
