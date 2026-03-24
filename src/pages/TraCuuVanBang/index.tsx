import { useState } from 'react';
import {
  Button, Form, Input, Card, Typography, Row, Col, 
  Table, Empty, Tag, Descriptions, Modal, message, Divider, Space
} from 'antd';
import { SearchOutlined, IdcardOutlined, AuditOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { VanBang, SearchVanBangParams } from '@/models/danhmucvanbang';

const { Title, Text } = Typography;

const TraCuuVanBang = () => {
  const { traCuuVanBang, danhMucQuyetDinh, fieldConfig } = useModel('danhmucvanbang');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VanBang[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VanBang | null>(null);
  const [form] = Form.useForm();

 
  const onSearch = async (values: SearchVanBangParams) => {

    try {
      setLoading(true);
      const data = await traCuuVanBang(values);
      setResults(data);
      setHasSearched(true);
      if (data.length === 0) {
        message.warning('Không tìm thấy thông tin văn bằng khớp với dữ liệu nhập');
      } else {
        message.success(`Tìm thấy ${data.length} kết quả`);
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi tra cứu');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Họ và Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Mã Sinh Viên', dataIndex: 'maSinhVien', key: 'maSinhVien' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: VanBang) => (
        <Button 
          type="primary" 
          ghost 
          icon={<InfoCircleOutlined />} 
          onClick={() => setSelectedRecord(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <AuditOutlined style={{ fontSize: 40, color: '#1890ff' }} />
          <Title level={2} style={{ marginTop: 10 }}>TRA CỨU THÔNG TIN VĂN BẰNG</Title>
          <Text type="secondary">Vui lòng nhập ít nhất 2 thông tin bên dưới để tiến hành tra cứu</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onSearch}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng">
                <Input placeholder="VD: B123456" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="soVaoSo" label="Số vào sổ">
                <Input placeholder="VD: 10" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="maSinhVien" label="Mã sinh viên">
                <Input placeholder="VD: SV001" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item name="hoTen" label="Họ và tên">
                <Input placeholder="Nhập đầy đủ họ tên" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item name="ngaySinh" label="Ngày sinh">
                <Input placeholder="Định dạng YYYY-MM-DD" allowClear />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Space size="middle">
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading} size="large" style={{ minWidth: 150 }}>
                Tìm kiếm
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => { form.resetFields(); setHasSearched(false); setResults([]); }} size="large">
                Làm mới
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      <div style={{ marginTop: 30 }}>
        {hasSearched && results.length > 0 && (
          <Card title="KẾT QUẢ TÌM KIẾM">
            <Table 
              columns={columns} 
              dataSource={results} 
              rowKey="id" 
              pagination={false} 
              bordered 
            />
          </Card>
        )}

        {hasSearched && results.length === 0 && !loading && (
          <Card><Empty description="Không tìm thấy dữ liệu phù hợp" /></Card>
        )}
      </div>

      <Modal
        title={<span><IdcardOutlined /> THÔNG TIN CHI TIẾT VĂN BẰNG</span>}
        visible={!!selectedRecord}
        onCancel={() => setSelectedRecord(null)}
        footer={[<Button key="close" onClick={() => setSelectedRecord(null)}>Đóng</Button>]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <Descriptions title="Thông tin sinh viên" bordered column={2}>
              <Descriptions.Item label="Họ và Tên" span={2}><Text strong>{selectedRecord.hoTen}</Text></Descriptions.Item>
              <Descriptions.Item label="Mã Sinh Viên">{selectedRecord.maSinhVien}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{selectedRecord.ngaySinh}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Thông tin văn bằng" bordered column={2}>
              <Descriptions.Item label="Số hiệu văn bằng"><Tag color="blue">{selectedRecord.soHieuVanBang}</Tag></Descriptions.Item>
              <Descriptions.Item label="Số vào sổ"><Tag color="volcano">{selectedRecord.soVaoSo}</Tag></Descriptions.Item>
        
              {fieldConfig.map(field => (
                <Descriptions.Item key={field.id} label={field.tenTruong}>
                  {selectedRecord.extraFields?.[field.maTruong] || '---'}
                </Descriptions.Item>
              ))}
            </Descriptions>

            <Divider />

          
            <Descriptions title="Thông tin quyết định tốt nghiệp" bordered column={1}>
              {(() => {
                const qd = danhMucQuyetDinh.find(q => q.id === selectedRecord.quyetDinhId);
                return (
                  <>
                    <Descriptions.Item label="Số quyết định"><Text strong>{qd?.soQuyetDinh}</Text></Descriptions.Item>
                    <Descriptions.Item label="Ngày ban hành">{qd?.ngayBanHanh}</Descriptions.Item>
                    <Descriptions.Item label="Trích yếu">{qd?.trichYeu}</Descriptions.Item>
                  </>
                );
              })()}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TraCuuVanBang;