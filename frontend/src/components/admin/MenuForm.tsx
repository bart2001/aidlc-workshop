import React, { useState, useEffect } from 'react';
import type { MenuItem, Category, MenuItemCreateRequest, MenuItemUpdateRequest } from '../../types';

interface MenuFormProps {
  categories: Category[];
  editItem?: MenuItem | null;
  onSubmit: (data: MenuItemCreateRequest | MenuItemUpdateRequest) => void;
  onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ categories, editItem, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setPrice(String(editItem.price));
      setDescription(editItem.description || '');
      setCategoryId(editItem.categoryId);
      setImageUrl(editItem.imageUrl || '');
      setDisplayOrder(String(editItem.displayOrder));
    }
  }, [editItem]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = '메뉴명을 입력해주세요.';
    if (!price || Number(price) < 0 || Number(price) > 10000000) newErrors.price = '가격은 0~10,000,000 범위여야 합니다.';
    if (!categoryId) newErrors.categoryId = '카테고리를 선택해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      price: Number(price),
      description: description.trim() || undefined,
      categoryId: Number(categoryId),
      imageUrl: imageUrl.trim() || undefined,
      displayOrder: Number(displayOrder),
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <h3>{editItem ? '메뉴 수정' : '메뉴 등록'}</h3>

      <div className="form-group">
        <label htmlFor="menu-name">메뉴명 *</label>
        <input id="menu-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="menu-price">가격 (원) *</label>
        <input id="menu-price" type="number" min="0" max="10000000" value={price} onChange={(e) => setPrice(e.target.value)} />
        {errors.price && <span className="form-error">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="menu-category">카테고리 *</label>
        <select id="menu-category" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value) || '')}>
          <option value="">선택해주세요</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="menu-desc">설명</label>
        <textarea id="menu-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="form-group">
        <label htmlFor="menu-image">이미지 URL</label>
        <input id="menu-image" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="menu-order">노출 순서</label>
        <input id="menu-order" type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{editItem ? '수정' : '등록'}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>취소</button>
      </div>
    </form>
  );
};

export default MenuForm;
