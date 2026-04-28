import { Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ExerciseLibraryPage = () => {
  const { getExercises, addOrUpdateExercise, deleteExercise } = useModel('quanlytheduc.index' as any) as any;
  const [items, setItems] = useState<any[]>([]);
  const [filterGroup, setFilterGroup] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [editor, setEditor] = useState<any>(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getExercises().then(setItems);
  }, []);

  const load = () => getExercises().then(setItems);

  const openCreate = () => {
    setEditor(null);
    form.resetFields();
    setEditorVisible(true);
  };

  const openEdit = (item: any) => {
    setEditor(item);
    form.setFieldsValue(item);
    setEditorVisible(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    await addOrUpdateExercise({ ...(editor || {}), ...values });
    setEditor(null);
    form.resetFields();
    setEditorVisible(false);
    load();
  };

  const remove = async (id: string) => {
    await deleteExercise(id);
    load();
  };

  const shown = items.filter(
    (i) => (!filterGroup || i.muscleGroup === filterGroup) && (!search || i.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Input.Search
          placeholder='Tìm theo tên bài tập'
          onSearch={(v) => setSearch(v)}
          style={{ width: 300, marginRight: 12 }}
        />
        <Select
          placeholder='Nhóm cơ'
          style={{ width: 200 }}
          onChange={(v) => setFilterGroup(v)}
          allowClear
          options={[
            { label: 'Chest', value: 'Chest' },
            { label: 'Back', value: 'Back' },
            { label: 'Legs', value: 'Legs' },
            { label: 'Shoulders', value: 'Shoulders' },
            { label: 'Arms', value: 'Arms' },
            { label: 'Core', value: 'Core' },
            { label: 'Full Body', value: 'Full Body' },
          ]}
        />
        <Button style={{ marginLeft: 12 }} type='primary' onClick={openCreate}>
          Thêm bài tập
        </Button>
      </div>

      <Row gutter={16}>
        {shown.map((it) => (
          <Col span={8} key={it.id}>
            <Card
              hoverable
              onClick={() => setDetail(it)}
              style={{ marginBottom: 12 }}
              title={it.name}
              extra={
                <Space onClick={(e) => e.stopPropagation()}>
                  <Button size='small' onClick={() => openEdit(it)}>
                    Sửa
                  </Button>
                  <Popconfirm title='Xóa bài tập này?' onConfirm={() => remove(it.id)}>
                    <Button danger size='small'>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              <div>{it.muscleGroup}</div>
              <div style={{ marginTop: 8 }}>
                <Tag color={it.difficulty === 'Easy' ? 'green' : it.difficulty === 'Medium' ? 'gold' : 'red'}>{it.difficulty}</Tag>
              </div>
              <div style={{ marginTop: 8 }}>{it.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        visible={editorVisible}
        title={editor?.id ? 'Sửa bài tập' : 'Thêm bài tập'}
        onCancel={() => {
          setEditor(null);
          setEditorVisible(false);
          form.resetFields();
        }}
        onOk={submit}
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='name' label='Tên bài tập' rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='muscleGroup' label='Nhóm cơ' rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
            <Select
              options={[
                { label: 'Chest', value: 'Chest' },
                { label: 'Back', value: 'Back' },
                { label: 'Legs', value: 'Legs' },
                { label: 'Shoulders', value: 'Shoulders' },
                { label: 'Arms', value: 'Arms' },
                { label: 'Core', value: 'Core' },
                { label: 'Full Body', value: 'Full Body' },
              ]}
            />
          </Form.Item>
          <Form.Item name='difficulty' label='Mức độ khó' rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}>
            <Select
              options={[
                { label: 'Easy', value: 'Easy' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Hard', value: 'Hard' },
              ]}
            />
          </Form.Item>
          <Form.Item name='desc' label='Mô tả ngắn'>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name='caloriesPerHour' label='Calo đốt trung bình/giờ'>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal visible={!!detail} title={detail?.name} onCancel={() => setDetail(null)} footer={null}>
        {detail && (
          <div>
            <div>Nhóm cơ: {detail.muscleGroup}</div>
            <div>Mức độ: {detail.difficulty}</div>
            <div style={{ marginTop: 8 }}>{detail.desc}</div>
            <div style={{ marginTop: 8 }}>Calo/giờ: {detail.caloriesPerHour}</div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ExerciseLibraryPage;
