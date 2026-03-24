import { useState } from 'react';
import {
  Button, Form, Input, Modal, Space, Table, Popconfirm, 
  message, InputNumber, Card, Typography, Divider
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { NhanVienThucHien } from '@/models/dichvucattoc';

const { Title, Text } = Typography;

const QuanLyNhanVien = () => {

  const { nhanVienThucHien, addNhanVienThucHien, updateNhanVienThucHien, deleteNhanVienThucHien } = useModel('dichvucattoc');

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();


  const onHandleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit && editingId !== null) {
     
        updateNhanVienThucHien(editingId, values);
        message.success('Cập nhật thông tin nhân viên thành công');
      } else {
   
        addNhanVienThucHien(values);
        message.success('Thêm nhân viên mới thành công');
      }
      
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'sdt',
      key: 'sdt',
    },
    {
      title: 'Giới hạn khách/ngày',
      dataIndex: 'gioiHanKhachHang',
      key: 'gioiHanKhachHang',
      align: 'center' as const,
      render: (val: number) => (
        <Text type="danger" strong>{val} khách</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
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
            title="Bạn có chắc chắn muốn xóa nhân viên này?" 
            onConfirm={() => {
              deleteNhanVienThucHien(record.id);
              message.success('Đã xóa nhân viên');
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
      title={<Title level={4}>QUẢN LÝ NHÂN VIÊN PHỤC VỤ</Title>} 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setIsEdit(false);
            setEditingId(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          Thêm nhân viên
        </Button>
      }
    >
   
      <Table 
        columns={columns} 
        dataSource={nhanVienThucHien} 
        rowKey="id" 
        bordered
        pagination={{ pageSize: 10 }}
      />

    
      <Modal
        title={isEdit ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onHandleOk}
        okText={isEdit ? "Lưu thay đổi" : "Thêm mới"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="tenNhanVien" 
            label="Họ và Tên" 
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item 
            name="sdt" 
            label="Số Điện Thoại" 
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ (10 chữ số)' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Ví dụ: 0987654321" />
          </Form.Item>

          <Form.Item 
            name="gioiHanKhachHang" 
            label="Giới hạn khách phục vụ/ngày" 
            rules={[{ required: true, message: 'Vui lòng nhập giới hạn khách' }]}
          >
            <InputNumber 
              min={1} 
              max={100} 
              style={{ width: '100%' }} 
              placeholder="Số lượng khách tối đa nhân viên có thể nhận trong 1 ngày" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyNhanVien;