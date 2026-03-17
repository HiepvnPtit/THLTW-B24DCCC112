import React, { useState, useMemo } from 'react';
import {
  Button, Form, Input, Modal, Select, Space,
  Table, Popconfirm, message, Tag
} from 'antd';
import { useModel } from 'umi';
import type { MonHoc } from '@/models/danhmucmonhoc';


const DanhMucMonHoc = () => {
  const { danhMucMonHoc, setDanhMucMonHoc, addMonHoc , deleteMonHoc ,updateMonHoc} = useModel('danhmucmonhoc');
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
      title: 'Tên Môn Học',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      key: 'soTinChi',
      align: 'center' as const,
      render: (value: number | undefined) => value !== undefined ? value : 'N/A',
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
            onConfirm={() => deleteMonHoc(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger> Xóa </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return danhMucMonHoc.filter((item) =>
      item.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [danhMucMonHoc, searchKeyword]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản Lý Môn Học</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm môn học"
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={() => {
          setIsEdit(false);
          form.resetFields();
          setVisible(true);
        }}>
          Thêm Môn Học
        </Button>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey="id" />

      <Modal
        title={isEdit ? "Sửa Môn Học" : "Thêm Môn Học"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            if (isEdit && row) {
              updateMonHoc(row.id, { name: values.name, soTinChi: values.soTinChi });
              message.success('Cập nhật môn học thành công');
            } else {
              addMonHoc({ name: values.name, soTinChi: values.soTinChi });
              message.success('Thêm môn học thành công');
            }
            setVisible(false);
          }).catch(info => {
            console.log('Validate Failed:', info);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Môn Học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>
          <Form.Item
            name="soTinChi"
            label="Số Tín Chỉ"
            rules={[{ required: false, message: 'Vui lòng nhập số tín chỉ!' }]}
          >
            <Input type="number" placeholder="Nhập số tín chỉ (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


export default DanhMucMonHoc;