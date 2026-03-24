import React, { useState, useMemo } from 'react';
import { Button, Form, Input, Modal, Select, Space, Table, Popconfirm, message, DatePicker } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const { RangePicker } = DatePicker;

const QuanLyTienDoMonHoc = () => {
  const { tienDoMonHoc, addTienDoMonHoc, deleteTienDoMonHoc, updateTienDoMonHoc, danhMucMonHoc } = useModel('danhmucmonhoc');
  
  // Khai báo state trước khi dùng trong useMemo
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [row, setRow] = useState<any>(null);
  const [form] = Form.useForm();

  // 1. Logic lọc dữ liệu (Thêm kiểm tra an toàn)
  const filteredData = useMemo(() => {
    return (tienDoMonHoc || []).filter((item) =>
      item.content?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [tienDoMonHoc, searchKeyword]);

  // 2. Logic khi bấm nút SỬA
  const handleEdit = (record: any) => {
    setIsEdit(true);
    setRow(record);

    // Chuyển mảng String từ máy thành đối tượng Moment cho lịch
    const formattedRecord = {
      ...record,
      timeLine: (record.timeLine && record.timeLine.length === 2) 
        ? [moment(record.timeLine[0]), moment(record.timeLine[1])] 
        : []
    };

    form.setFieldsValue(formattedRecord);
    setVisible(true);
  };

  // 3. Logic xử lý lưu dữ liệu (Gộp chung vào 1 hàm duy nhất)
  const handleSave = () => {
    form.validateFields().then(values => {
      // Chuyển từ đối tượng lịch (Moment) sang mảng chữ (String) để lưu
      const dataToSave = {
        ...values,
        timeLine: values.timeLine 
          ? [values.timeLine[0].format('YYYY-MM-DD'), values.timeLine[1].format('YYYY-MM-DD')] 
          : []
      };

      if (isEdit && row) {
        updateTienDoMonHoc(row.id, dataToSave);
        message.success('Cập nhật tiến độ thành công');
      } else {
        addTienDoMonHoc(dataToSave);
        message.success('Thêm tiến độ thành công');
      }
      
      setVisible(false);
      form.resetFields();
    }).catch(err => console.log('Validate Failed:', err));
  };

  const columns = [
    {
      title: 'STT',
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Môn Học',
      dataIndex: 'monHocId',
      render: (id: number) => danhMucMonHoc.find(mh => mh.id === id)?.name || 'N/A',
    },
    {
      title: 'TimeLine',
      dataIndex: 'timeLine',
      render: (text: string[]) => (text && text.length === 2) ? `${text[0]} ~ ${text[1]}` : 'N/A'
    },
    {
      title: 'Hành Động',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => deleteTienDoMonHoc(record.id)}>
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản Lý Tiến Độ Môn Học</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm nội dung..."
          onSearch={(value) => setSearchKeyword(value)}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          onClick={() => {
            setIsEdit(false);
            setRow(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          Thêm Tiến Độ
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredData} rowKey="id" bordered />

      <Modal
        title={isEdit ? "Sửa Tiến Độ Môn Học" : "Thêm Tiến Độ Môn Học"}
        visible={visible} // Hoặc open={visible} nếu dùng Antd v5
        onCancel={() => setVisible(false)}
        onOk={handleSave} // Gọi hàm duy nhất đã định nghĩa ở trên
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="monHocId" label="Môn Học" rules={[{ required: true, message: 'Chọn môn học!' }]}>
            <Select placeholder="Chọn môn học">
              {danhMucMonHoc.map((mh) => (
                <Select.Option key={mh.id} value={mh.id}>{mh.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung!' }]}>
            <Input.TextArea rows={3} placeholder="Nhập nội dung bài học..." />
          </Form.Item>

          <Form.Item
            name="timeLine" 
            label="Thời gian thực hiện"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input placeholder="Nhập ghi chú nếu có" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyTienDoMonHoc;