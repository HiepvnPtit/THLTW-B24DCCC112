import { Card, Col, Row, Space, Switch, Tag } from 'antd';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useModel } from 'umi';

const KanbanBoard: React.FC = () => {
  const { tasks, moveTask } = useModel('congviec' as any) as any;
  const [sortByDeadline, setSortByDeadline] = useState(false);

  const columns = [
    { key: 'todo', title: 'Cần làm' },
    { key: 'doing', title: 'Đang làm' },
    { key: 'done', title: 'Hoàn thành' },
  ];

  const getSortedTasks = (status: 'todo' | 'doing' | 'done') => {
    const columnTasks = (tasks || []).filter((task: any) => task.status === status);

    if (!sortByDeadline) {
      return columnTasks;
    }

    return columnTasks.slice().sort((left: any, right: any) => {
      const leftDeadline = left.deadline ? new Date(left.deadline).getTime() : Number.NEGATIVE_INFINITY;
      const rightDeadline = right.deadline ? new Date(right.deadline).getTime() : Number.NEGATIVE_INFINITY;
      return rightDeadline - leftDeadline;
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const destStatus = destination.droppableId as 'todo' | 'doing' | 'done';

    moveTask(draggableId, destStatus, destination.index);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 600 }}>Kanban Board</div>
        <Space>
          <span style={{ marginRight: 8 }}>Sort theo ngày</span>
          <Switch checked={sortByDeadline} onChange={setSortByDeadline} />
        </Space>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          {columns.map((col) => (
            <Col key={col.key} span={8}>
              <Card title={col.title} style={{ minHeight: 400 }} bodyStyle={{ minHeight: 340 }}>
                <Droppable droppableId={col.key}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 320 }}>
                      {getSortedTasks(col.key as 'todo' | 'doing' | 'done').map((task: any, idx: number) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(prov) => (
                            <Card
                              size='small'
                              style={{ marginBottom: 8 }}
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{task.title}</div>
                                  <div style={{ color: '#888', fontSize: 12 }}>{task.description}</div>
                                  <div style={{ marginTop: 6 }}>
                                    {task.tags?.map((tg: string) => (
                                      <Tag key={tg}>{tg}</Tag>
                                    ))}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div>{task.priority}</div>
                                  <div style={{ fontSize: 12, color: '#666' }}>{task.deadline ? new Date(task.deadline).toLocaleString() : ''}</div>
                                </div>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;
