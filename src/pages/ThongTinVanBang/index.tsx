import { useState } from 'react';
import {
  Button, Form, Input, Modal, Space, Table, Popconfirm, 
  message, Card, Typography, Divider, Tag, Select, DatePicker, InputNumber
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, IdcardOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { VanBang } from '@/models/danhmucvanbang';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const ThongTinVanBang = () => {
  const { 
    danhMucVanBang, addVanBang, updateVanBang, deleteVanBang,
    danhMucQuyetDinh, danhMucSoVanBang, fieldConfig 
  } = useModel('danhmucvanbang');

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();


  const onHandleOk = async () => {
    try {
      const values = await form.validateFields();
      
     
      const processValues = { ...values };
      if (processValues.ngaySinh) {
        processValues.ngaySinh = processValues.ngaySinh.format('YYYY-MM-DD');
      }


      if (processValues.extraFields) {
        fieldConfig.forEach(field => {
          if (field.kieuDuLieu === 'Date' && processValues.extraFields[field.maTruong]) {
            processValues.extraFields[field.maTruong] = processValues.extraFields[field.maTruong].format('YYYY-MM-DD');
          }
        });
      }

      if (isEdit && editingId !== null) {
        updateVanBang({ ...processValues, id: editingId });
        message.success('Cập nhật thông tin văn bằng thành công');
      } else {
        addVanBang(processValues);
     
        message.success('Thêm văn bằng thành công');
      }
      
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      width: 100,
      fixed: 'left' as const,
      render: (val: number) => <Tag color="volcano">{val}</Tag>
    },
    {
      title: 'Số hiệu VB',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Mã SV',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
    },
    {
      title: 'Quyết định',
      dataIndex: 'quyetDinhId',
      key: 'quyetDinhId',
      render: (id: string) => {
        const qd = danhMucQuyetDinh.find(q => q.id === id);
        return qd ? qd.soQuyetDinh : 'N/A';
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: VanBang) => (
        <Space split={<Divider type="vertical" />}>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setEditingId(record.id);
              
           
              const initialValues: Record<string, any> = { ...record };
              initialValues.ngaySinh = moment(record.ngaySinh);
              
           
              if (initialValues.extraFields) {
                fieldConfig.forEach(field => {
                  if (field.kieuDuLieu === 'Date' && initialValues.extraFields[field.maTruong]) {
                    initialValues.extraFields[field.maTruong] = moment(initialValues.extraFields[field.maTruong]);
                  }
                });
              }
              
              form.setFieldsValue(initialValues);
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm title="Xóa văn bằng này?" onConfirm={() => deleteVanBang(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const renderDynamicField = (field: any) => {
    const commonProps = { placeholder: `Nhập ${field.tenTruong.toLowerCase()}` };
    
    switch (field.kieuDuLieu) {
      case 'Number':
        return <InputNumber style={{ width: '100%' }} {...commonProps} />;
      case 'Date':
        return <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <Card 
      title={<Title level={4}><IdcardOutlined /> QUẢN LÝ THÔNG TIN VĂN BẰNG</Title>} 
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
          Thêm văn bằng mới
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={danhMucVanBang} 
        rowKey="id" 
        bordered 
        scroll={{ x: 1000 }}
      />

      <Modal
        title={isEdit ? 'Chỉnh sửa văn bằng' : 'Cấp mới văn bằng'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onHandleOk}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        
            <div>
              <Divider orientation="left">Thông tin định danh</Divider>
              <Form.Item name="quyetDinhId" label="Quyết định tốt nghiệp" rules={[{ required: true }]}>
                <Select placeholder="Chọn quyết định" disabled={isEdit}>
                  {danhMucQuyetDinh.map(qd => {
                    const so = danhMucSoVanBang.find(s => s.id === qd.soVanBangId);
                    return (
                      <Option key={qd.id} value={qd.id}>
                        {qd.soQuyetDinh} (Sổ: {so?.tenSo})
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item name="maSinhVien" label="Mã sinh viên" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder="Nhập MSV" />
              </Form.Item>

              <Form.Item name="hoTen" label="Họ và Tên" rules={[{ required: true }]}>
                <Input placeholder="Nhập họ tên đầy đủ" />
              </Form.Item>

              <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng" rules={[{ required: true }]}>
                <Input placeholder="Số hiệu in trên phôi bằng" />
              </Form.Item>
              
              {!isEdit && (
                <Text type="secondary">* Số vào sổ sẽ được hệ thống cấp tự động.</Text>
              )}
            </div>

       
            <div>
              <Divider orientation="left">Thông tin bổ sung (Phụ lục)</Divider>
              {fieldConfig.length === 0 ? (
                <Text type="secondary">Chưa có cấu hình biểu mẫu phụ lục.</Text>
              ) : (
                fieldConfig.map(field => (
                  <Form.Item 
                    key={field.id}
                    name={['extraFields', field.maTruong]} 
                    label={field.tenTruong}
                    rules={[{ required: field.batBuoc, message: `Vui lòng nhập ${field.tenTruong}` }]}
                  >
                    {renderDynamicField(field)}
                  </Form.Item>
                ))
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default ThongTinVanBang;