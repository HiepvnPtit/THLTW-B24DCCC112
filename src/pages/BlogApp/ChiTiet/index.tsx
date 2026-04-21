import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Empty, Row, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useMemo, useRef } from 'react';
import { history, useModel, useParams } from 'umi';

const { Paragraph, Text, Title } = Typography;

const BlogChiTietPage = () => {
	const { slug } = useParams<{ slug: string }>();
	const { profile, getPostBySlug, getRelatedPostsBySlug, incrementViewBySlug } = useModel('blogapp' as any) as any;
	const hasIncreasedRef = useRef(false);

	useEffect(() => {
		hasIncreasedRef.current = false;
	}, [slug]);

	useEffect(() => {
		if (!slug || hasIncreasedRef.current) return;
		incrementViewBySlug(slug);
		hasIncreasedRef.current = true;
	}, [slug, incrementViewBySlug]);

	const post = getPostBySlug(slug);
	const relatedPosts = useMemo(() => getRelatedPostsBySlug(slug, 3), [getRelatedPostsBySlug, slug]);

	if (!post || post.status !== 'published') {
		return (
			<Card>
				<Empty description='Khong tim thay bai viet hoac bai viet chua duoc dang.' />
				<Button style={{ marginTop: 12 }} onClick={() => history.push('/blog-app/trang-chu')}>
					Quay lai danh sach
				</Button>
			</Card>
		);
	}

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Card>
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={() => {
						if (window.history.length > 1) history.goBack();
						else history.push('/blog-app/trang-chu');
					}}
				>
					Quay lai danh sach
				</Button>
			</Card>

			<Card
				cover={
					<img src={post.coverUrl} alt={post.title} style={{ maxHeight: 420, objectFit: 'cover' }} />
				}
			>
				<Space direction='vertical' size={14} style={{ width: '100%' }}>
					<Title level={2} style={{ marginBottom: 0 }}>
						{post.title}
					</Title>
					<Space size={16} wrap>
						<Space size={6}>
							<UserOutlined />
							<Text>{post.authorName || profile.name}</Text>
						</Space>
						<Space size={6}>
							<CalendarOutlined />
							<Text>{moment(post.publishedAt || post.createdAt).format('HH:mm DD/MM/YYYY')}</Text>
						</Space>
						<Space size={6}>
							<EyeOutlined />
							<Text>{post.views} luot xem</Text>
						</Space>
					</Space>
					<div>
						{post.tags.map((tag: string) => (
							<Tag key={tag}>#{tag}</Tag>
						))}
					</div>
					<div style={{ lineHeight: 1.8 }}>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
					</div>
				</Space>
			</Card>

			<Card title='Tac gia'>
				<Space size={14} align='start'>
					<Avatar size={72} src={profile.avatarUrl} />
					<Space direction='vertical' size={4}>
						<Title level={5} style={{ marginBottom: 0 }}>
							{profile.name}
						</Title>
						<Paragraph type='secondary' style={{ marginBottom: 0 }}>
							{profile.bio}
						</Paragraph>
					</Space>
				</Space>
			</Card>

			<Card title='Bai viet lien quan'>
				{relatedPosts.length ? (
					<Row gutter={[16, 16]}>
						{relatedPosts.map((item: any) => (
							<Col xs={24} md={8} key={item.id}>
								<Card
									hoverable
									size='small'
									onClick={() => history.push(`/blog-app/bai-viet/${item.slug}`)}
								>
									<Title level={5}>{item.title}</Title>
									<Text type='secondary'>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
								</Card>
							</Col>
						))}
					</Row>
				) : (
					<Empty description='Khong co bai viet lien quan.' />
				)}
			</Card>
		</Space>
	);
};

export default BlogChiTietPage;
