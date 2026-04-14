import TinyEditor from '@/components/TinyEditor';
import { DANH_SACH_GIANG_VIEN, ETrangThaiKhoaHoc, TRANG_THAI_KHOA_HOC_LABEL } from '@/services/KTGK__QuanLyKhoaHocOnline/constant';
import type { IKhoaHoc } from '@/services/KTGK__QuanLyKhoaHocOnline/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';

interface FormKTGK__KhoaHocProps {
	record?: IKhoaHoc.IRecord;
	setVisibleForm: (visible: boolean) => void;
	edit: boolean;
	postModel: (payload: Omit<IKhoaHoc.IRecord, '_id' | 'createdAt'>, callback?: () => void) => Promise<void>;
	putModel: (id: string, payload: Partial<IKhoaHoc.IRecord>, callback?: () => void) => Promise<void>;
	formSubmiting: boolean;
	visibleForm: boolean;
	getModel: () => Promise<void>;
}

const FormKTGK__KhoaHoc = (props: FormKTGK__KhoaHocProps) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				tenGiangVien: record.idGiangVien,
			});
		} else {
			form.setFieldsValue({
				soHocVien: 0,
				trangThai: ETrangThaiKhoaHoc.DANG_MO,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			const tenGiangVien = DANH_SACH_GIANG_VIEN.find((gv) => gv.id === values.tenGiangVien)?.ten || '';

			const payload: Omit<IKhoaHoc.IRecord, '_id' | 'createdAt'> = {
				ten: values.ten,
				idGiangVien: values.tenGiangVien,
				tenGiangVien,
				moTa: values.moTa,
				trangThai: values.trangThai,
				soHocVien: values.soHocVien || 0,
				danhSachHocVien: record?.danhSachHocVien || [],
			};

			if (edit) {
				await putModel(record?._id ?? '', payload, getModel);
			} else {
				await postModel(payload, getModel);
				form.resetFields();
			}
			setVisibleForm(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'Khóa học'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='ten'
					label='Tên khóa học'
					rules={[
						...rules.required,
						...rules.text,
						{
							max: 100,
							message: 'tên khóa học ko quá 100 chữ',
						},
					]}
				>
					<Input placeholder='Nhập tên khóa học' />
				</Form.Item>

				<Form.Item name='tenGiangVien' label='giảng viên' rules={[...rules.required]}>
					<Select placeholder='Chọn giảng viên'>
						{DANH_SACH_GIANG_VIEN.map((gv) => (
							<Select.Option key={gv.id} value={gv.id}>
								{gv.ten}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='soHocVien' label='số lượng học viên' rules={[...rules.required]}>
					<InputNumber placeholder='Nhập số học viên' min={0} />
				</Form.Item>

				<Form.Item name='moTa' label='mô tả khóa học' rules={[...rules.required]}>
					<TinyEditor height={260} hideMenubar miniToolbar />
				</Form.Item>

				<Form.Item name='trangThai' label='trạng thái' rules={[...rules.required]}>
					<Select placeholder='Chọn trạng thái'>
						{Object.entries(TRANG_THAI_KHOA_HOC_LABEL).map(([key, label]) => (
							<Select.Option key={key} value={key}>
								{label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKTGK__KhoaHoc;
