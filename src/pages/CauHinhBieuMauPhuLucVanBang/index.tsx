import { useState } from 'react';
import {
  Button, Form, Input, Modal, Space, Table, Popconfirm, 
  message, Card, Typography, Divider, Tag, Select, Switch
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, KeyOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { FieldConfig, FieldType } from '@/models/danhmucvanbang';

const { Title, Text } = Typography;
const { Option } = Select;

const CauHinhBieuMau = () => {
 
  const { fieldConfig, updateFieldConfig } = useModel('danhmucvanbang');

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();


  const onHandleOk = async () => {
    try {
      const values = await form.validateFields();
      
      let newConfig = [...fieldConfig];

      if (isEdit && editingId !== null) {
       
        newConfig = newConfig.map(f => f.id === editingId ? { ...values, id: editingId } : f);
        message.success('Cập nhật trường thông tin thành công');
      } else {
       
        const newField: FieldConfig = {
          ...values,
          id: Date.now().toString(),
        };
        newConfig.push(newField);
        message.success('Thêm trường thông tin mới thành công');
      }
      
      updateFieldConfig(newConfig); 
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const columns = [
    {
      title: 'Tên trường thông tin',
      dataIndex: 'tenTruong',
      key: 'tenTruong',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Mã định danh (Code)',
      dataIndex: 'maTruong',
      key: 'maTruong',
      render: (text: string) => <Tag icon={<KeyOutlined />}>{text}</Tag>
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieuDuLieu',
      key: 'kieuDuLieu',
      align: 'center' as const,
      render: (type: FieldType) => {
        const colorMap = {
          String: 'blue',
          Number: 'orange',
          Date: 'purple'
        };
        return <Tag color={colorMap[type]}>{type.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'batBuoc',
      key: 'batBuoc',
      align: 'center' as const,
      render: (val: boolean) => (
        <Tag color={val ? 'red' : 'default'}>{val ? 'BẮT BUỘC' : 'TÙY CHỌN'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: FieldConfig) => (
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
            title="Xóa trường này có thể làm mất dữ liệu trong văn bằng đã nhập. Bạn chắc chắn?" 
            onConfirm={() => {
              const newConfig = fieldConfig.filter(f => f.id !== record.id);
              updateFieldConfig(newConfig);
              message.success('Đã xóa trường thông tin');
            }}
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
      title={<Title level={4}><SettingOutlined /> CẤU HÌNH BIỂU MẪU PHỤ LỤC</Title>} 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setIsEdit(false);
            setEditingId(null);
            form.resetFields();
            form.setFieldsValue({ kieuDuLieu: 'String', batBuoc: true });
            setVisible(true);
          }}
        >
          Thêm trường thông tin
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          * Các trường cấu hình ở đây sẽ xuất hiện khi bạn nhập thông tin văn bằng cho sinh viên.
        </Text>
      </div>

      <Table 
        columns={columns} 
        dataSource={fieldConfig} 
        rowKey="id" 
        bordered
        pagination={false}
      />

      <Modal
        title={isEdit ? "Chỉnh sửa trường thông tin" : "Thêm trường thông tin mới"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onHandleOk}
        okText="Lưu cấu hình"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="tenTruong" 
            label="Tên hiển thị" 
            rules={[{ required: true, message: 'VD: Dân tộc, Điểm trung bình...' }]}
          >
            <Input placeholder="Nhập tên trường thông tin" />
          </Form.Item>

          <Form.Item 
            name="maTruong" 
            label="Mã định danh (Viết liền không dấu)" 
            rules={[
                { required: true, message: 'VD: dan_toc, diem_tb' },
                { pattern: /^[a-z0-9_]+$/, message: 'Chỉ dùng chữ thường, số và dấu gạch dưới' }
            ]}
            help="Dùng để lưu trữ dữ liệu trong hệ thống, không nên thay đổi sau khi đã có dữ liệu."
          >
            <Input placeholder="VD: noi_sinh" disabled={isEdit} />
          </Form.Item>

          <Form.Item 
            name="kieuDuLieu" 
            label="Kiểu dữ liệu" 
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="String">Văn bản (String)</Option>
              <Option value="Number">Số (Number)</Option>
              <Option value="Date">Ngày tháng (Date)</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="batBuoc" 
            label="Trạng thái bắt buộc nhập" 
            valuePropName="checked"
          >
            <Switch checkedChildren="Bắt buộc" unCheckedChildren="Tùy chọn" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CauHinhBieuMau;