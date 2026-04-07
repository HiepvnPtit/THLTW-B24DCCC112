import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},


	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},


	{
		path: '/Shop',
		name: 'Shop',
		icon: 'ShopOutlined',
		routes: [
			{ path: '/Shop', redirect: '/Shop/TableSP' },
			{
				path: '/Shop/TableSP',
				name: 'Quản lý Sản phẩm',
				component: './TableSP',
			},
			{
				path: '/Shop/TableDH',
				name: 'Quản lý Đơn hàng',
				component: './TableDH',
			},
		],
	},


	{
		path: '/Game',
		name: 'Game',
		icon: 'GameOutlined',
		routes: [
			{ path: '/Game', redirect: '/Game/game-play' },
			{
				path: '/Game/game-play',
				name: 'Game',
				component: './Game',
			},
			{
				path: '/Game/oan-tu-ti',
				name: 'Game Oẳn Tù Tì',
				component: './GameOanTuTi',
			},
		],
	},


	{
		path: '/MonHoc',
		name: 'Môn Học',
		icon: 'BookOutlined',
		routes: [
			{ path: '/MonHoc', redirect: '/MonHoc/danh-muc-mon-hoc' },
			{
				path: '/MonHoc/danh-muc-mon-hoc',
				name: 'Danh mục Môn học',
				component: './QuanLyMonHoc',
			},
			{
				path: '/MonHoc/quan-ly-tien-do-mon-hoc',
				name: 'Quản lý Tiến độ Môn học',
				component: './QuanLyTienDoMonHoc',
			},
			{
				path: '/MonHoc/quan-ly-muc-tieu-mon-hoc',
				name: 'Quản lý Mục tiêu Môn học',
				component: './QuanLyMucTieuMonHoc',
			},
		],
	},
	{
		path: '/quan-ly-he-thong',
		name: 'Quản lý Hệ thống',
		icon: 'SettingOutlined',
		routes: [
			{ path: '/quan-ly-he-thong', redirect: '/quan-ly-he-thong/dich-vu' },
			{
				path: '/quan-ly-he-thong/dich-vu',
				name: 'Dịch vụ',
				component: './QuanLyDichVu'
			},
			{
				path: '/quan-ly-he-thong/nhan-vien',
				name: 'Nhân viên phục vụ',
				component: './QuanLyNhanVien',
			},
			{
				path: '/quan-ly-he-thong/danh-gia',
				name: 'Đánh giá khách hàng',
				component: './QuanLyDanhGia',
			},
		]
	},


	{
		path: '/dat-lich',
		name: 'Quản lý Lịch hẹn',
		icon: 'CalendarOutlined',
		routes: [
			{ path: '/dat-lich', redirect: '/dat-lich/danh-sach' },
			{
				path: '/dat-lich/danh-sach',
				name: 'Danh sách lịch',
				component: './LichHen'
			},

		]
	},


	{
		path: '/thong-ke',
		name: 'Thống kê & Báo cáo',
		icon: 'BarChartOutlined',
		component: './ThongKe',
	},
	{
		path: '/du-lich',
		name: 'Du lịch',
		icon: 'CompassOutlined',
		routes: [
			{ path: '/du-lich', redirect: '/du-lich/kham-pha' },
			{
				path: '/du-lich/kham-pha',
				name: 'Khám phá điểm đến',
				component: './DuLich/KhamPha',
			},
			{
				path: '/du-lich/tao-lich-trinh',
				name: 'Tạo lịch trình',
				component: './DuLich/TaoLichTrinh',
			},
			{
				path: '/du-lich/quan-ly-dia-diem',
				name: 'Quản lý điểm đến',
				component: './DuLich/QuanLyDiaDiem',
			},
			{
				path: '/du-lich/bao-cao',
				name: 'Báo cáo du lịch',
				component: './DuLich/BaoCao',
			},
		],
	},
	{
		path: '/cau-lac-bo',
		name: 'Quản lý Câu lạc bộ',
		icon: 'TeamOutlined',
		routes: [
			{ path: '/cau-lac-bo', redirect: '/cau-lac-bo/danh-sach' },
			{
				path: '/cau-lac-bo/danh-sach',
				name: 'Danh sách CLB',
				component: './QuanLyCauLacBo/DanhSachCLB',
			},
			{
				path: '/cau-lac-bo/don-dang-ky',
				name: 'Đơn đăng ký',
				component: './QuanLyCauLacBo/DonDangKy',
			},
			{
				path: '/cau-lac-bo/thanh-vien',
				name: 'Thành viên',
				component: './QuanLyCauLacBo/ThanhVien',
			},
			{
				path: '/cau-lac-bo/bao-cao',
				name: 'Báo cáo',
				component: './QuanLyCauLacBo/BaoCao',
			},
		],
	},


	{
		path: '/DeThi',
		name: 'Đề Thi',
		icon: 'FileTextOutlined',
		routes: [
			{ path: '/DeThi', redirect: '/DeThi/quan-ly-khoi-kien-thuc' },
			{
				path: '/DeThi/quan-ly-khoi-kien-thuc',
				name: 'Quản lý Khối Kiến Thức',
				component: './QuanLyKhoiKienThuc',
			},
			{
				path: '/DeThi/quan-ly-cau-hoi',
				name: 'Quản lý Câu Hỏi',
				component: './QuanLyCauHoi',
			},
			{
				path: '/DeThi/tao-de-thi',
				name: 'Tạo Đề Thi',
				component: './TaoDeThi',
			},
		],
	},
	{
		path: '/HeThongQuanLyVanBang',
		name: 'Hệ thống Quản lý Văn bằng',
		icon: 'FileDoneOutlined',
		routes: [
			{ path: '/HeThongQuanLyVanBang', redirect: '/HeThongQuanLyVanBang/danh-muc-so-van-bang' },
			{
				path: '/HeThongQuanLyVanBang/danh-muc-so-van-bang',
				name: 'Danh mục Sổ Văn bằng',
				component: './QuanLySoVanBang',
			},
			{
				path: '/HeThongQuanLyVanBang/danh-muc-quyet-dinh',
				name: 'Danh mục Quyết định',
				component: './QuyetDinhTotNghiep',
			},
			{
				path: '/HeThongQuanLyVanBang/cau-hinh-bieu-mau-phu-luc',
				name: 'Cấu hình Biểu mẫu Phụ lục Văn bằng',
				component: './CauHinhBieuMauPhuLucVanBang',
			},
			{
				path: '/HeThongQuanLyVanBang/thong-tin-van-bang',
				name: 'Thông tin Văn bằng',
				component: './ThongTinVanBang',
			},
			{
				path: '/HeThongQuanLyVanBang/tra-cuu-van-bang',
				name: 'Tra cứu Văn bằng',
				component: './TraCuuVanBang',
			},
			// {
			
			
			
		]

	},
	
	
	// {
	// 	path: '/danh-muc-van-bang',
	// 	name: 'Danh mục Văn bằng',
	// 	icon: 'FileDoneOutlined',
	// 	component: './DanhMucVanBang',
	// }
	// ,
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];