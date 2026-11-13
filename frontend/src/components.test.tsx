import { render, screen, fireEvent } from '@testing-library/react';
import SummaryTiles from './components/SummaryTiles';
import CategoryBreakdown from './components/CategoryBreakdown';
import MessagesTable from './components/MessagesTable';

describe('SummaryTiles', () => {
  it('shows totals', () => {
    render(<SummaryTiles total={1200} urgent={7} />);
    expect(screen.getByTestId('urgent')).toHaveTextContent('7');
  });
});

describe('CategoryBreakdown', () => {
  it('renders all six categories when all are present', () => {
    const counts = { delivery: 4, payment: 2, refund: 1, product_quality: 1, account: 1, other: 1 };
    render(<CategoryBreakdown counts={counts} total={10} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByText('40.0%')).toBeInTheDocument();
  });
  it('allows selecting a category from the overview breakdown', () => {
    const counts = { delivery: 4, payment: 2, refund: 1, product_quality: 1, account: 1, other: 1 };
    const onSelect = vi.fn();
    render(<CategoryBreakdown counts={counts} total={10} onSelectCategory={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /پرداخت/ }));
    expect(onSelect).toHaveBeenCalledWith('payment');
  });
});


const sampleMessages = [
  { message_id: 'M1', category: 'delivery' as const, is_urgent: false, order_ref: null, duplicate_of: null, customer_id: 'C1', channel: 'email', received_at: '2026-11-10T08:00:00Z', answered_at: null, subject: 'Delivery delay', body: 'Where is my order?', severity: 'low', severity_hint: 'low', business_minutes_left: 120 },
  { message_id: 'M2', category: 'payment' as const, is_urgent: true, order_ref: 'BZ-12345', duplicate_of: null, customer_id: 'C2', channel: 'web_form', received_at: '2026-11-11T08:00:00Z', answered_at: null, subject: 'Payment charged twice', body: 'I was charged twice', severity: 'high', severity_hint: 'high', business_minutes_left: -30 },
];

describe('MessagesTable filters and sorting', () => {
  it('filters messages by category', () => {
    render(<MessagesTable messages={sampleMessages} />);
    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'payment' } });
    expect(screen.getByText('M2')).toBeInTheDocument();
    expect(screen.queryByText('M1')).not.toBeInTheDocument();
  });
  it('sorts urgent messages first', () => {
    const { container } = render(<MessagesTable messages={sampleMessages} />);
    fireEvent.change(screen.getByTestId('message-sort'), { target: { value: 'urgent' } });
    const firstRow = container.querySelector('tbody tr');
    expect(firstRow?.textContent).toContain('M2');
  });
});
