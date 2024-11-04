"use client";

import React, { useState } from 'react';
import styles from './FinancialControl.module.css';

const FinancialControl: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<string>(''); // Estado para armazenar a data
  const [transactions, setTransactions] = useState<{
    amount: number;
    description: string;
    date: string; // Nova propriedade para a data
    type: 'add' | 'remove';
  }[]>([]);
  const [transactionType, setTransactionType] = useState<'add' | 'remove'>('add'); // Estado para definir se é adicionar ou remover

  const handleAddTransaction = () => {
    if (amount !== '' && date) { // Verifica se a quantidade e a data estão preenchidas
      const transactionAmount = transactionType === 'remove' ? -Number(amount) : Number(amount); // Tornar o valor negativo se a transação for do tipo "remover"
      const newTransaction = { amount: transactionAmount, description, date, type: transactionType };
      setTransactions([...transactions, newTransaction]);
      setAmount(''); // Limpa o valor do campo
      setDescription(''); // Limpa a descrição
      setDate(''); // Limpa a data
    }
  };

  // Ordena as transações por data mais recente
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // Compara as datas
  });

  return (
    <div className={styles.container}>
      <h2 className="text-2xl font-bold text-blue-900 mb-2">Adicionar Lançamento</h2>

      {/* Seleção de Tipo de Transação */}
      <div className={styles.transactionType}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="add"
            checked={transactionType === 'add'}
            onChange={() => setTransactionType('add')}
          />
          Adicionar Saldo
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="remove"
            checked={transactionType === 'remove'}
            onChange={() => setTransactionType('remove')}
          />
          Remover Saldo
        </label>
      </div>

      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={`${styles.input} ${styles.inputText}`} // Classe para estilo consistente
      />
      <input
        type="text"
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={`${styles.input} ${styles.inputText}`} // Classe para estilo consistente
      />
      <input
        type="date" // Campo de entrada para a data
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={`${styles.input} ${styles.inputText}`} // Classe para estilo consistente
      />
      <button onClick={handleAddTransaction} className={styles.addButton}>Adicionar</button>
      <div className="spacer" style={{ marginBottom: '20px' }}></div>

      <h2 className="font-bold text-blue-900 mb-1">Transações Efetuadas:</h2>
      <ul className={styles.transactionList}>
        {sortedTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description ? `${transaction.description}` : ''} 
            <div>
              {transaction.amount < 0 
                ? `-R$${Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                : `R$${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            </div>
            {transaction.date && <div>{transaction.date}</div>} {/* Exibe a data em uma nova linha */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialControl;