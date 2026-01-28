import React, { useState, useMemo } from 'react';
import {
  Button, Form, Input, Modal, Select, Space,
  Table, Popconfirm, message, Tag
} from 'antd';
import { useModel } from 'umi';
import type { Order, OrderItem } from '@/models/danhsachdonhang';
import type { Product } from '@/models/danhsachsanpham';

const STATUS_MAP: Record<string, { color: string }> = {
  'Chờ xử lý': { color: 'blue' },
  'Đang giao hàng': { color: 'warning' },
  'Đã hoàn thành': { color: 'success' },
  'Đã hủy': { color: 'error' },
};

const TableDH = () => {
  const { danhSachDonHang, addDonHang, updateDonHang, deleteDonHang } = useModel('danhsachdonhang');
  const { danhSachSanPham, setDanhSachSanPham } = useModel('danhsachsanpham');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [visible, setVisible] = useState(false);
  const [editingRow, setEditingRow] = useState<Order | null>(null);
  const [form] = Form.useForm();
  const watchedProducts: OrderItem[] = Form.useWatch('products', form) || [];


 const onFinish = (values: any) => {
  const payload = {
    ...values,
    totalAmount:
      values.products?.reduce(  
        (sum: number, item: OrderItem) =>
          sum + item.price * item.quantity,
        0
      ) || 0,
  };

  const newStatus = values.status;
  const oldStatus = editingRow?.status;
  if (newStatus === 'Đã hoàn thành' && oldStatus !== 'Đã hoàn thành') {

    for (const item of values.products) {
      const productInStock = danhSachSanPham.find(
        (p) => p.id === item.productId
      );

      if (!productInStock || productInStock.quantity < item.quantity) {
        message.error(
          `Sản phẩm "${item.productName}" không đủ hàng (Còn ${productInStock?.quantity || 0})`
        );
        return;
      }
    }

 
    setDanhSachSanPham(
      danhSachSanPham.map((p) => {
        const orderItem = values.products.find(
          (i: OrderItem) => i.productId === p.id
        );
        return orderItem
          ? { ...p, quantity: p.quantity - orderItem.quantity }
          : p;
      })
    );
  }
  if (oldStatus === 'Đã hoàn thành' && newStatus === 'Đã hủy') {
    setDanhSachSanPham(
      danhSachSanPham.map((p) => {
        const orderItem = editingRow?.products.find(
          (i: OrderItem) => i.productId === p.id
        );
        return orderItem
          ? { ...p, quantity: p.quantity + orderItem.quantity }
          : p;
      })
    );
  }
  if (editingRow) {
    updateDonHang(editingRow.id, payload);
    message.success('Cập nhật đơn hàng thành công');
  } else {
    addDonHang(payload);
    message.success('Thêm đơn hàng thành công');
  }

  form.resetFields();
  setVisible(false);
};


  const columns = useMemo(() => [
    {
      title: 'STT',
      key: 'stt',
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Mã Đơn', dataIndex: 'id', align: 'center' as const },
    { title: 'Khách Hàng', dataIndex: 'customerName', align: 'center' as const },
    {
      title: 'Số Sản Phẩm',
      dataIndex: 'products',
      align: 'center' as const,
      render: (products: OrderItem[]) => products?.length || 0,
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalAmount',
      align: 'center' as const,
      render: (totalAmount: number) => totalAmount.toLocaleString() + ' đ',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={STATUS_MAP[status]?.color || 'default'}>{status}</Tag>
      ),
    },
    { title: 'Ngày Tạo', dataIndex: 'createdAt', align: 'center' as const },
    {
      title: 'Thao Tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: Order) => (
        <Space>
          <Button onClick={() => {
            setEditingRow(record);
            form.setFieldsValue(record);
            setVisible(true);
          }}>Sửa</Button>
          <Popconfirm title="Xóa đơn hàng?" onConfirm={() => deleteDonHang(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: 'Xem Chi Tiết',
      key: 'details',
      align: 'center' as const,
      render: (_: any, record: Order) => (
        <Button
          onClick={() => {
            Modal.info({
              title: `Chi Tiết Đơn Hàng ${record.id}`,
              width: 700,
              content: (
                <div>
          
                  <Table
                    dataSource={[record]}
                    pagination={false}
                    rowKey="id"
                    bordered
                    size="small"
                    columns={[
                      {
                        title: 'Khách Hàng',
                        dataIndex: 'customerName',
                        align: 'center' ,
                      },
                      {
                        title: 'SĐT',
                        dataIndex: 'phone',
                        align: 'center',
                      },
                      {
                        title: 'Địa Chỉ',
                        dataIndex: 'address',
                        align: 'center',
                      },
                      {
                        title: 'Tổng Tiền',
                        dataIndex: 'totalAmount',
                        align: 'center',
                        render: (v: number) => `${(v ?? 0).toLocaleString()} đ`,
                      },
                      {
                        title: 'Trạng Thái',
                        dataIndex: 'status',
                        align: 'center',
                        render: (s: string) => (
                          <Tag color={STATUS_MAP[s]?.color || 'default'}>{s}</Tag>
                        ),
                      },
                      {
                        title: 'Ngày Tạo',
                        dataIndex: 'createdAt',
                        align: 'center',
                      },
                    ]}
                  />

       
                  <div style={{ marginTop: 16 }} />

               
                  <Table
                    dataSource={record.products || []}
                    pagination={false}
                    rowKey="productId"
                    bordered
                    size="small"
                    title={() => <b>Danh sách sản phẩm</b>}
                    columns={[
                      {
                        title: 'Tên Sản Phẩm',
                        dataIndex: 'productName',
                        align: 'center',
                      },
                      {
                        title: 'Giá',
                        dataIndex: 'price',
                        align: 'center',
                        render: (p?: number) => `${(p ?? 0).toLocaleString()} đ`,
                      },
                      {
                        title: 'Số Lượng',
                        dataIndex: 'quantity',
                        align: 'center',
                      },
                      {
                        title: 'Thành Tiền',
                        align: 'center',
                        render: (_: any, item: OrderItem) =>
                          `${((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()} đ`,
                      },
                    ]}
                  />
                </div>
              ),
            });
          }}
        >
          Xem
        </Button>
      ),
    }

  ], [deleteDonHang, form, updateDonHang]);


  const dataHienThi = useMemo(() => {
    return danhSachDonHang.filter((order) =>
      order.customerName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [danhSachDonHang, searchKeyword]);

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => {
          setEditingRow(null);
          form.resetFields();
          form.setFieldsValue({ status: 'Chờ xử lý', products: [] });
          setVisible(true);
        }}>Thêm Đơn Hàng</Button>
        <Input
          placeholder="Tìm khách hàng..."
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
      </Space>

      <Table columns={columns} dataSource={dataHienThi} rowKey="id" />

      <Modal
        title={editingRow ? 'Chỉnh Sửa Đơn Hàng' : 'Thêm Đơn Hàng'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="customerName" label="Tên Khách Hàng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa Chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Space size="large">
            <Form.Item name="phone" label="Số Điện Thoại" rules={[{ pattern: /^[0-9]{10,11}$/, message: '10-11 chữ số' }]}>
              <Input style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="createdAt" label="Ngày Tạo" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
          </Space>

          <Form.Item label="Sản phẩm trong đơn hàng" required>

            <Select
              mode="multiple"
              placeholder="Bấm vào đây để chọn sản phẩm"
              style={{ width: '100%', marginBottom: 12 }}

              value={watchedProducts?.map((p: any) => p.productId)}
              onChange={(ids: number[]) => {
                const selectedItems = ids.map(id => {
                  const p = danhSachSanPham.find(i => i.id === id);
                  return {
                    productId: p?.id,
                    productName: p?.name,
                    quantity: 1,
                    price: p?.price || 0
                  };
                });
                form.setFieldsValue({ products: selectedItems });
              }}
            >
              {danhSachSanPham.map((p: any) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name} - {p.price.toLocaleString()} đ
                </Select.Option>
              ))}
            </Select>


            {watchedProducts && watchedProducts.length > 0 && (
              <Table
                dataSource={watchedProducts}
                pagination={false}
                size="small"
                rowKey="productId"
                bordered
                columns={[
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: 'productName',
                    key: 'productName',
                    align: 'center' as const,
                  },
                  {
                    title: 'Giá',
                    dataIndex: 'price',
                    key: 'price',
                    align: 'center' as const,
                    render: (price?: number) =>
                      (price ?? 0).toLocaleString() + ' đ',
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'center' as const,
                    render: (_: any, record: OrderItem, index: number) => (
                      <Input
                        type="number"
                        min={1}
                        value={record.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10) || 1;
                          const updatedProducts = [...watchedProducts];
                          updatedProducts[index] = { ...record, quantity: newQuantity };
                          form.setFieldsValue({ products: updatedProducts });
                        }}
                        style={{ width: 80 }}
                      />
                    ),
                  },
                  {
                    title: 'Thao tác',
                    key: 'action',
                    align: 'center' as const,
                    render: (_: any, record: OrderItem) => (
                      <Button
                        danger
                        onClick={() => {
                          const filtered = watchedProducts.filter(p => p.productId !== record.productId);
                          form.setFieldsValue({ products: filtered });
                        }}
                      >
                        Xóa
                      </Button>
                    ),
                  },
                ]}
              />
            )}

            <Form.Item name="products" hidden />
          </Form.Item>

          <Form.Item name="status" label="Trạng Thái">
            <Select >
              {Object.keys(STATUS_MAP).map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableDH;