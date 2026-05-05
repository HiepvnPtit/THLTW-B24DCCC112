import { Card, Col, Row, Statistic, Button } from 'antd';
import { useModel, history } from 'umi';

const DashboardPage: React.FC = () => {
  const { stats } = useModel('congviec' as any) as any;
  const s = stats();

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title='Tổng số task' value={s.total} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title='Số task hoàn thành' value={s.done} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title='Số task quá hạn' value={s.overdue} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title='Đi tới' style={{ textAlign: 'center' }}>
            <Button type='primary' onClick={() => history.push('/cong-viec/kanban')} style={{ marginRight: 8 }}>
              Mở Kanban
            </Button>
            <Button onClick={() => history.push('/cong-viec/danh-sach')}>Danh sách Task</Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
