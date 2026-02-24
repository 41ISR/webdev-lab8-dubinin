import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bidsService } from '../api/services';

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = async () => {
    try {
      const response = await bidsService.getMy();
      setBids(response.data);
    } catch (error) {
      console.error('Error loading bids:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  const winningBids = bids.filter(bid => bid.isWinning);
  const totalAmount = bids.reduce((sum, bid) => sum + bid.amount, 0);

  return (
    <>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Мои ставки</h1>
        <p style={styles.subtitle}>История ваших ставок на товары</p>
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryValue}>{bids.length}</span>
          <span style={styles.summaryLabel}>Всего ставок</span>
        </div>
        <div style={{ ...styles.summaryCard, ...styles.summaryCardWinning }}>
          <span style={styles.summaryValue}>{winningBids.length}</span>
          <span style={styles.summaryLabel}>Лидирующих ставок</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={styles.summaryValue}>{totalAmount.toLocaleString()} ₽</span>
          <span style={styles.summaryLabel}>Общая сумма</span>
        </div>
      </div>

      {bids.length === 0 ? (
        <div style={styles.noBids}>
          <div style={styles.noBidsIcon}>💸</div>
          <h2>Вы еще не делали ставок</h2>
          <p>Просмотрите доступные товары и сделайте первую ставку!</p>
          <Link to="/" style={styles.btnBrowse}>Посмотреть товары</Link>
        </div>
      ) : (
        <div style={styles.bidsList}>
          {bids.map((bid) => (
            <Link
              key={bid.id}
              to={`/items/${bid.itemId}`}
              style={bid.isWinning ? styles.bidItemWinning : styles.bidItem}
            >
              <div style={styles.bidContent}>
                <div style={styles.bidHeader}>
                  <span style={styles.bidTitle}>{bid.itemTitle}</span>
                  {bid.isWinning ? (
                    <span style={styles.winningBadge}>🏆 Лидирую</span>
                  ) : (
                    <span style={styles.outbidBadge}>Перебита</span>
                  )}
                </div>
                <div style={styles.bidMeta}>
                  <span>⏰ {new Date(bid.createdAt).toLocaleString('ru-RU')}</span>
                </div>
              </div>
              <div style={styles.bidAmountSection}>
                <span style={styles.bidAmount}>{bid.amount.toLocaleString()} ₽</span>
                <span style={styles.bidStatus}>Моя ставка</span>
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
    marginBottom: '8px',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '16px',
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  summaryCardWinning: {
    backgroundColor: '#d4edda',
  },
  summaryValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#3498db',
    display: 'block',
    marginBottom: '8px',
  },
  summaryLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  bidsList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  bidItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #ecf0f1',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background-color 0.2s',
  },
  bidItemWinning: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #ecf0f1',
    backgroundColor: '#d4edda',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background-color 0.2s',
  },
  bidContent: {
    flex: 1,
    minWidth: 0,
  },
  bidHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  bidTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  winningBadge: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  outbidBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  bidMeta: {
    display: 'flex',
    gap: '20px',
    color: '#7f8c8d',
    fontSize: '14px',
  },
  bidAmountSection: {
    textAlign: 'right',
    minWidth: '120px',
  },
  bidAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#27ae60',
    display: 'block',
  },
  bidStatus: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '4px',
  },
  noBids: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  noBidsIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  btnBrowse: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    marginTop: '24px',
  },
};
