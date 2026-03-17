import React, { useState } from 'react';
import { 
  Card, Table, Rate, Typography, Space, Tag, List, 
  Avatar, Comment, Input, Button, Modal, message, Statistic, Row, Col, Divider 
} from 'antd';
import { MessageOutlined, StarOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DanhGiaKhachHang } from '@/models/dichvucattoc';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const QuanLyDanhGia = () => {
  const { 
    danhGiaKhachHang, updateDanhGiaKhachHang, 
    nhanVienThucHien, datLichHen, dichVuCaToc 
  } = useModel('dichvucattoc');

  const [replyVisible, setReplyVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<DanhGiaKhachHang | null>(null);
  const [replyContent, setReplyContent] = useState('');


  const stats = nhanVienThucHien.map(nv => {
   
    const listLichHenId = datLichHen.filter(l => l.nhanVienId === nv.id).map(l => l.id);
    
    const listReviews = danhGiaKhachHang.filter(dg => listLichHenId.includes(dg.lichHenId));
    
    const totalSao = listReviews.reduce((sum, item) => sum + item.soSao, 0);
    const trungBinh = listReviews.length > 0 ? (totalSao / listReviews.length).toFixed(1) : 0;

    return {
      ...nv,
      soLuongDG: listReviews.length,
      diemTB: Number(trungBinh)
    };
  });


  const handleReply = () => {
    if (!replyContent.trim()) {
      message.warning('Vui lòng nhập nội dung phản hồi');
      return;
    }
    updateDanhGiaKhachHang(currentReview.id, { phanHoiCuaNhanVien: replyContent });
    message.success('Đã gửi phản hồi thành công!');
    setReplyVisible(false);
    setReplyContent('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>ĐÁNH GIÁ DỊCH VỤ & NHÂN VIÊN</Title>

  
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map(s => (
          <Col span={6} key={s.id}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: 12 }} />
              <Title level={5} style={{ marginBottom: 0 }}>{s.tenNhanVien}</Title>
              <Rate disabled allowHalf value={s.diemTB} style={{ fontSize: 14 }} />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">{s.soLuongDG} lượt đánh giá</Text>
              </div>
              <Statistic value={s.diemTB} suffix="/ 5" valueStyle={{ color: '#faad14', fontSize: '20px' }} />
            </Card>
          </Col>
        ))}
      </Row>


      <Card title={<span><MessageOutlined /> Chi tiết phản hồi từ khách hàng</span>}>
        <List
          itemLayout="horizontal"
          dataSource={danhGiaKhachHang}
          renderItem={(item) => {
            const lichHen = datLichHen.find(l => l.id === item.lichHenId);
            const nv = nhanVienThucHien.find(n => n.id === lichHen?.nhanVienId);
            const dv = dichVuCaToc.find(d => d.id === lichHen?.dichVuId);

            return (
              <List.Item
                actions={[
                  !item.phanHoiCuaNhanVien ? (
                    <Button type="link" onClick={() => { setCurrentReview(item); setReplyVisible(true); }}>
                      Phản hồi
                    </Button>
                  ) : <Tag color="blue" icon={<CheckCircleOutlined />}>Đã phản hồi</Tag>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={`/logo.png`} />}
                  title={
                    <Space>
                      <Text strong>Khách hàng: {lichHen?.sdt}</Text>
                      <Rate disabled value={item.soSao} style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>| Dịch vụ: {dv?.tenDichVu}</Text>
                      <Tag color="cyan">Nhân viên: {nv?.tenNhanVien}</Tag>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Paragraph style={{ color: '#333', fontSize: 14, marginBottom: 4 }}>
                        " {item.noiDung} "
                      </Paragraph>
                      {item.phanHoiCuaNhanVien && (
                        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #d9d9d9' }}>
                          <Text strong style={{ fontSize: 12 }}>Phản hồi từ nhân viên:</Text>
                          <br />
                          <Text italic>{item.phanHoiCuaNhanVien}</Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>

 
      <Modal
        title="Phản hồi đánh giá khách hàng"
        visible={replyVisible}
        onCancel={() => setReplyVisible(false)}
        onOk={handleReply}
      >
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary">Nội dung khách đánh giá:</Text>
          <div style={{ padding: '8px', background: '#fff7e6', borderRadius: '4px', marginTop: 4 }}>
             "{currentReview?.noiDung}"
          </div>
        </div>
        <Text strong>Nội dung phản hồi:</Text>
        <TextArea 
          rows={4} 
          placeholder="Cảm ơn quý khách đã tin tưởng..." 
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </div>
  );
};

export default QuanLyDanhGia;