import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DatLichHen, NhanVienThucHien, DichVuCaToc } from '@/models/dichvucattoc';

const { Title } = Typography;

const ThongKe = () => {
  const { datLichHen, dichVuCaToc, nhanVienThucHien } = useModel('dichvucattoc');

  const lichHoanThanh = datLichHen.filter(l => l.trangThai === 'Hoàn thành');


  const tongDoanhThu = lichHoanThanh.reduce((sum, item) => {
    const gia = dichVuCaToc.find(d => d.id === item.dichVuId)?.giaTien || 0;
    return sum + gia;
  }, 0);

 
  const statsNhanVien = nhanVienThucHien.map(nv => {
    const soLich = lichHoanThanh.filter(l => l.nhanVienId === nv.id).length;
    const doanhThu = lichHoanThanh.filter(l => l.nhanVienId === nv.id).reduce((sum, item) => {
        return sum + (dichVuCaToc.find(d => d.id === item.dichVuId)?.giaTien || 0);
    }, 0);
    return { ...nv, soLich, doanhThu };
  });

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>BÁO CÁO KINH DOANH</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng lịch hẹn thành công" value={lichHoanThanh.length} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
                title="Tổng doanh thu" 
                value={tongDoanhThu} 
                precision={0} 
                prefix={<DollarOutlined />} 
                suffix="đ" 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Nhân viên đang quản lý" value={nhanVienThucHien.length} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="Hiệu suất nhân viên" style={{ marginTop: '20px' }}>
        <Table 
            dataSource={statsNhanVien} 
            rowKey="id"
            pagination={false}
            columns={[
                { title: 'Nhân viên', dataIndex: 'tenNhanVien' },
                { title: 'Số lịch hoàn thành', dataIndex: 'soLich', align: 'center' },
                { 
                    title: 'Doanh thu mang lại', 
                    dataIndex: 'doanhThu', 
                    render: (v) => v.toLocaleString() + ' đ' 
                },
            ]}
        />
      </Card>
    </div>
  );
};

export default ThongKe;