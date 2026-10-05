'use client';

import React, { useState } from 'react';
import Layout from "@/components/Layout/Layout";
import './solicitacoes-eventos.css';
import Titulo from "@/components/UI/Titulo/Titulo";

interface Solicitacao {
  id: string;
  animal: string;
  solicitante: string;
  tipo: 'Passeio' | 'Hospedagem';
  dataInicio: string;
  dataFim: string;
  status: 'Pendente' | 'Aprovado' | 'Recusado';
  telefone: string;
  email: string;
  cpf: string;
  endereco: string;
  enderecoEvento: string;
  horarioSaida: string;
  horarioVolta?: string;
  observacoesLocal: string;
}

interface EventoSelecionado {
  evento: Solicitacao;
  dataSelecionada: string;
}

const mockSolicitacoes: Solicitacao[] = [
  { 
    id: '1', animal: 'Rex', solicitante: 'João Silva', tipo: 'Passeio', 
    dataInicio: '2026-06-05', dataFim: '2026-06-05', status: 'Pendente',
    telefone: '(15) 99999-1111', email: 'joao.silva@email.com', cpf: '111.222.333-44',
    endereco: 'Rua das Flores, 123 - Centro, Votorantim - SP',
    enderecoEvento: 'Parque do Campolim - Av. Antônio Carlos Comitre, Sorocaba - SP',
    horarioSaida: '14:00',
    horarioVolta: '16:30',
    observacoesLocal: 'Pretendo levar o Rex para passear no Parque do Campolim durante a tarde.'
  },
  { 
    id: '2', animal: 'Max', solicitante: 'Maria Souza', tipo: 'Hospedagem', 
    dataInicio: '2026-06-10', dataFim: '2026-06-20', status: 'Pendente',
    telefone: '(15) 98888-2222', email: 'maria.souza@email.com', cpf: '555.666.777-88',
    endereco: 'Av. São João, 456 - Jd. Icatu, Votorantim - SP',
    enderecoEvento: 'Chácara da Maria - Estrada do Capoavinha, S/N - Votorantim - SP',
    horarioSaida: '09:00',
    horarioVolta: '18:00',
    observacoesLocal: 'A Luna ficará hospedada na minha chácara durante o período combinado.'
  },
  { 
    id: '3', animal: 'Thor', solicitante: 'Carlos', tipo: 'Passeio', 
    dataInicio: '2026-06-02', dataFim: '2026-06-02', status: 'Aprovado',
    telefone: '(15) 97777-3333', email: 'carlos@email.com', cpf: '999.888.777-66',
    endereco: 'Rua Nova, 89 - Vl. Dominguinho',
    enderecoEvento: 'Praça principal do bairro Vila Dominguinho - Votorantim - SP',
    horarioSaida: '15:00',
    horarioVolta: '16:00',
    observacoesLocal: 'Passeio rápido pela praça principal do bairro.'
  },
  { 
    id: '4', animal: 'Luna', solicitante: 'Maria Souza', tipo: 'Hospedagem', 
    dataInicio: '2026-06-10', dataFim: '2026-06-15', status: 'Aprovado',
    telefone: '(15) 98888-2222', email: 'maria.souza@email.com', cpf: '555.666.777-88',
    endereco: 'Av. São João, 456 - Jd. Icatu, Votorantim - SP',
    enderecoEvento: 'Chácara da Maria - Estrada do Capoavinha, S/N - Votorantim - SP',
    horarioSaida: '09:00',
    horarioVolta: '18:00',
    observacoesLocal: 'Hospedagem por alguns dias. A retirada será feita apenas no último dia combinado.'
  },
];

const formatarData = (data: string) => data.split('-').reverse().join('/');

function ModalDetalhesEvento({ selecionado, onClose }: { selecionado: EventoSelecionado; onClose: () => void }) {
  const { evento, dataSelecionada } = selecionado;
  const ehHospedagem = evento.tipo === 'Hospedagem';
  const ehDiaInicio = dataSelecionada === evento.dataInicio;
  const ehDiaFim = dataSelecionada === evento.dataFim;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card-evento" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-evento">
          <div>
            <h2>Detalhes do Evento</h2>
            <span className={`modal-tipo-badge ${evento.tipo.toLowerCase()}`}>{evento.tipo}</span>
          </div>
          <button className="modal-fechar-x" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className="modal-info-grid">
          <div className="modal-info-item"><strong>Animal:</strong> {evento.animal}</div>
          <div className="modal-info-item"><strong>Responsável:</strong> {evento.solicitante}</div>
          <div className="modal-info-item"><strong>Data selecionada:</strong> {formatarData(dataSelecionada)}</div>
          <div className="modal-info-item"><strong>Período:</strong> {formatarData(evento.dataInicio)} até {formatarData(evento.dataFim)}</div>
        </div>

        <div className="modal-section">
          <h3>{ehHospedagem ? 'Local da Hospedagem' : 'Local/Endereço do Passeio'}</h3>
          <p>{evento.enderecoEvento}</p>
        </div>

        <div className="modal-info-grid">
          {ehHospedagem ? (
            <>
              {ehDiaInicio && (
                <div className="modal-info-item destaque"><strong>Entrada do animal:</strong> {evento.horarioSaida}</div>
              )}
              {ehDiaFim && (
                <div className="modal-info-item destaque"><strong>Retirada/volta do animal:</strong> {evento.horarioVolta}</div>
              )}
              {!ehDiaInicio && !ehDiaFim && (
                <div className="modal-info-item destaque"><strong>Status no dia:</strong> Animal em hospedagem</div>
              )}
            </>
          ) : (
            <>
              <div className="modal-info-item destaque"><strong>Horário de saída:</strong> {evento.horarioSaida}</div>
              <div className="modal-info-item destaque"><strong>Horário de volta:</strong> {evento.horarioVolta}</div>
            </>
          )}
        </div>

        <div className="modal-section">
          <h3>Observações</h3>
          <p>{evento.observacoesLocal}</p>
        </div>

        <div className="modal-section contato">
          <h3>Contato do responsável</h3>
          <p><strong>Telefone:</strong> {evento.telefone}</p>
          <p><strong>Email:</strong> {evento.email}</p>
          <p><strong>Endereço do responsável:</strong> {evento.endereco}</p>
        </div>

        <div className="modal-acoes">
          <button className="btn-fechar-modal" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default function SolicitacoesSimples() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(mockSolicitacoes);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [detalhesAbertos, setDetalhesAbertos] = useState<string | null>(null);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoSelecionado | null>(null);

  const aceitarSolicitacao = (id: string) => {
    setSolicitacoes(prev => prev.map(sol => sol.id === id ? { ...sol, status: 'Aprovado' } : sol));
    setDetalhesAbertos(null);
  };

  const recusarSolicitacao = (id: string) => {
    setSolicitacoes(prev => prev.map(sol => sol.id === id ? { ...sol, status: 'Recusado' } : sol));
    setDetalhesAbertos(null);
  };

  const toggleDetalhes = (id: string) => setDetalhesAbertos(prev => prev === id ? null : id);
  const mesAnterior = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const proximoMes = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month] = e.target.value.split('-');
    if (year && month) setCurrentDate(new Date(Number(year), Number(month) - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const diasNoMes = new Date(year, month + 1, 0).getDate();
  const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1);
  const inputMonthValue = `${year}-${String(month + 1).padStart(2, '0')}`;

  const getDataFormatadaDoDia = (dia: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

  const getEventosAprovadosDoDia = (dia: number) => {
    const dataFormatada = getDataFormatadaDoDia(dia);
    return solicitacoes.filter(sol => sol.status === 'Aprovado' && sol.dataInicio <= dataFormatada && sol.dataFim >= dataFormatada);
  };

  const pendentes = solicitacoes.filter(sol => sol.status === 'Pendente');

  return (
    <Layout>
      <Titulo titulo="Gestão de Solicitações" descricao="Gerencie passeios e 
      hospedagens solicitadas." />
      
      <div className="eventos-content">
        <section className="eventos-lista-section">
          <h2>Requisições Pendentes</h2>
          
          {pendentes.length === 0 ? (
            <p className="sem-pendencias">Nenhuma solicitação pendente no momento.</p>
          ) : (
            <div className="lista-cards">
              {pendentes.map(sol => (
                <div key={sol.id} className="card-solicitacao">
                  <div className="card-info">
                    <strong>Animal:</strong> {sol.animal} <br/>
                    <strong>Solicitante:</strong> {sol.solicitante} <br/>
                    <strong>Tipo:</strong> {sol.tipo} <br/>
                    <strong>Período:</strong> {formatarData(sol.dataInicio)} 
                    {sol.dataInicio !== sol.dataFim && ` até ${formatarData(sol.dataFim)}`}
                  </div>
                  
                  {detalhesAbertos === sol.id && (
                    <div className="card-detalhes">
                      <div className="detalhes-grid">
                        <p><strong>Telefone:</strong> {sol.telefone}</p>
                        <p><strong>Email:</strong> {sol.email}</p>
                        <p><strong>CPF:</strong> {sol.cpf}</p>
                      </div>
                      <p className="detalhe-linha"><strong>Endereço do Solicitante:</strong> {sol.endereco}</p>
                      <hr className="divisor-detalhes" />
                      <p className="detalhe-linha"><strong>{sol.tipo === 'Passeio' ? 'Local/Trajeto do Passeio:' : 'Local da Hospedagem:'}</strong><br/>{sol.enderecoEvento}</p>
                      <p className="detalhe-linha"><strong>Horário de saída/entrada:</strong> {sol.horarioSaida}</p>
                      {sol.tipo === 'Passeio' && <p className="detalhe-linha"><strong>Horário de volta:</strong> {sol.horarioVolta}</p>}
                      {sol.tipo === 'Hospedagem' && <p className="detalhe-linha"><strong>Retirada no último dia:</strong> {sol.horarioVolta}</p>}
                    </div>
                  )}

                  <div className="card-acoes">
                    <button className="btn-detalhes" onClick={() => toggleDetalhes(sol.id)}>
                      {detalhesAbertos === sol.id ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                    </button>
                    <div className="acoes-principais">
                      <button className="btn-aceitar" onClick={() => aceitarSolicitacao(sol.id)}>Aceitar</button>
                      <button className="btn-recusar" onClick={() => recusarSolicitacao(sol.id)}>Recusar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="eventos-calendario-section">
          <div className="calendario-header">
            <button className="btn-nav-mes" onClick={mesAnterior} title="Mês Anterior">&#10094;</button>
            <div className="calendario-input-wrapper">
              <input type="month" className="calendario-input-mes" value={inputMonthValue} onChange={handleMonthChange} />
            </div>
            <button className="btn-nav-mes" onClick={proximoMes} title="Próximo Mês">&#10095;</button>
          </div>

          <div className="calendario-grid">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, idx) => <div key={idx} className="dia-semana-label">{dia}</div>)}
            {diasArray.map((dia) => {
              const eventosDia = getEventosAprovadosDoDia(dia);
              const dataSelecionada = getDataFormatadaDoDia(dia);
              return (
                <div key={dia} className={`calendario-dia ${eventosDia.length > 0 ? 'dia-ocupado' : ''}`}>
                  <span className="dia-numero">{dia}</span>
                  <div className="dia-eventos">
                    {eventosDia.map((ev) => (
                      <button
                        key={ev.id}
                        type="button"
                        className={`evento-badge evento-botao ${ev.tipo.toLowerCase()}`}
                        onClick={() => setEventoSelecionado({ evento: ev, dataSelecionada })}
                        title="Clique para ver os detalhes"
                      >
                        {ev.animal} ({ev.tipo})
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {eventoSelecionado && (
        <ModalDetalhesEvento selecionado={eventoSelecionado} onClose={() => setEventoSelecionado(null)} />
      )}
    </Layout>
  );
}
