import React, { useState, useEffect } from 'react';
import type { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../../types';

interface CategoryFormProps {
  editItem?: Category | null;
  onSubmit: (data: CategoryCreateRequest | CategoryUpdateRequest) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ editItem, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setDisplayOrder(String(editItem.displayOrder));
    }
  }, [editItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('카테고리명을 입력해주세요.');
      return;
    }
    setError('');
    onSubmit({ name: name.trim(), displayOrder: Number(displayOrder) });
  };

  return (
    <form className="admin-form admin-form--inline" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="cat-name">카테고리명 *</label>
        <input id="cat-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {error && <span className="form-error">{error}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="cat-order">순서</label>
        <input id="cat-order" type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{editItem ? '수정' : '등록'}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>취소</button>
      </div>
    </form>
  );
};

export default CategoryForm;
