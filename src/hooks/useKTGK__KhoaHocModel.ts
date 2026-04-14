import type { IKhoaHoc } from '@/services/KTGK__QuanLyKhoaHocOnline/typing';
import { createKhoaHoc, deleteKhoaHoc, getKhoaHocList, updateKhoaHoc } from '@/services/KTGK__QuanLyKhoaHocOnline';
import { message } from 'antd';
import { useEffect, useState } from 'react';

const useKTGK__KhoaHocModel = () => {
	const [danhSach, setDanhSach] = useState<IKhoaHoc.IRecord[]>([]);
	const [page, setPage] = useState<IKhoaHoc.IRecord[]>([]);
	const [record, setRecord] = useState<IKhoaHoc.IRecord>();
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(true);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);


	const getModel = async () => {
		setLoading(true);
		try {
			const data = await getKhoaHocList();
			setDanhSach(data);
			setPage(data.slice(0, limit));
			setTotal(data.length);
		} catch (error) {
			message.error('Lỗi tải danh sách khóa học');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};


	const postModel = async (payload: Omit<IKhoaHoc.IRecord, '_id' | 'createdAt'>, callback?: () => void) => {
		setFormSubmiting(true);
		try {
			await createKhoaHoc(payload);
			message.success('Thêm khóa học thành công');
			await getModel();
			callback?.();
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Lỗi thêm khóa học';
			message.error(errorMessage);
			console.error(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	
	const putModel = async (id: string, payload: Partial<IKhoaHoc.IRecord>, callback?: () => void) => {
		setFormSubmiting(true);
		try {
			await updateKhoaHoc(id, payload);
			message.success('Cập nhật khóa học thành công');
			await getModel();
			callback?.();
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Lỗi cập nhật khóa học';
			message.error(errorMessage);
			console.error(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	
	const deleteModel = async (id: string, callback?: () => void) => {
		setLoading(true);
		try {
			await deleteKhoaHoc(id);
			message.success('Xóa khóa học thành công');
			await getModel();
			callback?.();
		} catch (error) {
			message.error('Lỗi xóa khóa học');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	
	useEffect(() => {
		getModel();
	}, []);

	return {
		danhSach,
		page,
		record,
		setRecord,
		limit,
		setLimit,
		loading,
		setLoading,
		formSubmiting,
		setFormSubmiting,
		edit,
		setEdit,
		isView,
		setIsView,
		visibleForm,
		setVisibleForm,
		total,
		setTotal,
		getModel,
		postModel,
		putModel,
		deleteModel,
	};
};

export default useKTGK__KhoaHocModel;
