import { useState } from 'react';
import {
  Button, Form, Input, Modal, Space, Table, Popconfirm, 
  message, Card, Typography, Divider, Tag, Select, DatePicker
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { QuyetDinh, SoVanBang } from '@/models/danhmucvanbang';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const QuanLyQuyetDinh = () => {
  
  const { 
    danhMucQuyetDinh, addQuyetDinh, updateQuyetDinh, deleteQuyetDinh,
    danhMucSoVanBang 
  } = useModel('danhmucvanbang');

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

 
  const onHandleOk = async () => {
    try {
      const values = await form.validateFields();
     
      const formattedValues = {
        ...values,
        ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD'),
      };

      if (isEdit && editingId !== null) {
        updateQuyetDinh({ ...formattedValues, id: editingId });
        message.success('Cập nhật quyết định thành công');
      } else {
        addQuyetDinh(formattedValues);
        message.success('Thêm quyết định mới thành công');
      }
      
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const columns = [
    {
      title: 'Số Quyết Định',
      dataIndex: 'soQuyetDinh',
      key: 'soQuyetDinh',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      key: 'ngayBanHanh',
      align: 'center' as const,
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      key: 'trichYeu',
      ellipsis: true, 
    },
    {
      title: 'Thuộc Sổ',
      dataIndex: 'soVanBangId',
      key: 'soVanBangId',
      render: (soId: string) => {
        const so = danhMucSoVanBang.find(s => s.id === soId);
        return <Tag color="blue">{so?.tenSo || 'Không xác định'}</Tag>;
      }
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'tongLuotTraCuu',
      key: 'tongLuotTraCuu',
      align: 'center' as const,
      render: (val: number) => (
        <Space><EyeOutlined /> <Text type="secondary">{val || 0}</Text></Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: QuyetDinh) => (
        <Space split={<Divider type="vertical" />}>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setEditingId(record.id);
            
              form.setFieldsValue({
                ...record,
                ngayBanHanh: moment(record.ngayBanHanh)
              }); 
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          
          <Popconfirm 
            title="Xóa quyết định này?" 
            onConfirm={() => {
              deleteQuyetDinh(record.id);
              message.success('Đã xóa quyết định');
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
      title={<Title level={4}>QUẢN LÝ QUYẾT ĐỊNH TỐT NGHIỆP</Title>} 
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
          Thêm quyết định
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={danhMucQuyetDinh} 
        rowKey="id" 
        bordered
      />

      <Modal
        title={isEdit ? "Chỉnh sửa quyết định" : "Thêm quyết định mới"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onHandleOk}
        okText="Hoàn tất"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="soQuyetDinh" 
            label="Số quyết định" 
            rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
          >
            <Input prefix={<FileTextOutlined />} placeholder="VD: 123/QĐ-ĐH" />
          </Form.Item>

          <Form.Item 
            name="ngayBanHanh" 
            label="Ngày ban hành" 
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item 
            name="soVanBangId" 
            label="Thuộc sổ văn bằng" 
            rules={[{ required: true, message: 'Vui lòng chọn sổ' }]}
          >
            <Select placeholder="Chọn sổ văn bằng năm tương ứng">
              {danhMucSoVanBang.map(so => (
                <Option key={so.id} value={so.id}>
                  {so.tenSo} ({so.year})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="trichYeu" 
            label="Trích yếu nội dung" 
            rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
          >
            <TextArea rows={3} placeholder="Nội dung tóm tắt của quyết định..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyQuyetDinh;