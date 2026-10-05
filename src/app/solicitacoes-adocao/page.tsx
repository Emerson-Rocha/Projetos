'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import Titulo from '@/components/UI/Titulo/Titulo';
import styles from './adocao.module.css';

interface SolicitacaoAdocao {
  id: string;
  nomeAnimal: string;
  tipoAnimal: 'Cachorro' | 'Gato';
  rgAnimal: string;
  nomeAdotante: string;
  rgAdotante: string;
  dataSolicitacao: string;
  status: 'Pendente' | 'Aprovado' | 'Recusado';
  statusAnimal: 'No canil' | 'Em passeio' | 'Em clínica';
  adotouAntes: boolean;
  qtdAdotouAntes: number;
  temOutrosPets: boolean;
  temCriancas: boolean;
  qtdCriancas: number;
  familiaTamanho: number;
  rendaFamiliar: number;
  motivo: string;
}

export default function SolicitacoesAdocao() {
  const [selected, setSelected] = useState<SolicitacaoAdocao | null>(null);
  const [filtroAtual, setFiltroAtual] = useState<'Todos' | 'Pendente' | 'Aprovado' | 'Recusado'>('Todos');

  const [adocoes, setAdocoes] = useState<SolicitacaoAdocao[]>([
    {
      id: '1',
      nomeAnimal: 'Bolinha',
      tipoAnimal: 'Cachorro',
      rgAnimal: 'AN-9821',
      nomeAdotante: 'Ana Souza',
      rgAdotante: '12.345.678-9',
      dataSolicitacao: '15/05/2026',
      status: 'Pendente',
      statusAnimal: 'No canil',
      adotouAntes: true,
      qtdAdotouAntes: 1,
      temOutrosPets: false,
      temCriancas: true,
      qtdCriancas: 2,
      familiaTamanho: 4,
      rendaFamiliar: 2500.5,
      motivo: 'Quero um companheiro para minha filha brincar.',
    },
    {
      id: '2',
      nomeAnimal: 'Rex',
      tipoAnimal: 'Cachorro',
      rgAnimal: 'AN-1045',
      nomeAdotante: 'Carlos Mendes',
      rgAdotante: '98.765.432-1',
      dataSolicitacao: '16/05/2026',
      status: 'Aprovado',
      statusAnimal: 'Em passeio',
      adotouAntes: false,
      qtdAdotouAntes: 0,
      temOutrosPets: true,
      temCriancas: false,
      qtdCriancas: 0,
      familiaTamanho: 2,
      rendaFamiliar: 4200,
      motivo: 'Temos espaço no quintal e queremos um cão ativo.',
    },
    {
      id: '3',
      nomeAnimal: 'Mimi',
      tipoAnimal: 'Gato',
      rgAnimal: 'AN-2033',
      nomeAdotante: 'Fernanda Lima',
      rgAdotante: '45.123.987-X',
      dataSolicitacao: '17/05/2026',
      status: 'Pendente',
      statusAnimal: 'No canil',
      adotouAntes: true,
      qtdAdotouAntes: 2,
      temOutrosPets: true,
      temCriancas: false,
      qtdCriancas: 0,
      familiaTamanho: 1,
      rendaFamiliar: 3100,
      motivo: 'Tenho experiência com felinos e apartamento telado.',
    },
    {
      id: '4',
      nomeAnimal: 'Thor',
      tipoAnimal: 'Cachorro',
      rgAnimal: 'AN-5512',
      nomeAdotante: 'Roberto Alves',
      rgAdotante: '33.444.555-2',
      dataSolicitacao: '18/05/2026',
      status: 'Recusado',
      statusAnimal: 'Em clínica',
      adotouAntes: false,
      qtdAdotouAntes: 0,
      temOutrosPets: false,
      temCriancas: true,
      qtdCriancas: 3,
      familiaTamanho: 5,
      rendaFamiliar: 1500,
      motivo: 'Quero para ser cão de guarda e ficar na corrente no quintal.',
    },
    {
      id: '5',
      nomeAnimal: 'Luna',
      tipoAnimal: 'Gato',
      rgAnimal: 'AN-8890',
      nomeAdotante: 'Beatriz Costa',
      rgAdotante: '55.666.777-8',
      dataSolicitacao: '19/05/2026',
      status: 'Pendente',
      statusAnimal: 'No canil',
      adotouAntes: false,
      qtdAdotouAntes: 0,
      temOutrosPets: false,
      temCriancas: true,
      qtdCriancas: 1,
      familiaTamanho: 3,
      rendaFamiliar: 2800,
      motivo: 'Minha filha pediu muito um gatinho de aniversário.',
    },
  ]);

  const handleAction = (id: string, status: 'Pendente' | 'Aprovado' | 'Recusado') => {
    setAdocoes((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setSelected(null);
  };

  const adocoesFiltradas = adocoes.filter((sol) =>
    filtroAtual === 'Todos' ? true : sol.status === filtroAtual
  );

  const getStatusClass = (status: SolicitacaoAdocao['status']) => {
    if (status === 'Aprovado') return styles.aprovado;
    if (status === 'Pendente') return styles.pendente;
    return styles.recusado;
  };

  return (
    <Layout>
      <div className={styles.adocaoContainer}>
        <Titulo titulo="Requisições de Adoção" />

        <div className={styles.barraFiltros}>
          <button
            className={`${styles.btnFiltro} ${filtroAtual === 'Todos' ? styles.ativo : ''}`}
            onClick={() => setFiltroAtual('Todos')}
          >
            Todos
          </button>

          <button
            className={`${styles.btnFiltro} ${
              filtroAtual === 'Pendente' ? `${styles.ativo} ${styles.pendente}` : ''
            }`}
            onClick={() => setFiltroAtual('Pendente')}
          >
            Pendentes
          </button>

          <button
            className={`${styles.btnFiltro} ${
              filtroAtual === 'Aprovado' ? `${styles.ativo} ${styles.aprovado}` : ''
            }`}
            onClick={() => setFiltroAtual('Aprovado')}
          >
            Aprovados
          </button>

          <button
            className={`${styles.btnFiltro} ${
              filtroAtual === 'Recusado' ? `${styles.ativo} ${styles.recusado}` : ''
            }`}
            onClick={() => setFiltroAtual('Recusado')}
          >
            Recusados
          </button>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <span>ID</span>
            <span>Adotante</span>
            <span>RG Adotante</span>
            <span>Animal Solicitado</span>
            <span>RG Animal</span>
            <span>Data</span>
            <span>Status</span>
            <span>Ações</span>
          </div>

          {adocoesFiltradas.length > 0 ? (
            adocoesFiltradas.map((sol) => (
              <div className={styles.tableRow} key={sol.id}>
                <span>{sol.id}</span>
                <span>{sol.nomeAdotante}</span>
                <span>{sol.rgAdotante}</span>
                <span>
                  {sol.nomeAnimal} ({sol.tipoAnimal})
                </span>
                <span className={styles.animalId}>{sol.rgAnimal}</span>
                <span>{sol.dataSolicitacao}</span>

                <span className={`${styles.status} ${getStatusClass(sol.status)}`}>
                  {sol.status}
                </span>

                <button className={styles.btnDetalhes} onClick={() => setSelected(sol)}>
                  Detalhes
                </button>
              </div>
            ))
          ) : (
            <div className={styles.mensagemVazia}>
              <p>Nenhuma solicitação encontrada para este status.</p>
            </div>
          )}
        </div>

        {selected && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
              <h2>Detalhes da Adoção</h2>

              <div className={styles.modalGrid}>
                <div className={styles.infoBox}>
                  <strong>Adotante:</strong> {selected.nomeAdotante}
                </div>
                <div className={styles.infoBox}>
                  <strong>RG Adotante:</strong> {selected.rgAdotante}
                </div>
                <div className={styles.infoBox}>
                  <strong>Animal:</strong> {selected.nomeAnimal} ({selected.tipoAnimal})
                </div>
                <div className={styles.infoBox}>
                  <strong>RG Animal:</strong> {selected.rgAnimal}
                </div>
                <div className={styles.infoBox}>
                  <strong>Data da Solicitação:</strong> {selected.dataSolicitacao}
                </div>
                <div className={styles.infoBox}>
                  <strong>Status Adoção:</strong> {selected.status}
                </div>
                <div className={styles.infoBox}>
                  <strong>Status Animal:</strong> {selected.statusAnimal}
                </div>
                <div className={styles.infoBox}>
                  <strong>Já adotou?:</strong>{' '}
                  {selected.adotouAntes ? `Sim (Qtd: ${selected.qtdAdotouAntes})` : 'Não'}
                </div>
                <div className={styles.infoBox}>
                  <strong>Outros Pets?:</strong> {selected.temOutrosPets ? 'Sim' : 'Não'}
                </div>
                <div className={styles.infoBox}>
                  <strong>Crianças em casa?:</strong>{' '}
                  {selected.temCriancas ? `Sim (Qtd: ${selected.qtdCriancas})` : 'Não'}
                </div>
                <div className={styles.infoBox}>
                  <strong>Pessoas na família:</strong> {selected.familiaTamanho}
                </div>
                <div className={styles.infoBox}>
                  <strong>Renda familiar:</strong> R$ {selected.rendaFamiliar.toFixed(2)}
                </div>
                <div className={`${styles.infoBox} ${styles.full}`}>
                  <strong>Motivo da Adoção:</strong> {selected.motivo}
                </div>
              </div>

              <div className={styles.modalButtons}>
                <button className={styles.btnFechar} onClick={() => setSelected(null)}>
                  Fechar
                </button>
                <button className={styles.btnPendente} onClick={() => handleAction(selected.id, 'Pendente')}>
                  Pendente
                </button>
                <button className={styles.btnAceitar} onClick={() => handleAction(selected.id, 'Aprovado')}>
                  Aprovar
                </button>
                <button className={styles.btnRecusar} onClick={() => handleAction(selected.id, 'Recusado')}>
                  Reprovar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}