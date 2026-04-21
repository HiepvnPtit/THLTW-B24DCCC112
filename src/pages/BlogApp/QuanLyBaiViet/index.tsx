import {
	DeleteOutlined,
	EditOutlined,
	PlusCircleOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Form,
	Input,
	Modal,
	Popconfirm,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';

const { Text } = Typography;

type TStatus = 'draft' | 'published';

const makeSlug = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

const QuanLyBaiVietPage = () => {
	const { posts, tags, profile, addPost, updatePost, deletePost } = useModel('blogapp' as any) as any;
	const [form] = Form.useForm();
	const [visibleModal, setVisibleModal] = useState(false);
	const [editingPost, setEditingPost] = useState<any>(null);
	const [titleFilter, setTitleFilter] = useState('');
	const [statusFilter, setStatusFilter] = useState<TStatus | undefined>(undefined);

	const filteredPosts = useMemo(() => {
		const normalizedKeyword = titleFilter.trim().toLowerCase();
		return posts
			.filter((item: any) => {
				const passTitle = !normalizedKeyword || item.title.toLowerCase().includes(normalizedKeyword);
				const passStatus = !statusFilter || item.status === statusFilter;
				return passTitle && passStatus;
			})
			.sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt));
	}, [posts, titleFilter, statusFilter]);

	const openCreateModal = () => {
		setEditingPost(null);
		form.resetFields();
		form.setFieldsValue({ status: 'draft', tags: [] });
		setVisibleModal(true);
	};

	const openEditModal = (post: any) => {
		setEditingPost(post);
		form.setFieldsValue({
			title: post.title,
			slug: post.slug,
			content: post.content,
			coverUrl: post.coverUrl,
			tags: post.tags,
			status: post.status,
		});
		setVisibleModal(true);
	};

	const onSubmit = async () => {
		try {
			const values = await form.validateFields();
			const payload = {
				title: values.title,
				slug: values.slug,
				content: values.content,
				coverUrl: values.coverUrl,
				tags: values.tags,
				status: values.status,
				authorName: profile?.name || 'HiepvnPtit',
			};

			if (editingPost) updatePost(editingPost.id, payload);
			else addPost(payload);

			setVisibleModal(false);
			setEditingPost(null);
			form.resetFields();
		} catch (error: any) {
			if (error?.errorFields) return;
			message.error(error?.message || 'Co loi xay ra khi luu bai viet');
		}
	};

	const columns = [
		{
			title: 'Tieu de',
			dataIndex: 'title',
			key: 'title',
			render: (value: string, record: any) => (
				<Space direction='vertical' size={0}>
					<Text strong>{value}</Text>
					<Text type='secondary'>/{record.slug}</Text>
				</Space>
			),
		},
		{
			title: 'Trang thai',
			dataIndex: 'status',
			key: 'status',
			render: (value: TStatus) => <Tag color={value === 'published' ? 'green' : 'gold'}>{value === 'published' ? 'Da dang' : 'Nhap'}</Tag>,
		},
		{
			title: 'The',
			dataIndex: 'tags',
			key: 'tags',
			render: (value: string[]) => value.map((item) => <Tag key={item}>#{item}</Tag>),
		},
		{
			title: 'Luot xem',
			dataIndex: 'views',
			key: 'views',
			align: 'center' as const,
		},
		{
			title: 'Ngay tao',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: 'Hanh dong',
			key: 'actions',
			align: 'center' as const,
			render: (_: any, record: any) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEditModal(record)}>
						Sua
					</Button>
					<Popconfirm title='Ban chac chan muon xoa bai viet nay?' onConfirm={() => deletePost(record.id)}>
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
			<Card>
				<Space wrap>
					<Input
						allowClear
						prefix={<SearchOutlined />}
						placeholder='Tim theo tieu de bai viet'
						style={{ width: 320 }}
						value={titleFilter}
						onChange={(event) => setTitleFilter(event.target.value)}
					/>
					<Select
						allowClear
						placeholder='Loc theo trang thai'
						style={{ width: 200 }}
						value={statusFilter}
						onChange={(value: TStatus | undefined) => setStatusFilter(value)}
					>
						<Select.Option value='draft'>Nhap</Select.Option>
						<Select.Option value='published'>Da dang</Select.Option>
					</Select>
					<Button type='primary' icon={<PlusCircleOutlined />} onClick={openCreateModal}>
						Them bai viet
					</Button>
				</Space>
			</Card>

			<Card title='Quan ly bai viet'>
				<Table rowKey='id' columns={columns} dataSource={filteredPosts} pagination={{ pageSize: 10 }} />
			</Card>

			<Modal
				title={editingPost ? 'Chinh sua bai viet' : 'Them bai viet moi'}
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				onOk={onSubmit}
				okText='Luu'
				cancelText='Huy'
				width={820}
			>
				<Form form={form} layout='vertical' initialValues={{ status: 'draft', tags: [] }}>
					<Form.Item name='title' label='Tieu de' rules={[{ required: true, message: 'Vui long nhap tieu de' }]}>
						<Input
							onChange={(event) => {
								if (editingPost) return;
								const title = event.target.value;
								form.setFieldsValue({ slug: makeSlug(title) });
							}}
						/>
					</Form.Item>
					<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Vui long nhap slug' }]}>
						<Input placeholder='vi-du-slug-bai-viet' />
					</Form.Item>
					<Form.Item
						name='content'
						label='Noi dung (Markdown)'
						rules={[{ required: true, message: 'Vui long nhap noi dung bai viet' }]}
					>
						<Input.TextArea rows={10} placeholder='# Tieu de\n\nNoi dung bai viet...' />
					</Form.Item>
					<Form.Item
						name='coverUrl'
						label='Anh dai dien (URL)'
						rules={[{ required: true, message: 'Vui long nhap URL anh dai dien' }]}
					>
						<Input placeholder='https://...' />
					</Form.Item>
					<Form.Item
						name='tags'
						label='The'
						rules={[{ required: true, message: 'Vui long chon it nhat 1 the' }]}
					>
						<Select mode='multiple' placeholder='Chon the cho bai viet'>
							{tags.map((tag: any) => (
								<Select.Option key={tag.id} value={tag.name}>
									#{tag.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='status' label='Trang thai' rules={[{ required: true }]}>
						<Select>
							<Select.Option value='draft'>Nhap</Select.Option>
							<Select.Option value='published'>Da dang</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default QuanLyBaiVietPage;
