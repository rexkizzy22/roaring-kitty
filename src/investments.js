// Static catalogue shown on the dashboard cards and the investment pages.
export const investments = {
  diversified: {
    key: 'diversified', path: 'diversified-fund', title: 'Diversified Fund',
    blurb: 'Enhance the income of your portfolio with a diversified private markets fund.',
    min: 10000, status: 'Fully Subscribed', tone: 'red', banner: 'b1',
    rows: [['Min Investment', '$10,000'], ['Liquidity', 'Quarterly'], ['Tax Document', '1099 DIV'], ['Payment Schedule', 'Quarterly']],
    open: false, action: 'Join waitlist',
  },
  copy: {
    key: 'copy', path: 'copy-trading', title: 'Copy Trading',
    blurb: 'Automatically mirror top-performing traders in real time.',
    min: 0, status: 'Whitelist Open', tone: 'green', banner: 'b2',
    rows: [['Min Investment', 'Custom'], ['Liquidity', 'Quarterly'], ['Payment Schedule', 'Quarterly']],
    open: true, action: 'Start copying',
    options: ['Alpha Momentum', 'Steady Dividend', 'Swing Master', 'Options Edge'],
  },
  crypto: {
    key: 'crypto', path: 'enhanced-crypto', title: 'Enhanced Crypto Funds',
    blurb: 'Advance crypto fund to enhance the income of your portfolio across multiple market sectors.',
    min: 10000, status: 'Upcoming Offering', tone: 'yellow', banner: 'b3',
    rows: [['Min Investment', '$10,000'], ['Liquidity', 'Quarterly'], ['Payment Schedule', 'Quarterly']],
    open: false, action: 'Join waitlist',
  },
  gme: {
    key: 'gme', path: 'gme-pool', title: 'G.M.E Pool',
    blurb: 'Strategic equity pool focused on high-volatility opportunities.',
    min: 0, status: 'Upcoming Offering', tone: 'yellow', banner: 'b4',
    rows: [], open: false, action: 'Join waitlist',
  },
  stock: {
    key: 'stock', path: 'stock-market', title: 'Stock Market',
    blurb: 'Buy shares of listed companies directly from your balance.',
    min: 10, status: 'Open', tone: 'green', banner: 'b1',
    rows: [['Min Investment', '$10'], ['Liquidity', 'Instant'], ['Settlement', 'T+1']],
    open: true, action: 'Buy shares',
    options: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GME'],
  },
};
export const dashboardCards = ['diversified', 'copy', 'crypto', 'gme'];
