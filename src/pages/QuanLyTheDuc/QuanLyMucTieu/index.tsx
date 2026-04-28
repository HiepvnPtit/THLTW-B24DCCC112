import { Button, Card, Col, DatePicker, Drawer, Form, Input, InputNumber, Progress, Row, Segmented, Space } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useModel } from 'umi';

const GoalCard = ({ goal, onEdit, onDelete }: any) => {
  const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  return (
    <Card style={{ marginBottom: 12 }}>
      <Row justify='space-between'>
        <Col>
          <h3>{goal.name}</h3>
          <div>{goal.type} — {goal.deadline || 'Không có hạn'}</div>
        </Col>
        <Col style={{ textAlign: 'right' }}>
          <Progress percent={percent} style={{ width: 160 }} />
          <div style={{ marginTop: 8 }}>{percent}%</div>
        </Col>
      </Row>
      <Space style={{ marginTop: 12 }}>
        <Button onClick={() => onEdit(goal)}>Sửa</Button>
        <Button danger onClick={() => onDelete(goal.id)}>Xóa</Button>
      </Space>
    </Card>
  );
};

const GoalsPage = () => {
  const { getGoals, addOrUpdateGoal, deleteGoal } = useModel('quanlytheduc.index' as any) as any;
  const [goals, setGoals] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = () => getGoals().then(setGoals);

  useEffect(() => { load(); }, []);

  const openEdit = (g?: any) => {
    setEditing(g || null);
    form.resetFields();
    if (g) {
      form.setFieldsValue({
        ...g,
        deadline: g.deadline ? moment(g.deadline) : undefined,
      });
    }
    setVisible(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    await addOrUpdateGoal({
      ...(editing || {}),
      ...values,
      deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : undefined,
    });
    setVisible(false);
    load();
  };

  const remove = async (id: string) => { await deleteGoal(id); load(); };

  const shown = filter === 'all' ? goals : goals.filter((g) => (filter === 'active' ? g.status === 'active' : filter === 'achieved' ? g.status === 'achieved' : g.status === 'cancelled'));

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Segmented options={[{label:'Tất cả', value:'all'}, {label:'Đang', value:'active'}, {label:'Đạt', value:'achieved'}, {label:'Hủy', value:'cancelled'}]} onChange={(v:any)=>setFilter(v)} />
        <Button type='primary' onClick={()=>openEdit()}>Thêm mục tiêu</Button>
      </Space>

      <Row gutter={16}>
        {shown.map((g) => (
          <Col span={8} key={g.id}>
            <GoalCard goal={g} onEdit={openEdit} onDelete={remove} />
          </Col>
        ))}
      </Row>

      <Drawer visible={visible} onClose={()=>setVisible(false)} title={editing ? 'Sửa mục tiêu' : 'Thêm mục tiêu'} width={420} destroyOnClose>
        <Form form={form} layout='vertical'>
          <Form.Item name='name' label='Tên mục tiêu' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='type' label='Loại' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='targetValue' label='Giá trị mục tiêu' rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='currentValue' label='Giá trị hiện tại'>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='deadline' label='Deadline'>
            <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <Button onClick={()=>setVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type='primary' onClick={submit}>Lưu</Button>
        </div>
      </Drawer>
    </>
  );
};

export default GoalsPage;
