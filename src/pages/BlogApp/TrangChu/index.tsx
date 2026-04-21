import { CalendarOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Input, Pagination, Row, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';

const { Paragraph, Text, Title } = Typography;

const PAGE_SIZE = 9;

const toSummary = (markdown: string) =>
	markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/#+\s/g, '')
		.replace(/[*_~`>\[\]()!-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 140);

const BlogTrangChuPage = () => {
	const { tags, profile, getFilteredPublishedPosts } = useModel('blogapp' as any) as any;
	const [keyword, setKeyword] = useState('');
	const [debouncedKeyword, setDebouncedKeyword] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setDebouncedKeyword(keyword);
		}, 300);
		return () => window.clearTimeout(timer);
	}, [keyword]);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedKeyword, selectedTag]);

	const filteredPosts = useMemo(
		() => getFilteredPublishedPosts(debouncedKeyword, selectedTag),
		[getFilteredPublishedPosts, debouncedKeyword, selectedTag],
	);

	const pagedPosts = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return filteredPosts.slice(start, start + PAGE_SIZE);
	}, [filteredPosts, currentPage]);

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Card>
				<Space direction='vertical' size={6} style={{ width: '100%' }}>
					<Title level={3} style={{ marginBottom: 0 }}>
						Blog ca nhan
					</Title>
					<Text type='secondary'>Noi chia se bai viet, ghi chu ky thuat va kinh nghiem lam du an.</Text>
					<Input
						allowClear
						prefix={<SearchOutlined />}
						placeholder='Tim theo tieu de, noi dung, tag...'
						value={keyword}
						onChange={(event) => setKeyword(event.target.value)}
					/>
					<Space wrap>
						<Tag
							color={!selectedTag ? 'blue' : 'default'}
							onClick={() => setSelectedTag(undefined)}
							style={{ cursor: 'pointer' }}
						>
							Tat ca
						</Tag>
						{tags.map((tag: any) => (
							<Tag
								key={tag.id}
								color={selectedTag === tag.name ? 'blue' : 'default'}
								onClick={() => setSelectedTag(tag.name)}
								style={{ cursor: 'pointer' }}
							>
								#{tag.name}
							</Tag>
						))}
					</Space>
				</Space>
			</Card>

			{pagedPosts.length ? (
				<Row gutter={[16, 16]}>
					{pagedPosts.map((post: any) => (
						<Col xs={24} sm={12} lg={8} key={post.id}>
							<Card
								hoverable
								cover={
									<img
										src={post.coverUrl}
										alt={post.title}
										style={{ height: 180, objectFit: 'cover' }}
									/>
								}
								onClick={() => history.push(`/blog-app/bai-viet/${post.slug}`)}
							>
								<Space direction='vertical' size={8} style={{ width: '100%' }}>
									<Title level={5} style={{ marginBottom: 0 }}>
										{post.title}
									</Title>
									<Paragraph ellipsis={{ rows: 3 }} type='secondary' style={{ marginBottom: 0 }}>
										{toSummary(post.content)}
									</Paragraph>
									<Space size={12} wrap>
										<Space size={6}>
											<CalendarOutlined />
											<Text type='secondary'>{moment(post.publishedAt || post.createdAt).format('DD/MM/YYYY')}</Text>
										</Space>
										<Space size={6}>
											<UserOutlined />
											<Text type='secondary'>{post.authorName || profile?.name}</Text>
										</Space>
									</Space>
									<div>
										{post.tags.map((tag: string) => (
											<Tag
												key={`${post.id}-${tag}`}
												color={selectedTag === tag ? 'blue' : 'default'}
												onClick={(event) => {
													event.stopPropagation();
													setSelectedTag(tag);
												}}
												style={{ cursor: 'pointer', marginBottom: 6 }}
											>
												#{tag}
											</Tag>
										))}
									</div>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			) : (
				<Card>
					<Empty description='Khong co bai viet phu hop voi bo loc hien tai.' />
				</Card>
			)}

			{filteredPosts.length > PAGE_SIZE && (
				<Card>
					<Pagination
						current={currentPage}
						pageSize={PAGE_SIZE}
						total={filteredPosts.length}
						onChange={setCurrentPage}
						showSizeChanger={false}
					/>
				</Card>
			)}
		</Space>
	);
};

export default BlogTrangChuPage;
