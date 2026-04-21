import { GithubOutlined, GlobalOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { useModel } from 'umi';

const { Paragraph, Text, Title } = Typography;

const getSocialIcon = (platform: string) => {
	const name = platform.toLowerCase();
	if (name.includes('github')) return <GithubOutlined />;
	if (name.includes('linkedin')) return <LinkedinOutlined />;
	return <GlobalOutlined />;
};

const BlogGioiThieuPage = () => {
	const { profile } = useModel('blogapp' as any) as any;

	return (
		<Card>
			<Row gutter={[24, 24]} align='middle'>
				<Col xs={24} md={8}>
					<Space direction='vertical' size={14} style={{ width: '100%', alignItems: 'center' }}>
						<Avatar src={profile.avatarUrl} size={180} />
						<Title level={3} style={{ marginBottom: 0, textAlign: 'center' }}>
							{profile.name}
						</Title>
					</Space>
				</Col>
				<Col xs={24} md={16}>
					<Space direction='vertical' size={14} style={{ width: '100%' }}>
						<Title level={4} style={{ marginBottom: 0 }}>
							Gioi thieu
						</Title>
						<Paragraph>{profile.bio}</Paragraph>
						<div>
							<Text strong>Ky nang:</Text>
							<div style={{ marginTop: 8 }}>
								{profile.skills.map((skill: string) => (
									<Tag color='blue' key={skill} style={{ marginBottom: 8 }}>
										{skill}
									</Tag>
								))}
							</div>
						</div>
						<div>
							<Text strong>Mang xa hoi:</Text>
							<Space direction='vertical' size={6} style={{ marginTop: 8 }}>
								{profile.socials.map((item: any) => (
									<a href={item.url} target='_blank' rel='noreferrer' key={item.platform}>
										<Space>
											{getSocialIcon(item.platform)}
											<Text>{item.platform}</Text>
										</Space>
									</a>
								))}
							</Space>
						</div>
					</Space>
				</Col>
			</Row>
		</Card>
	);
};

export default BlogGioiThieuPage;
