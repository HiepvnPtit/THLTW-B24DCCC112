import React, { useState, useMemo } from 'react';
import {
  Button, Form, Input, Modal, Select, Space,
  Table, Popconfirm, message, Tag
} from 'antd';
import { useModel } from 'umi';
import type { MonHoc } from '@/models/danhmucmonhoc';
import type { DanhMucCauHoi } from '@/models/danhmucmonhoc';
import type { DanhKhoiKienThuc } from '@/models/danhmucmonhoc';

const QuanLyCauHoi = () => {
  const { danhMucCauHoi, setDanhMucCauHoi, addDanhMucCauHoi, deleteDanhMucCauHoi, updateDanhMucCauHoi, danhKhoiKienThuc, danhMucMonHoc } = useModel('danhmucmonhoc');
  const [isVisible, setIsVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<DanhMucCauHoi | null>(null);
  const [form] = Form.useForm<DanhMucCauHoi>();

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
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
      title: 'Câu Hỏi',
      dataIndex: 'cauHoi',
      key: 'cauHoi',
      align: 'center' as const,
    },
    {
      title: 'Độ Khó',
      dataIndex: 'doKho',
      key: 'doKho',
      align: 'center' as const,
      render: (doKho: string) => {
        if (doKho === 'Dễ') return <Tag color="success">Dễ</Tag>;
        if (doKho === 'Trung bình') return <Tag color="warning">Trung Bình</Tag>;
        return <Tag color="error">Khó</Tag>;
      },
    },
    {
      title: 'Khối Kiến Thức',
      dataIndex: 'khoiKienThucId',
      key: 'khoiKienThucId',
      align: 'center' as const,
      render: (khoiKienThucId: number) => {
        const khoiKienThuc = danhKhoiKienThuc.find(kkt => kkt.id === khoiKienThucId);
        return khoiKienThuc ? khoiKienThuc.khoiKienThuc : 'N/A';
      },
    },
    {
      title: 'Hành Động',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: DanhMucCauHoi) => (
        <Space size="middle">
          <Button type="primary" onClick={() => {
            setIsEdit(true);
            setRow(record);
            form.setFieldsValue(record);
            setVisible(true);
          }}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => deleteDanhMucCauHoi(record.id)}
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
    return danhMucCauHoi.filter((item) =>
      item.cauHoi.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.doKho.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (danhMucMonHoc.find(mh => mh.id === item.monHocId)?.name.toLowerCase().includes(searchKeyword.toLowerCase()) || '') ||
      (danhKhoiKienThuc.find(kkt => kkt.id === item.khoiKienThucId)?.khoiKienThuc.toLowerCase().includes(searchKeyword.toLowerCase()) || '')
    );
  }, [danhMucCauHoi, searchKeyword]);




  return (
    <div>
      <h1>Quản Lý Câu Hỏi</h1>
      <Button type="primary" onClick={() => {
        setIsEdit(false);
        setRow(null);
        form.resetFields();
        setVisible(true);
      }} style={{ marginBottom: 16 }}>
        Thêm Câu Hỏi
      </Button>
      <Input.Search
        placeholder="Tìm kiếm câu hỏi"
        allowClear
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={filteredData} rowKey="id" />

      <Modal
        title={isEdit ? "Sửa Câu Hỏi" : "Thêm Câu Hỏi"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            if (isEdit && row) {
              updateDanhMucCauHoi(row.id, values);
              message.success('Cập nhật câu hỏi thành công');
            } else {
              addDanhMucCauHoi(values.monHocId, values.cauHoi, values.doKho, values.khoiKienThucId);
              message.success('Thêm câu hỏi thành công');
            }
            setVisible(false);
          }).catch(info => {
            console.log('Validate Failed:', info);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="monHocId" label="Môn Học" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
            <Select placeholder="Chọn môn học">
              {danhMucMonHoc.map(mh => (
                <Select.Option key={mh.id} value={mh.id}>{mh.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="cauHoi" label="Câu Hỏi" rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}>
            <Input placeholder="Nhập câu hỏi" />
          </Form.Item>
          <Form.Item name="khoiKienThucId" label="Khối Kiến Thức" rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}>
            <Select placeholder="Chọn khối kiến thức">
              {danhKhoiKienThuc.map(kkt => (
                <Select.Option key={kkt.id} value={kkt.id}>{kkt.khoiKienThuc}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="doKho" label="Độ Khó" rules={[{ required: true, message: 'Vui lòng chọn độ khó!' }]}>
            <Select placeholder="Chọn độ khó">
              <Select.Option value="Dễ">Dễ</Select.Option>
              <Select.Option value="Trung bình">Trung Bình</Select.Option>
              <Select.Option value="Khó">Khó</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyCauHoi;