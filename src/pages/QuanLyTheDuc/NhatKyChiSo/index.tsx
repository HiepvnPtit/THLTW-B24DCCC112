import { Button, DatePicker, Form, InputNumber, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useModel } from 'umi';

const classifyBMI = (bmi: number) => {
  if (bmi < 18.5) return { text: 'Thiếu cân', color: 'blue' };
  if (bmi < 25) return { text: 'Bình thường', color: 'green' };
  if (bmi < 30) return { text: 'Thừa cân', color: 'gold' };
  return { text: 'Béo phì', color: 'red' };
};

const HealthMetricsPage = () => {
  const { getHealthMetrics, addOrUpdateMetric, deleteMetric } = useModel('quanlytheduc.index' as any) as any;
  const [data, setData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = () => getHealthMetrics().then(setData);

  useEffect(() => {
    load();
  }, []);

  const openEdit = (rec?: any) => {
    setEditing(rec || null);
    form.resetFields();
    if (rec) {
      form.setFieldsValue({
        ...rec,
        date: rec.date ? moment(rec.date) : undefined,
      });
    }
    setVisible(true);
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      await addOrUpdateMetric({
        ...(editing || {}),
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
      });
      setVisible(false);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id: string) => {
    await deleteMetric(id);
    load();
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date' },
    { title: 'Cân nặng (kg)', dataIndex: 'weight' },
    { title: 'Chiều cao (cm)', dataIndex: 'height' },
    {
      title: 'BMI', key: 'bmi', render: (_: any, rec: any) => {
        const bmi = rec.weight / Math.pow(rec.height / 100, 2);
        const cls = classifyBMI(bmi);
        return <Tag color={cls.color}>{bmi.toFixed(1)} — {cls.text}</Tag>;
      }
    },
    { title: 'Nhịp tim (bpm)', dataIndex: 'restingHeartRate' },
    { title: 'Giờ ngủ', dataIndex: 'sleepHours' },
    { title: 'Hành động', render: (_: any, rec: any) => (
      <Space>
        <Button onClick={() => openEdit(rec)}>Sửa</Button>
        <Popconfirm title='Xóa chỉ số?' onConfirm={() => remove(rec.id)}>
          <Button danger> Xóa </Button>
        </Popconfirm>
      </Space>
    ) }
  ];

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Button type='primary' onClick={() => openEdit()}>Thêm chỉ số</Button>
      </Space>

      <Table rowKey='id' dataSource={data} columns={columns} />

      <Modal visible={visible} title={editing ? 'Sửa chỉ số' : 'Thêm chỉ số'} onCancel={() => setVisible(false)} onOk={submit}>
        <Form form={form} layout='vertical'>
          <Form.Item name='date' label='Ngày' rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
          </Form.Item>
          <Form.Item name='weight' label='Cân nặng (kg)' rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='height' label='Chiều cao (cm)' rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='restingHeartRate' label='Nhịp tim lúc nghỉ (bpm)'>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='sleepHours' label='Giờ ngủ'>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default HealthMetricsPage;
