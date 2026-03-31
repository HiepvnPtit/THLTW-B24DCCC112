import { useState } from 'react';
import { Button, Form, Input, Modal, Space, Table, Popconfirm, message, InputNumber, Card, Typography, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DichVuCaToc } from '@/models/dichvucattoc';

const { Title } = Typography;

const QuanLyDichVu = () => {
  const { dichVuCaToc, addDichVuCaToc, updateDichVuCaToc, deleteDichVuCaToc } = useModel('dichvucattoc');
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const onHandleOk = async () => {
    const values = await form.validateFields();
    if (isEdit && editingId) {
      updateDichVuCaToc(editingId, values);
      message.success('Cập nhật dịch vụ thành công');
    } else {
      addDichVuCaToc(values);
      message.success('Thêm dịch vụ mới thành công');
    }
    setVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Tên Dịch Vụ', dataIndex: 'tenDichVu', key: 'tenDichVu' },
    { 
      title: 'Giá Tiền', 
      dataIndex: 'giaTien', 
      render: (val: number) => val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) 
    },
    { title: 'Thời gian (phút)', dataIndex: 'thoiGianThucHien', align: 'center' as const },
    { title: 'Mô tả', dataIndex: 'moTa' },
    {
      title: 'Hành Động',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setIsEdit(true); setEditingId(record.id);
            form.setFieldsValue(record); setVisible(true);
          }}>Sửa</Button>
          <Popconfirm title="Xóa dịch vụ này?" onConfirm={() => deleteDichVuCaToc(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <Card title={<Title level={4}>DANH MỤC DỊCH VỤ</Title>} extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => {
        setIsEdit(false); form.resetFields(); setVisible(true);
      }}>Thêm dịch vụ</Button>
    }>
      <Table columns={columns} dataSource={dichVuCaToc} rowKey="id" />
      <Modal
        title={isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onHandleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenDichVu" label="Tên Dịch Vụ" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Cắt tóc layer" />
          </Form.Item>
          <Form.Item name="giaTien" label="Giá Tiền (VNĐ)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item name="thoiGianThucHien" label="Thời gian thực hiện (phút)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyDichVu;