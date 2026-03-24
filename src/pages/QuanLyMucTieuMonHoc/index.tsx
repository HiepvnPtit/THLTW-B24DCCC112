import React, { useState, useMemo } from 'react';
import {
  Button, Form, Input, Modal, Select, Space,
  Table, Popconfirm, message, Tag
} from 'antd';
import { useModel } from 'umi';
import type { MonHoc } from '@/models/danhmucmonhoc';

const MucTieuMonHoc = () => {
  const { mucTieuMonHoc, setMucTieuMonHoc, addMucTieuMonHoc , deleteMucTieuMonHoc ,updateMucTieuMonHoc , danhMucMonHoc} = useModel('danhmucmonhoc');
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
      title: 'Mục Tiêu',
      dataIndex: 'mucTieu',
      key: 'mucTieu',
      align: 'center' as const,
    },
    {
      title: 'Môn Học',
      dataIndex: 'monHocId',
      key: 'monHocId',
      align: 'center' as const,
      render: (monHocId: number) => {
        const monHoc = danhMucMonHoc.find(mh => mh.id === monHocId);
        return monHoc ? monHoc.name : 'N/A';
      },
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      align: 'center' as const,
      render: (trangThai: string) => {
        if (trangThai === 'hoanThanh') return <Tag color="success">Hoàn Thành</Tag>;
        if (trangThai === 'dangThucHien') return <Tag color="warning">Đang Thực Hiện</Tag>;
        return <Tag color="error">Chưa Bắt Đầu</Tag>;
      },
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
            onConfirm={() => deleteMucTieuMonHoc(record.id)}
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
    return mucTieuMonHoc.filter((item) =>
      item.mucTieu.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [mucTieuMonHoc, searchKeyword]);

  return (
    <div>
      <h1>Quản Lý Mục Tiêu Môn Học</h1>
      <Input.Search
        placeholder="Tìm kiếm mục tiêu..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button
        type="primary"
        onClick={() => {
          setIsEdit(false);
          setRow(null);
          form.resetFields();
          setVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm Mục Tiêu
      </Button>
      <Table columns={columns} dataSource={filteredData} rowKey="id" />
      <Modal
        title={isEdit ? "Sửa Mục Tiêu" : "Thêm Mục Tiêu"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            if (isEdit && row) {
              updateMucTieuMonHoc(row.id, values);
              message.success('Cập nhật mục tiêu thành công');
            } else {
              addMucTieuMonHoc(values.monHocId, values.mucTieu, values.trangThai);
              message.success('Thêm mục tiêu thành công');
            }
            setVisible(false);
          }).catch(info => {
            console.log('Validate Failed:', info);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="mucTieu"
            label="Tên Mục Tiêu"
            rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="monHocId"
            label="Môn Học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select placeholder="Chọn môn học">
              {danhMucMonHoc.map((mh) => (
                <Select.Option key={mh.id} value={mh.id}>
                  {mh.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="hoanThanh">Hoàn Thành</Select.Option>
              <Select.Option value="dangThucHien">Đang Thực Hiện</Select.Option>
              <Select.Option value="chuaBatDau">Chưa Bắt Đầu</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


export default MucTieuMonHoc;
