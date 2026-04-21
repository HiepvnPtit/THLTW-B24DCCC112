import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

export type TBlogStatus = 'draft' | 'published';

export interface IBlogPost {
	id: string;
	title: string;
	slug: string;
	content: string;
	coverUrl: string;
	tags: string[];
	status: TBlogStatus;
	views: number;
	authorName: string;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
}

export interface IBlogTag {
	id: string;
	name: string;
}

export interface IAuthorProfile {
	avatarUrl: string;
	name: string;
	bio: string;
	skills: string[];
	socials: { platform: string; url: string }[];
}

const POSTS_KEY = 'blogapp.posts';
const TAGS_KEY = 'blogapp.tags';
const PROFILE_KEY = 'blogapp.profile';

const createSlug = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

const getSummary = (markdown: string) => {
	const plain = markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/#+\s/g, '')
		.replace(/[*_~`>\[\]()!-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return plain.slice(0, 180);
};

const defaultProfile: IAuthorProfile = {
	avatarUrl:
		'https://avatars.githubusercontent.com/u/201686270?s=400&u=23c542b7548788ae4e469987e4fe20a8218bd87f&v=4',
	name: 'HiepvnPtit',
	bio: 'Frontend Engineer yeu thich chia se kien thuc ve React, TypeScript va toi uu trai nghiem nguoi dung.',
	skills: ['React', 'TypeScript', 'Ant Design', 'UmiJS', 'Node.js'],
	socials: [
		{ platform: 'GitHub', url: 'https://github.com/HiepvnPtit' },
		{ platform: 'LinkedIn', url: 'https://www.linkedin.com/' },
		{ platform: 'Facebook', url: 'https://facebook.com/' },
	],
};

const defaultTags: IBlogTag[] = [
	{ id: 'tag-1', name: 'react' },
	{ id: 'tag-2', name: 'typescript' },
	{ id: 'tag-3', name: 'frontend' },
	{ id: 'tag-4', name: 'performance' },
	{ id: 'tag-5', name: 'testing' },
	{ id: 'tag-6', name: 'career' },
];

const basePost = (
	id: number,
	title: string,
	tags: string[],
	status: TBlogStatus,
	daysAgo: number,
): IBlogPost => {
	const createdDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
	const createdAt = createdDate.toISOString();
	const content = `# ${title}\n\n## Mo dau\nBai viet nay chia se kinh nghiem thuc te ve **${tags.join(', ')}**.\n\n## Noi dung chinh\n- Cach tiep can bai toan\n- Cac buoc trien khai\n- Bai hoc rut ra\n\n## Ket luan\nNeu ban dang hoc va lam du an, hay thu ap dung cac meo tren de cai thien chat luong san pham.`;

	return {
		id: `post-${id}`,
		title,
		slug: createSlug(title),
		content,
		coverUrl: 'https://avatars.githubusercontent.com/u/201686270?s=400&u=23c542b7548788ae4e469987e4fe20a8218bd87f&v=4',
		tags,
		status,
		views: 25 + id * 7,
		authorName: 'B24DCCC112-VƯƠNG NGỌC HIỆP',
		createdAt,
		updatedAt: createdAt,
		publishedAt: status === 'published' ? createdAt : undefined,
	};
};

const defaultPosts: IBlogPost[] = [
	basePost(1, 'Toi uu hieu nang React app voi memo va lazy loading', ['react', 'performance'], 'published', 1),
	basePost(2, 'Nhung quy tac TypeScript giup code de bao tri hon', ['typescript', 'frontend'], 'published', 2),
	basePost(3, 'Checklist review code frontend cho team nho', ['frontend', 'testing'], 'published', 3),
	basePost(4, 'Test component voi mindset huong hanh vi', ['testing', 'react'], 'published', 4),
	basePost(5, 'So sanh state management trong cac du an vua va nho', ['react', 'frontend'], 'published', 5),
	basePost(6, 'Giam thoi gian render bang cach tach component thong minh', ['performance', 'react'], 'published', 6),
	basePost(7, 'Viet custom hook de tai su dung logic nghiep vu', ['react', 'typescript'], 'published', 7),
	basePost(8, 'Roadmap frontend cho sinh vien nam cuoi', ['career', 'frontend'], 'published', 8),
	basePost(9, 'Khi nao nen dung e2e test va khi nao khong', ['testing', 'career'], 'published', 9),
	basePost(10, 'Xu ly form phuc tap voi validation ro rang', ['frontend', 'typescript'], 'published', 10),
	basePost(11, 'Phan tich bundle va cach cat giam JavaScript khong can thiet', ['performance', 'frontend'], 'draft', 11),
	basePost(12, 'Ke hoach hoc React trong 8 tuan cho nguoi moi', ['career', 'react'], 'draft', 12),
];

const readStorage = <T,>(key: string, fallback: T): T => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw);
		return parsed ?? fallback;
	} catch (error) {
		return fallback;
	}
};

export default () => {
	const [posts, setPosts] = useState<IBlogPost[]>(() => readStorage<IBlogPost[]>(POSTS_KEY, defaultPosts));
	const [tags, setTags] = useState<IBlogTag[]>(() => readStorage<IBlogTag[]>(TAGS_KEY, defaultTags));
	const [profile, setProfile] = useState<IAuthorProfile>(() => readStorage<IAuthorProfile>(PROFILE_KEY, defaultProfile));

	useEffect(() => {
		localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
	}, [posts]);

	useEffect(() => {
		localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
	}, [tags]);

	useEffect(() => {
		localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
	}, [profile]);

	const publishedPosts = useMemo(
		() => posts.filter((item) => item.status === 'published').sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
		[posts],
	);

	const getTagUsageCount = (tagName: string) => posts.filter((item) => item.tags.includes(tagName)).length;

	const getPostBySlug = (slug: string) => posts.find((item) => item.slug === slug);

	const getFilteredPublishedPosts = (keyword: string, tag?: string) => {
		const normalizedKeyword = keyword.trim().toLowerCase();
		return publishedPosts.filter((item) => {
			const inTag = !tag || item.tags.includes(tag);
			if (!normalizedKeyword) return inTag;
			const text = `${item.title} ${item.content} ${item.tags.join(' ')} ${getSummary(item.content)}`.toLowerCase();
			return inTag && text.includes(normalizedKeyword);
		});
	};

	const getRelatedPostsBySlug = (slug: string, limit = 3) => {
		const current = getPostBySlug(slug);
		if (!current) return [];
		return publishedPosts
			.filter((item) => item.id !== current.id)
			.map((item) => ({
				...item,
				_score: item.tags.filter((tag) => current.tags.includes(tag)).length,
			}))
			.filter((item) => item._score > 0)
			.sort((a, b) => b._score - a._score)
			.slice(0, limit);
	};

	const ensureUniqueSlug = (slug: string, excludeId?: string) => {
		const found = posts.find((item) => item.slug === slug && item.id !== excludeId);
		if (found) throw new Error('Slug da ton tai. Vui long chon slug khac.');
	};

	const addPost = (payload: Omit<IBlogPost, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'publishedAt'>) => {
		const normalizedSlug = createSlug(payload.slug || payload.title);
		if (!normalizedSlug) throw new Error('Slug khong hop le');
		ensureUniqueSlug(normalizedSlug);
		const now = new Date().toISOString();
		const newPost: IBlogPost = {
			...payload,
			id: `post-${Date.now()}`,
			slug: normalizedSlug,
			views: 0,
			createdAt: now,
			updatedAt: now,
			publishedAt: payload.status === 'published' ? now : undefined,
		};
		setPosts((prev) => [newPost, ...prev]);
		message.success('Them bai viet thanh cong');
	};

	const updatePost = (
		id: string,
		payload: Omit<IBlogPost, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
	) => {
		const normalizedSlug = createSlug(payload.slug || payload.title);
		if (!normalizedSlug) throw new Error('Slug khong hop le');
		ensureUniqueSlug(normalizedSlug, id);
		setPosts((prev) =>
			prev.map((item) => {
				if (item.id !== id) return item;
				const nextStatus = payload.status;
				return {
					...item,
					...payload,
					slug: normalizedSlug,
					updatedAt: new Date().toISOString(),
					publishedAt: nextStatus === 'published' ? item.publishedAt || new Date().toISOString() : undefined,
				};
			}),
		);
		message.success('Cap nhat bai viet thanh cong');
	};

	const deletePost = (id: string) => {
		setPosts((prev) => prev.filter((item) => item.id !== id));
		message.success('Xoa bai viet thanh cong');
	};

	const incrementViewBySlug = (slug: string) => {
		setPosts((prev) =>
			prev.map((item) =>
				item.slug === slug
					? {
						...item,
						views: item.views + 1,
					}
					: item,
			),
		);
	};

	const addTag = (name: string) => {
		const normalizedName = name.trim().toLowerCase();
		if (!normalizedName) throw new Error('Ten the khong duoc de trong');
		if (tags.some((item) => item.name === normalizedName)) throw new Error('The da ton tai');
		setTags((prev) => [...prev, { id: `tag-${Date.now()}`, name: normalizedName }]);
		message.success('Them the thanh cong');
	};

	const updateTag = (id: string, newName: string) => {
		const normalizedName = newName.trim().toLowerCase();
		if (!normalizedName) throw new Error('Ten the khong duoc de trong');
		if (tags.some((item) => item.id !== id && item.name === normalizedName)) throw new Error('The da ton tai');

		const current = tags.find((item) => item.id === id);
		if (!current) throw new Error('Khong tim thay the');

		setTags((prev) => prev.map((item) => (item.id === id ? { ...item, name: normalizedName } : item)));
		setPosts((prev) =>
			prev.map((item) => ({
				...item,
				tags: item.tags.map((tag) => (tag === current.name ? normalizedName : tag)),
			})),
		);
		message.success('Cap nhat the thanh cong');
	};

	const deleteTag = (id: string) => {
		const current = tags.find((item) => item.id === id);
		if (!current) return;
		const usage = getTagUsageCount(current.name);
		if (usage > 0) throw new Error('Khong the xoa the dang duoc su dung trong bai viet');
		setTags((prev) => prev.filter((item) => item.id !== id));
		message.success('Xoa the thanh cong');
	};

	return {
		posts,
		tags,
		profile,
		setProfile,
		publishedPosts,
		getPostBySlug,
		getFilteredPublishedPosts,
		getRelatedPostsBySlug,
		getTagUsageCount,
		addPost,
		updatePost,
		deletePost,
		incrementViewBySlug,
		addTag,
		updateTag,
		deleteTag,
	};
};
