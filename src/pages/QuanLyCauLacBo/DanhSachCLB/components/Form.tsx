import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { postClubAuditLog } from '@/services/QuanLyCauLacBo';
import { EClubAuditAction } from '@/services/QuanLyCauLacBo/constant';
import type { IClubRecord } from '@/services/QuanLyCauLacBo/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauLacBo = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		(useModel('quanlycaulacbo.caulacbo' as any) as any);
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue(record);
		} else {
			form.setFieldsValue({ hoatDong: true });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: IClubRecord) => {
		try {
			const avatar = await buildUpLoadFile(values, 'avatar');
			const payload = {
				...values,
				avatar: avatar ?? undefined,
			};

			if (edit) {
				await putModel(record?._id ?? '', payload, props?.getData);
				await postClubAuditLog({
					action: EClubAuditAction.UPDATE_CLUB,
					requestType: 'PUT',
					data: { id: record?._id, payload },
				});
			} else {
				await postModel(payload, props?.getData);
				await postClubAuditLog({
					action: EClubAuditAction.CREATE_CLUB,
					requestType: 'POST',
					data: payload,
				});
				form.resetFields();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='avatar' label='Ảnh đại diện' rules={[...rules.required, ...rules.fileRequired]}>
					<UploadFile isAvatarSmall />
				</Form.Item>

				<Form.Item name='tenClb' label='Tên CLB' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập tên câu lạc bộ' />
				</Form.Item>

				<Form.Item name='ngayThanhLap' label='Ngày thành lập' rules={[...rules.required]}>
					<MyDatePicker />
				</Form.Item>

				<Form.Item name='chuNhiem' label='Chủ nhiệm' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập tên chủ nhiệm' />
				</Form.Item>

				<Form.Item name='moTa' label='Mô tả' rules={[...rules.required]}>
					<TinyEditor height={260} hideMenubar miniToolbar />
				</Form.Item>

				<Form.Item name='hoatDong' label='Hoạt động' valuePropName='checked'>
					<Switch checkedChildren='Bật' unCheckedChildren='Tắt' />
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

export default FormCauLacBo;
