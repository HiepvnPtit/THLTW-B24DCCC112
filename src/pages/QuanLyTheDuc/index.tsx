import { Card, Col, Row } from 'antd';
import { Link } from 'umi';

const Home = () => {
  return (
    <div>
      <h2>Quản lý Thể dục</h2>
      <Row gutter={16}>
        <Col span={8}><Card><Link to='/QuanLyTheDuc/Dashboard'>Dashboard</Link></Card></Col>
        <Col span={8}><Card><Link to='/QuanLyTheDuc/NhatKyTapLuyen'>Nhật ký tập luyện</Link></Card></Col>
        <Col span={8}><Card><Link to='/QuanLyTheDuc/NhatKyChiSo'>Nhật ký chỉ số sức khỏe</Link></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 12 }}>
        <Col span={8}><Card><Link to='/QuanLyTheDuc/QuanLyMucTieu'>Quản lý mục tiêu</Link></Card></Col>
        <Col span={8}><Card><Link to='/QuanLyTheDuc/ThuVienBaiTap'>Thư viện bài tập</Link></Card></Col>
      </Row>
    </div>
  );
};

export default Home;
