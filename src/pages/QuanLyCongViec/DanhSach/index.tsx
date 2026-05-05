import { Button, Input, Space, Table, Tag, Select } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import TaskForm from '../components/TaskForm';

const { Search } = Input;

const SelectStatus: React.FC<{ onChange: (val: string | null) => void }> = ({ onChange }) => (
  <Select style={{ width: 160 }} allowClear onChange={(v) => onChange(v || null)}>
    <Select.Option value='todo'>Cần làm</Select.Option>
    <Select.Option value='doing'>Đang làm</Select.Option>
    <Select.Option value='done'>Hoàn thành</Select.Option>
  </Select>
);

const TaskListPage: React.FC = () => {
  const { tasks, deleteTask, updateTask } = useModel('congviec' as any) as any;
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const data = useMemo(() => {
    let d = (tasks || []).slice();
    if (q) d = d.filter((t: any) => t.title?.toLowerCase().includes(q.toLowerCase()));
    if (statusFilter) d = d.filter((t: any) => t.status === statusFilter);
    return d;
  }, [tasks, q, statusFilter]);

  const columns = [
    { title: 'Tên', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Deadline', dataIndex: 'deadline', key: 'deadline', sorter: (a: any, b: any) => (a.deadline || '').localeCompare(b.deadline || ''),
      render: (val: any) => (val ? new Date(val).toLocaleString() : '--'),
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags', render: (val: any[]) => (val || []).map((t) => <Tag key={t}>{t}</Tag>) },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động', key: 'action', render: (rec: any) => (
        <Space>
          <Button onClick={() => {
            setEditingId(rec.id);
            setFormVisible(true);
          }}>
            Sửa
          </Button>
          <Button onClick={() => updateTask(rec.id, { status: rec.status === 'done' ? 'todo' : 'done' })}>{rec.status === 'done' ? 'Đặt lại' : 'Hoàn thành'}</Button>
          <Button danger onClick={() => deleteTask(rec.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Search placeholder='Tìm theo tên' value={q} onChange={(e) => setQ(e.target.value)} allowClear style={{ width: 240 }} />
          <SelectStatus onChange={(s: any) => setStatusFilter(s)} />
        </Space>
        <Button
          type='primary'
          onClick={() => {
            setEditingId(null);
            setFormVisible(true);
          }}
        >
          Thêm task
        </Button>
      </Space>

      <Table rowKey='id' dataSource={data} columns={columns} />
      <TaskForm
        visible={formVisible}
        editingId={editingId}
        onClose={() => {
          setFormVisible(false);
          setEditingId(null);
        }}
      />
    </>
  );
};

export default TaskListPage;
