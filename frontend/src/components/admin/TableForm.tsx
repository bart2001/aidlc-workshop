import React, { useState, useEffect } from 'react';
import type { StoreTable } from '../../types';

interface TableFormProps {
  editItem?: StoreTable | null;
  onSubmit: (data: { tableNumber: number; password?: string }) => void;
  onCancel: () => void;
}

const TableForm: React.FC<TableFormProps> = ({ editItem, onSubmit, onCancel }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setTableNumber(String(editItem.tableNumber));
      setPassword('');
    }
  }, [editItem]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!tableNumber || Number(tableNumber) <= 0) newErrors.tableNumber = '유효한 테이블 번호를 입력해주세요.';
    if (!editItem && !password) newErrors.password = '비밀번호를 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      tableNumber: Number(tableNumber),
      password: password || undefined,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <h3>{editItem ? '테이블 수정' : '테이블 등록'}</h3>
      <div className="form-group">
        <label htmlFor="table-number">테이블 번호 *</label>
        <input id="table-number" type="number" min="1" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
        {errors.tableNumber && <span className="form-error">{errors.tableNumber}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="table-password">{editItem ? '비밀번호 (변경 시 입력)' : '비밀번호 *'}</label>
        <input id="table-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{editItem ? '수정' : '등록'}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>취소</button>
      </div>
    </form>
  );
};

export default TableForm;
