import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useModel } from 'umi';

const { RangePicker } = DatePicker;

const WorkoutLogPage = () => {
  const { getWorkouts, addOrUpdateWorkout, deleteWorkout } = useModel('quanlytheduc.index' as any) as any;
  const [data, setData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = () => getWorkouts().then(setData);

  useEffect(() => {
    load();
  }, []);

  const openEdit = (record?: any) => {
    setEditing(record || null);
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        ...record,
        date: record.date ? moment(record.date) : undefined,
      });
    }
    setVisible(true);
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      await addOrUpdateWorkout({
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
    await deleteWorkout(id);
    load();
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date' },
    { title: 'Loại bài tập', dataIndex: 'type' },
    { title: 'Thời lượng (phút)', dataIndex: 'duration' },
    { title: 'Calo', dataIndex: 'calories' },
    { title: 'Ghi chú', dataIndex: 'note' },
    { title: 'Trạng thái', dataIndex: 'status' },
    {
      title: 'Hành động', render: (_: any, rec: any) => (
        <Space>
          <Button onClick={() => openEdit(rec)}>Sửa</Button>
          <Popconfirm title='Xóa buổi tập?' onConfirm={() => remove(rec.id)}>
            <Button danger> Xóa </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Input.Search placeholder='Tìm theo tên bài tập' onSearch={(v) => console.log('search', v)} />
        <Select placeholder='Loại bài tập' style={{ width: 180 }} options={[{label:'Cardio', value:'Cardio'},{label:'Strength', value:'Strength'},{label:'Yoga', value:'Yoga'},{label:'HIIT', value:'HIIT'},{label:'Other', value:'Other'}]} />
        <RangePicker />
        <Button type='primary' onClick={() => openEdit()}>Thêm buổi tập</Button>
      </Space>

      <Table rowKey='id' dataSource={data} columns={columns} />

      <Modal visible={visible} title={editing ? 'Sửa buổi tập' : 'Thêm buổi tập'} onCancel={() => setVisible(false)} onOk={submit}>
        <Form form={form} layout='vertical'>
          <Form.Item name='date' label='Ngày tập' rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
          </Form.Item>
          <Form.Item name='type' label='Loại bài tập' rules={[{ required: true }]}>
            <Select options={[{label:'Cardio', value:'Cardio'},{label:'Strength', value:'Strength'},{label:'Yoga', value:'Yoga'},{label:'HIIT', value:'HIIT'},{label:'Other', value:'Other'}]} />
          </Form.Item>
          <Form.Item name='duration' label='Thời lượng (phút)' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='calories' label='Calo'>
            <Input />
          </Form.Item>
          <Form.Item name='note' label='Ghi chú'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name='status' label='Trạng thái' initialValue='completed'>
            <Select options={[{label:'Hoàn thành', value:'completed'},{label:'Bỏ lỡ', value:'missed'},{label:'Planned', value:'planned'}]} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WorkoutLogPage;
