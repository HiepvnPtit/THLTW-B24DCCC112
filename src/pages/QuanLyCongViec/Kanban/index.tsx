import KanbanBoard from '../components/KanbanBoard';
import { Button } from 'antd';
import { useState } from 'react';
import TaskForm from '../components/TaskForm';

const KanbanPage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Button type='primary' onClick={() => setVisible(true)}>
          Thêm Task
        </Button>
      </div>
      <KanbanBoard />
      <TaskForm visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};

export default KanbanPage;
