import { DatePicker, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import moment from 'moment';
import { useModel } from 'umi';

const { TextArea } = Input;

type Props = {
  visible: boolean;
  onClose: () => void;
  editingId?: string | null;
};

const TaskForm: React.FC<Props> = ({ visible, onClose, editingId }) => {
  const [form] = Form.useForm();
  const { addTask, updateTask, getById } = useModel('congviec' as any) as any;

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      return;
    }
    if (editingId) {
      const rec = getById(editingId);
      if (rec) {
        form.setFieldsValue({
          ...rec,
          deadline: rec.deadline ? moment(rec.deadline) : undefined,
          tags: (rec.tags || []).join(', '),
        });
      }
    } else {
      form.resetFields();
    }
  }, [visible, editingId]);

  const onFinish = async () => {
    const vals = await form.validateFields();
    const payload = {
      title: vals.title,
      description: vals.description,
      deadline: vals.deadline ? vals.deadline.toISOString() : null,
      priority: vals.priority,
      tags: vals.tags ? vals.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      status: vals.status || 'todo',
    };
    if (editingId) {
      updateTask(editingId, payload);
    } else {
      addTask(payload);
    }
    onClose();
  };

  return (
    <Modal visible={visible} onCancel={onClose} onOk={onFinish} okText='Lưu' cancelText='Hủy' title={editingId ? 'Sửa task' : 'Thêm task'}>
      <Form form={form} layout='vertical'>
        <Form.Item name='title' label='Tên task' rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='description' label='Mô tả'>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name='deadline' label='Deadline'>
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name='priority' label='Mức độ ưu tiên' initialValue='Medium'>
          <Select>
            <Select.Option value='High'>Cao</Select.Option>
            <Select.Option value='Medium'>Trung bình</Select.Option>
            <Select.Option value='Low'>Thấp</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='tags' label='Tags (ngăn cách bởi ,)'>
          <Input />
        </Form.Item>
        <Form.Item name='status' label='Trạng thái' initialValue='todo'>
          <Select>
            <Select.Option value='todo'>Cần làm</Select.Option>
            <Select.Option value='doing'>Đang làm</Select.Option>
            <Select.Option value='done'>Hoàn thành</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
