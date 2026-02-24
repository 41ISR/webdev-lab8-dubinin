import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsService, statsService } from '../api/services';

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, statsRes] = await Promise.all([
        itemsService.getAll(),
        statsService.get()
      ]);
      setItems(itemsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Все товары</h1>
      </div>

      {stats && (
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalItems}</span>
            <span style={styles.statLabel}>Товаров</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalBids}</span>
            <span style={styles.statLabel}>Ставок</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.activeItems}</span>
            <span style={styles.statLabel}>Активных</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.averageItemPrice?.toLocaleString()} ₽</span>
            <span style={styles.statLabel}>Средняя цена</span>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={styles.noItems}>
          <div style={styles.noItemsIcon}>📦</div>
          <h2>Товаров пока нет</h2>
          <p>Станьте первым, кто разместит товар на продажу!</p>
        </div>
      ) : (
        <div style={styles.itemsGrid}>
          {items.map((item) => (
            <Link key={item.id} to={`/items/${item.id}`} style={styles.itemCard}>
              <img
                src={item.imageUrl || 'https://via.placeholder.com/300x200/3498db/ffffff?text=No+Image'}
                alt={item.title}
                style={styles.itemImage}
              />
              <div style={styles.itemContent}>
                <span style={styles.statusBadge}>Активно</span>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemDescription}>{item.description}</p>
                <div style={styles.itemFooter}>
                  <div>
                    <div style={styles.itemPrice}>{item.price.toLocaleString()} ₽</div>
                    {item.highestBid && (
                      <div style={styles.bidInfo}>
                        Текущая ставка: {item.highestBid.toLocaleString()} ₽
                        <span style={styles.bidCount}>{item.bidCount}</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.itemMeta}>
                    <span style={styles.itemSeller}>Продавец: {item.username}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
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
  pageHeader: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    color: '#2c3e50',
  },
  stats: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#3498db',
    display: 'block',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginTop: '4px',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  },
  itemImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: '#ecf0f1',
  },
  itemContent: {
    padding: '16px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  itemTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
    marginTop: '8px',
  },
  itemDescription: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #ecf0f1',
  },
  itemPrice: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  bidInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#e74c3c',
    fontWeight: '500',
    marginTop: '4px',
  },
  bidCount: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
  },
  itemMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  itemSeller: {
    fontSize: '12px',
    color: '#95a5a6',
  },
  noItems: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#7f8c8d',
  },
  noItemsIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
};
