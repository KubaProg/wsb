export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    note?: string;
  }
  