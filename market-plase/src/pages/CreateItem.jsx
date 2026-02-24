import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { itemsService } from '../api/services';

export default function CreateItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.title.length > 100) {
      setError('Название не должно превышать 100 символов');
      return;
    }

    if (formData.description.length > 1000) {
      setError('Описание не должно превышать 1000 символов');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Цена должна быть больше 0');
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };
      const response = await itemsService.create(data);
      navigate(`/items/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Создать новый товар</h1>
      </div>

      <div style={styles.formContainer}>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Название товара <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              style={styles.input}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: iPhone 14 Pro 256GB"
              maxLength="100"
              required
            />
            <div style={styles.charCounter}>
              <span>{formData.title.length}</span> / 100
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Описание <span style={styles.required}>*</span>
            </label>
            <textarea
              style={styles.textarea}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Подробно опишите товар, его состояние, характеристики..."
              maxLength="1000"
              required
            />
            <div style={styles.charCounter}>
              <span>{formData.description.length}</span> / 1000
            </div>
            <div style={styles.hint}>
              Чем подробнее описание, тем больше шансов продать товар
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Начальная цена <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputGroup}>
              <input
                type="number"
                style={styles.inputWithPrefix}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="5000"
                min="1"
                step="100"
                required
              />
              <span style={styles.inputPrefix}>₽</span>
            </div>
            <div style={styles.hint}>
              Укажите минимальную цену, с которой начнутся торги
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>URL изображения</label>
            <input
              type="url"
              style={styles.input}
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <div style={styles.hint}>
              Вставьте ссылку на изображение товара (опционально)
            </div>
            {formData.imageUrl && (
              <div style={styles.imagePreview}>
                <img src={formData.imageUrl} alt="Предпросмотр" style={styles.previewImg} />
              </div>
            )}
          </div>

          <div style={styles.formActions}>
            <Link to="/" style={styles.btnCancel}>Отмена</Link>
            <button type="submit" style={styles.btnSubmit} disabled={loading}>
              {loading ? 'Создание...' : 'Создать товар'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const styles = {
  pageHeader: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    color: '#2c3e50',
  },
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  error: {
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
    fontSize: '14px',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    minHeight: '150px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  hint: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '6px',
  },
  charCounter: {
    fontSize: '12px',
    color: '#7f8c8d',
    textAlign: 'right',
    marginTop: '4px',
  },
  inputGroup: {
    position: 'relative',
  },
  inputWithPrefix: {
    width: '100%',
    padding: '12px 16px',
    paddingRight: '45px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputPrefix: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#7f8c8d',
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  previewImg: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    maxHeight: '300px',
    objectFit: 'contain',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #ecf0f1',
  },
  btnCancel: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  btnSubmit: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
