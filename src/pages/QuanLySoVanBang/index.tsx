import { useState } from 'react';
import {
  Button, Form, Input, Modal, Space, Table, Popconfirm, 
  message, InputNumber, Card, Typography, Divider, Tag, Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { SoVanBang } from '@/models/danhmucvanbang'; 
const { Title, Text } = Typography;
const { Option } = Select;

const QuanLySoVanBang = () => {

  const { danhMucSoVanBang, addSoVanBang, updateSoVanBang, deleteSoVanBang } = useModel('danhmucvanbang');

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  
  const onHandleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit && editingId !== null) {
      
        const oldSo = danhMucSoVanBang.find(s => s.id === editingId);
        updateSoVanBang({ 
            ...values, 
            id: editingId, 
            soHienTai: oldSo?.soHienTai || 0 
        });
        message.success('Cập nhật sổ văn bằng thành công');
      } else {
     
        addSoVanBang({ 
          ...values, 
          soHienTai: 0 
        });
        message.success('Mở sổ văn bằng mới thành công');
      }
      
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const columns = [
    {
      title: 'Tên Sổ Văn Bằng',
      dataIndex: 'tenSo',
      key: 'tenSo',
      render: (text: string) => <Text strong><BookOutlined /> {text}</Text>
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as const,
      render: (year: number) => <Tag color="blue">{year}</Tag>
    },
    {
      title: 'Số hiện tại',
      dataIndex: 'soHienTai',
      key: 'soHienTai',
      align: 'center' as const,
      render: (val: number) => <Text type="danger" strong>{val}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'ĐANG MỞ' : 'ĐÃ KHÓA'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: SoVanBang) => (
        <Space split={<Divider type="vertical" />}>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setEditingId(record.id);
              form.setFieldsValue(record); 
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          
          <Popconfirm 
            title="Xóa sổ sẽ mất toàn bộ dữ liệu liên quan. Bạn có chắc chắn?" 
            onConfirm={() => {
              deleteSoVanBang(record.id);
              message.success('Đã xóa sổ văn bằng');
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={<Title level={4}>QUẢN LÝ SỔ VĂN BẰNG</Title>} 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setIsEdit(false);
            setEditingId(null);
            form.resetFields();
            
            form.setFieldsValue({ year: new Date().getFullYear(), trangThai: 'active' });
            setVisible(true);
          }}
        >
          Mở sổ mới
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={danhMucSoVanBang} 
        rowKey="id" 
        bordered
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={isEdit ? "Chỉnh sửa thông tin sổ" : "Mở sổ văn bằng mới"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onHandleOk}
        okText={isEdit ? "Lưu thay đổi" : "Tạo sổ"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="tenSo" 
            label="Tên sổ văn bằng" 
            rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}
          >
            <Input prefix={<BookOutlined />} placeholder="Ví dụ: Sổ cấp bằng năm 2024" />
          </Form.Item>

          <Form.Item 
            name="year" 
            label="Năm tốt nghiệp" 
            rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
          >
            <InputNumber 
              prefix={<CalendarOutlined />} 
              style={{ width: '100%' }} 
              placeholder="2024" 
            />
          </Form.Item>

          <Form.Item 
            name="trangThai" 
            label="Trạng thái hoạt động" 
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">Đang mở (Có thể thêm bằng)</Option>
              <Option value="closed">Đã khóa (Chỉ xem dữ liệu)</Option>
            </Select>
          </Form.Item>
          
          {isEdit && (
             <Form.Item label="Số thứ tự hiện tại (Tự tăng)">
                <InputNumber disabled value={danhMucSoVanBang.find(s => s.id === editingId)?.soHienTai} style={{ width: '100%' }} />
             </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLySoVanBang;