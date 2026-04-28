import { Card, Col, Row, Statistic, Timeline } from 'antd';
import { ColumnChart, LineChart } from '@/components/Chart';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DashboardPage = () => {
  const { getRecentWorkouts, getHealthMetrics } = useModel('quanlytheduc.index' as any) as any;
  const [recent, setRecent] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    getRecentWorkouts().then(setRecent);
    getHealthMetrics().then(setMetrics);
  }, []);

  const columnData = {
    title: 'Buổi tập theo tuần',
    xAxis: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    yAxis: [[3, 4, 5, 2]],
    yLabel: ['Số buổi'],
  };

  const lineData = {
    title: 'Cân nặng theo thời gian',
    xAxis: metrics.map((m: any) => new Date(m.date).toLocaleDateString()),
    yAxis: [[...metrics.map((m: any) => m.weight)]],
    yLabel: ['Kg'],
  };

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title='Tổng buổi tập trong tháng' value={24} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='Tổng calo đã đốt' value={12450} suffix='kcal' />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='Số ngày tập liên tiếp' value={5} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='Mục tiêu hoàn thành' value={65} suffix='%' />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card>
            <ColumnChart {...(columnData as any)} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <LineChart {...(lineData as any)} />
          </Card>
        </Col>
      </Row>

      <Card title='5 buổi tập gần nhất'>
        <Timeline>
          {recent.map((r) => (
            <Timeline.Item key={r.id}>{`${new Date(r.date).toLocaleString()} — ${r.type} — ${r.duration} phút`}</Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </>
  );
};

export default DashboardPage;
