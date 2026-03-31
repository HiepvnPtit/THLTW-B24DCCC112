import { useState } from 'react';
import {
  Button, Form, Input, Modal, Select, Space, Table, Popconfirm, 
  message, InputNumber, Card, Typography, Tag, Divider
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Text, Title } = Typography;

const TaoDeThi = () => {
  const { 
    taoDeThi, addTaoDeThi, deleteTaoDeThi, updateTaoDeThi, 
    danhMucCauHoi, danhKhoiKienThuc, danhMucMonHoc 
  } = useModel('danhmucmonhoc');

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [row, setRow] = useState<any>(null);
  const [form] = Form.useForm();

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const normalizedTaoDeThi = taoDeThi.map((item: any) => {
    if (item && typeof item.tenDe === 'object' && item.tenDe !== null) {
      const legacyPayload = item.tenDe;
      return {
        ...item,
        tenDe: legacyPayload.tenDe ?? 'Đề thi không tên',
        monHocId: item.monHocId ?? legacyPayload.monHocId,
        soCau: item.soCau ?? legacyPayload.soCau ?? (legacyPayload.danhsachCauHoiId?.length ?? 0),
        cauTrucDe: item.cauTrucDe ?? legacyPayload.cauTrucDe ?? [],
        danhsachCauHoiId: item.danhsachCauHoiId ?? legacyPayload.danhsachCauHoiId ?? [],
      };
    }
    return item;
  });

  const generateExam = (values: any) => {
    const { monHocId, cauTrucDe } = values;
    let selectedIds: number[] = [];
    let errorMessages: string[] = [];

    cauTrucDe.forEach((item: any, index: number) => {
      const pool = danhMucCauHoi.filter(ch => 
        ch.monHocId === monHocId && 
        ch.khoiKienThucId === item.khoiKienThucId && 
        ch.doKho.toLowerCase().replace(/\s/g, '') === item.doKho.toLowerCase().replace(/\s/g, '')
      );

      if (pool.length < item.soLuong) {
        const tenKKT = danhKhoiKienThuc.find(k => k.id === item.khoiKienThucId)?.khoiKienThuc || 'KKT trống';
        errorMessages.push(`Dòng ${index + 1}: Thiếu câu hỏi mức [${item.doKho}] - [${tenKKT}]. Hiện có: ${pool.length}, Cần: ${item.soLuong}`);
      } else {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const picked = shuffled.slice(0, item.soLuong).map(q => q.id);
        selectedIds = [...selectedIds, ...picked];
      }
    });
    return { selectedIds, errorMessages };
  };

  const onHandleOk = async () => {
    try {
      const values = await form.validateFields();

   
      if (isEdit && row) {
        updateTaoDeThi(row.id, values);
        message.success('Cập nhật đề thi thành công');
        setVisible(false);
        return;
      }

      const { selectedIds, errorMessages } = generateExam(values);

      if (errorMessages.length > 0) {
        Modal.error({
          title: 'Ngân hàng câu hỏi không đủ!',
          content: errorMessages.map((err, i) => <div key={i} style={{ color: 'red' }}>• {err}</div>),
        });
        return;
      }

      const payload = {
        ...values,
        danhsachCauHoiId: selectedIds,
        soCau: selectedIds.length,
      };

      addTaoDeThi(
        payload.tenDe,
        payload.monHocId,
        payload.soCau,
        payload.cauTrucDe?.[0]?.khoiKienThucId ?? 0,
        payload.danhsachCauHoiId,
      );
      message.success('Tạo đề thi tự động thành công!');
      setVisible(false);
    } catch (e) { console.log(e); }
  };

  const detailColumns = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 60 },
    { title: 'Nội dung câu hỏi', dataIndex: 'cauHoi', key: 'cauHoi' },
    { 
      title: 'Khối kiến thức', 
      dataIndex: 'khoiKienThucId', 
      render: (id: number) => danhKhoiKienThuc.find(k => k.id === id)?.khoiKienThuc 
    },
    { 
      title: 'Độ khó', 
      dataIndex: 'doKho', 
      render: (val: string) => {
        const color = val.toLowerCase().includes('khó') ? 'volcano' : val.toLowerCase().includes('dễ') ? 'green' : 'gold';
        return <Tag color={color}>{val.toUpperCase()}</Tag>;
      }
    },
  ];

  const columns = [
    { title: 'Tên Đề Thi', dataIndex: 'tenDe', key: 'tenDe' },
    { 
      title: 'Môn Học', 
      dataIndex: 'monHocId', 
      render: (val: number) => danhMucMonHoc.find(mh => mh.id === val)?.name || 'N/A'
    },
    { title: 'Số câu', dataIndex: 'soCau', align: 'center' as const, render: (val: number) => <Tag color="blue">{val} câu</Tag> },
    {
      title: 'Hành Động',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space split={<Divider type="vertical" />}>
          <Button type="link" size="small" onClick={() => {
            setIsEdit(true); setRow(record);
            form.setFieldsValue(record); setVisible(true);
          }}>Sửa</Button>
          
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setSelectedExam(record);
            setDetailVisible(true);
          }}>Chi tiết</Button>

          <Popconfirm title="Xóa đề này?" onConfirm={() => deleteTaoDeThi(record.id)}>
            <Button type="link" size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <Card title={<Title level={4}>QUẢN LÝ ĐỀ THI TỰ ĐỘNG</Title>} extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => {
        setIsEdit(false); form.resetFields(); setVisible(true);
      }}>Tạo đề thi</Button>
    }>
      <Table columns={columns} dataSource={normalizedTaoDeThi} rowKey="id" />


      <Modal
        title={isEdit ? "Sửa Cấu Trúc Đề" : "Cấu Hình Tạo Đề Tự Động"}
        visible={visible} 
        onCancel={() => setVisible(false)}
        onOk={onHandleOk}
        width={750}
        okText={isEdit ? "Lưu thay đổi" : "Tạo đề ngay"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenDe" label="Tên Đề Thi" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Đề thi cuối kỳ 1" />
          </Form.Item>
          <Form.Item name="monHocId" label="Môn Học" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn học">
              {danhMucMonHoc.map(mh => <Select.Option key={mh.id} value={mh.id}>{mh.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Text strong>Cấu trúc yêu cầu:</Text>
          <div style={{ marginTop: '10px', padding: '15px', background: '#fafafa', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
            <Form.List name="cauTrucDe" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'khoiKienThucId']} rules={[{ required: true, message: 'Chọn KKT' }]}>
                        <Select placeholder="Khối kiến thức" style={{ width: 180 }}>
                          {danhKhoiKienThuc.map(kkt => <Select.Option key={kkt.id} value={kkt.id}>{kkt.khoiKienThuc}</Select.Option>)}
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'doKho']} rules={[{ required: true, message: 'Chọn độ khó' }]}>
                        <Select placeholder="Độ khó" style={{ width: 130 }}>
                          <Select.Option value="Dễ">Dễ</Select.Option>
                          <Select.Option value="Trung bình">Trung bình</Select.Option>
                          <Select.Option value="Khó">Khó</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'soLuong']} rules={[{ required: true, message: 'Số lượng' }]}>
                        <InputNumber min={1} placeholder="Câu" />
                      </Form.Item>
                      {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm tiêu chí</Button>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>

   
      <Modal
        title={<Title level={5}>CHI TIẾT ĐỀ THI: {selectedExam?.tenDe}</Title>}
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailVisible(false)}>Đóng</Button>]}
        width={900}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Môn học: </Text>
          <Text>{danhMucMonHoc.find(m => m.id === selectedExam?.monHocId)?.name}</Text>
          <Divider type="vertical" />
          <Text strong>Tổng số câu: </Text>
          <Tag color="blue">{selectedExam?.soCau} câu</Tag>
        </div>
        
   
        <Table 
          columns={detailColumns} 
          dataSource={(selectedExam?.danhsachCauHoiId ?? []).map((id: number) => 
            danhMucCauHoi.find(ch => ch.id === id)
          ).filter(Boolean)} 
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
          bordered
        />
      </Modal>
    </Card>
  );
};

export default TaoDeThi;