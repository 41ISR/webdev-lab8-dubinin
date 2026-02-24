import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsService } from '../api/services';
import { useUserStore } from '../store/useUserStore';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [itemRes, bidsRes] = await Promise.all([
        itemsService.getAll(),
        itemsService.getBids(id)
      ]);
      const foundItem = itemRes.data.find(i => i.id === parseInt(id));
      setItem(foundItem);
      setBids(bidsRes.data);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    const amount = parseFloat(bidAmount);
    const minBid = item.highestBid ? item.highestBid + 1 : item.price + 1;

    if (amount < minBid) {
      setError(`Ставка должна быть не менее ${minBid.toLocaleString()} ₽`);
      return;
    }

    try {
      await itemsService.createBid(id, { amount });
      setBidAmount('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании ставки');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      await itemsService.delete(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении товара');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  if (!item) {
    return <div style={styles.loading}>Товар не найден</div>;
  }

  const isOwner = user && user.id === item.userId;
  const minBid = item.highestBid ? item.highestBid + 1 : item.price + 1;

  return (
    <>
      <Link to="/" style={styles.backLink}>← Вернуться к списку товаров</Link>

      <div style={styles.itemDetail}>
        <div style={styles.itemHeader}>
          <div>
            <img
              src={item.imageUrl || 'https://via.placeholder.com/600x400/3498db/ffffff?text=No+Image'}
              alt={item.title}
              style={styles.itemImage}
            />
          </div>

          <div style={styles.itemInfo}>
            <span style={styles.itemStatus}>Активно</span>
            <h1 style={styles.itemTitle}>{item.title}</h1>

            <div style={styles.sellerInfo}>
              <div style={styles.sellerAvatar}>
                {item.username.substring(0, 2).toUpperCase()}
              </div>
              <div style={styles.sellerDetails}>
                <div style={styles.sellerName}>{item.username}</div>
                <div style={styles.sellerDate}>
                  Опубликовано: {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>

            <div style={styles.itemDescription}>{item.description}</div>

            <div style={styles.priceSection}>
              <div style={styles.startingPrice}>Начальная цена:</div>
              <div style={styles.currentPrice}>{item.price.toLocaleString()} ₽</div>
              {item.highestBid && (
                <div style={styles.highestBid}>
                  Текущая ставка: {item.highestBid.toLocaleString()} ₽
                </div>
              )}

              {error && <div style={styles.error}>{error}</div>}

              {!isOwner && user && (
                <form onSubmit={handleBidSubmit} style={styles.bidForm}>
                  <input
                    type="number"
                    style={styles.bidInput}
                    placeholder={`Введите вашу ставку (мин. ${minBid.toLocaleString()} ₽)`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    step="100"
                    required
                  />
                  <button type="submit" style={styles.btnBid}>Сделать ставку</button>
                </form>
              )}

              {!user && (
                <div style={styles.loginPrompt}>
                  <Link to="/login" style={styles.btnBid}>Войдите, чтобы сделать ставку</Link>
                </div>
              )}

              {isOwner && (
                <button onClick={handleDelete} style={styles.btnDelete}>
                  Удалить товар
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={styles.bidsSection}>
          <div style={styles.bidsHeader}>
            <h2 style={styles.bidsTitle}>История ставок</h2>
            <span style={styles.bidsCount}>{bids.length}</span>
          </div>

          {bids.length === 0 ? (
            <div style={styles.noBids}>
              <p>Ставок пока нет. Станьте первым!</p>
            </div>
          ) : (
            <div style={styles.bidsList}>
              {bids.map((bid, index) => (
                <div key={bid.id} style={index === 0 ? styles.bidItemHighest : styles.bidItem}>
                  <div style={styles.bidUser}>
                    <div style={styles.bidAvatar}>
                      {bid.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={styles.bidDetails}>
                      <span style={styles.bidUsername}>{bid.username}</span>
                      <span style={styles.bidTime}>
                        {new Date(bid.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    {index === 0 && <span style={styles.highestBadge}>🏆 Лидирует</span>}
                  </div>
                  <div style={styles.bidAmount}>{bid.amount.toLocaleString()} ₽</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  backLink: {
    color: '#3498db',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  itemDetail: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  itemHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    padding: '32px',
  },
  itemImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    backgroundColor: '#ecf0f1',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  itemStatus: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#d4edda',
    color: '#155724',
    width: 'fit-content',
  },
  itemTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0,
  },
  sellerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  sellerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  sellerDate: {
    fontSize: '12px',
    color: '#7f8c8d',
  },
  itemDescription: {
    color: '#555',
    lineHeight: '1.6',
    fontSize: '16px',
  },
  priceSection: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  startingPrice: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '8px',
  },
  currentPrice: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '16px',
  },
  highestBid: {
    fontSize: '18px',
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: '20px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '14px',
  },
  bidForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bidInput: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
  },
  btnBid: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
  loginPrompt: {
    marginTop: '12px',
  },
  btnDelete: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  bidsSection: {
    padding: '32px',
    borderTop: '1px solid #ecf0f1',
  },
  bidsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  bidsTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  bidsCount: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
  },
  bidsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bidItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    borderLeft: '4px solid #3498db',
  },
  bidItemHighest: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    borderLeft: '4px solid #f39c12',
  },
  bidUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  bidAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  bidDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  bidUsername: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  bidTime: {
    fontSize: '12px',
    color: '#7f8c8d',
  },
  bidAmount: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  highestBadge: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  noBids: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#7f8c8d',
  },
};
