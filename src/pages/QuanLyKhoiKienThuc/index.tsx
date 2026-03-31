import React, { useState, useMemo } from 'react';
import {
  Button, Form, Input, Modal, Select, Space,
  Table, Popconfirm, message, Tag
} from 'antd';
import { useModel } from 'umi';
import type { MonHoc } from '@/models/danhmucmonhoc';
import type { DanhKhoiKienThuc } from '@/models/danhmucmonhoc';


const QuanLyKhoiKienThuc = () => {
  const { danhKhoiKienThuc, setDanhKhoiKienThuc, addDanhKhoiKienThuc , deleteDanhKhoiKienThuc ,updateDanhKhoiKienThuc} = useModel('danhmucmonhoc');
  const [isVisible, setIsVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<MonHoc | null>(null);
  const [form] = Form.useForm<MonHoc>();

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Khối Kiến Thức',
      dataIndex: 'khoiKienThuc',
      key: 'khoiKienThuc',
      align: 'center' as const,
    },
    {
      title: 'Hành Động',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: MonHoc) => (
        <Space size="middle">
          <Button type="primary" onClick={() => {
            setIsEdit(true);
            setRow(record);
            form.setFieldsValue(record);
            setVisible(true);
          }}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => deleteDanhKhoiKienThuc(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger> Xóa </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản Lý Khối Kiến Thức</h1>
      <Button type="primary" onClick={() => {
        setIsEdit(false);
        setRow(null);
        form.resetFields();
        setVisible(true);
      }} style={{ marginBottom: 16 }}>
        Thêm Khối Kiến Thức
      </Button>
      <Table columns={columns} dataSource={danhKhoiKienThuc} rowKey="id" />

      <Modal
        title={isEdit ? 'Sửa Khối Kiến Thức' : 'Thêm Khối Kiến Thức'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            if (isEdit && row) {
              updateDanhKhoiKienThuc(row.id, values);
              message.success('Cập nhật khối kiến thức thành công');
            } else {
              addDanhKhoiKienThuc(values.khoiKienThuc);
              message.success('Thêm khối kiến thức thành công');
            }
            setVisible(false);
          }).catch(info => {
            console.log('Validate Failed:', info);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="khoiKienThuc"
            label="Khối Kiến Thức"
            rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức!' }]}
          >
            <Input placeholder="Nhập khối kiến thức" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyKhoiKienThuc;