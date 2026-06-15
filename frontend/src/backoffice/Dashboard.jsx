import { Building2, ChevronRight, LayoutDashboard, Map as MapIcon, Recycle, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import useDepositos from "./Deposito/useDepositos.js";
import useEcopontos from "./Ecoponto/useEcopontos.js";
import useEcopontoLogs from "./EcopontoLog/useEcopontoLogs.js";
import useEquipamentos from "./Equipamento/useEquipamentos.js";
import useEmpresas from "./Empresa/useEmpresas.js";

function formatPercentage(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("pt-PT");
}

function getFillPercentage(ecoponto, depositoById) {
  const capacidadeAtual = Number(ecoponto.capacidadeAtual);
  const deposito = depositoById.get(String(ecoponto.depositoId));
  const capacidadeTotal = Number(ecoponto.capacidadeTotal ?? deposito?.capacidadeTotal);

  if (!Number.isFinite(capacidadeAtual) || !Number.isFinite(capacidadeTotal) || capacidadeTotal <= 0) {
    return null;
  }

  return Math.min(100, Math.max(0, (capacidadeAtual / capacidadeTotal) * 100));
}

export default function Dashboard({ onNavigate }) {
  const { authUser } = useAuth();
  const isSuperAdmin = authUser?.cargo === 1;
  const scopeLabel = isSuperAdmin ? "Total absoluto" : "Empresa";
  const { items: ecopontos = [], loading: ecopontosLoading } = useEcopontos();
  const { items: depositos = [] } = useDepositos();
  const { items: logs = [], loading: logsLoading } = useEcopontoLogs();
  const { items: equipamentos = [] } = useEquipamentos();
  const { items: empresas = [], loading: empresasLoading } = useEmpresas();

  const depositoById = useMemo(() =>
    new Map(depositos.map((deposito) => [String(deposito.id), deposito])),
    [depositos]
  );

  const fillPercentages = useMemo(() =>
    ecopontos
      .map((ecoponto) => getFillPercentage(ecoponto, depositoById))
      .filter((value) => value !== null),
    [ecopontos, depositoById]
  );

  const averageFill = useMemo(() => {
    if (fillPercentages.length === 0) return 0;
    return fillPercentages.reduce((total, value) => total + value, 0) / fillPercentages.length;
  }, [fillPercentages]);

  const chartBuckets = useMemo(() => {
    const buckets = [
      { label: "<50%", value: 0 },
      { label: "50% - 70%", value: 0 },
      { label: ">70%", value: 0 },
    ];

    fillPercentages.forEach((percentage) => {
      if (percentage < 50) {
        buckets[0].value += 1;
      } else if (percentage < 70) {
        buckets[1].value += 1;
      } else {
        buckets[2].value += 1;
      }
    });

    return buckets;
  }, [fillPercentages]);

  const maxBucketValue = Math.max(...chartBuckets.map((bucket) => bucket.value), 1);

  const ecopontosByEmpresa = useMemo(() => {
    const empresaNamesById = new Map(empresas.map((empresa) => [String(empresa.id), empresa.nome]));
    const counts = new Map();

    ecopontos.forEach((ecoponto) => {
      const empresaId = String(ecoponto.empresaId ?? "");
      const empresaName = empresaNamesById.get(empresaId) || (empresaId ? `Empresa ${empresaId}` : "Sem empresa");
      counts.set(empresaName, (counts.get(empresaName) || 0) + 1);
    });

    return [...counts.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [ecopontos, empresas]);

  const maxEmpresaBucketValue = Math.max(...ecopontosByEmpresa.map((bucket) => bucket.value), 1);

  const latestLog = useMemo(() => {
    if (isSuperAdmin) return logs[0] || null;

    const ecopontoCodes = new Set(ecopontos.map((ecoponto) => String(ecoponto.codigo)));
    const equipamentoCodes = new Set(equipamentos.map((equipamento) => String(equipamento.codigo)));

    return logs.find((log) =>
      ecopontoCodes.has(String(log.codigoEcoponto)) ||
      equipamentoCodes.has(String(log.codigoEquipamento))
    ) || null;
  }, [ecopontos, equipamentos, isSuperAdmin, logs]);

  const isLoading = ecopontosLoading || logsLoading || empresasLoading;

  return (
    <section className={`dashboard-screen ${isSuperAdmin ? "dashboard-super-admin" : ""}`}>
      <div className="dashboard-heading">
        <div className="dashboard-icon">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h2>Dashboard</h2>
          <span>{scopeLabel}</span>
        </div>
      </div>

      <div className="dashboard-ecopontos-grid">
        <div className="dashboard-metric-card">
          <div className="dashboard-card-icon">
            <Recycle size={20} />
          </div>
          <span>Total de ecopontos</span>
          <strong>{isLoading ? "..." : ecopontos.length}</strong>
        </div>

        <div className="dashboard-metric-card">
          <div className="dashboard-card-icon">
            <TrendingUp size={20} />
          </div>
          <span>Média de enchimento</span>
          <strong>{isLoading ? "..." : formatPercentage(averageFill)}</strong>
        </div>

        <div className="dashboard-chart-panel">
          <div className="dashboard-panel-header">
            <h3>Ecopontos por enchimento</h3>
          </div>
          <div className="dashboard-bar-chart" aria-label="Quantidade de ecopontos por secção de enchimento">
            {chartBuckets.map((bucket) => (
              <div className="dashboard-bar-column" key={bucket.label}>
                <span className="dashboard-bar-value">{bucket.value}</span>
                <div className="dashboard-bar-track">
                  <div
                    className="dashboard-bar-fill"
                    style={{ height: `${Math.max((bucket.value / maxBucketValue) * 100, bucket.value > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <span className="dashboard-bar-label">{bucket.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="dashboard-company-grid">
          <div className="dashboard-metric-card dashboard-company-total-card">
            <div className="dashboard-card-icon">
              <Building2 size={20} />
            </div>
            <span>Total de empresas</span>
            <strong>{isLoading ? "..." : empresas.length}</strong>
          </div>

          <div className="dashboard-chart-panel">
            <div className="dashboard-panel-header">
              <h3>Ecopontos por empresa</h3>
            </div>
            {ecopontosByEmpresa.length > 0 ? (
              <div className="dashboard-company-chart" aria-label="Quantidade de ecopontos por empresa">
                {ecopontosByEmpresa.map((bucket) => (
                  <div className="dashboard-company-row" key={bucket.label}>
                    <span>{bucket.label}</span>
                    <div className="dashboard-company-track">
                      <div
                        className="dashboard-company-fill"
                        style={{ width: `${Math.max((bucket.value / maxEmpresaBucketValue) * 100, bucket.value > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                    <strong>{bucket.value}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="template-muted">Sem ecopontos associados a empresas.</p>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-bottom-row">
        <div className="dashboard-latest-panel">
          <div className="dashboard-panel-header">
            <h3>Última leitura</h3>
          </div>

          {latestLog ? (
            <button
              type="button"
              className="dashboard-log-row"
              onClick={() => onNavigate("ecopontologs")}
            >
              <span>{latestLog.codigoEcoponto || "-"}</span>
              <span>{latestLog.codigoEquipamento || "-"}</span>
              <span>{formatDate(latestLog.data)}</span>
              <span>{latestLog.detalhes || "-"}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <p className="template-muted">Sem leituras registadas.</p>
          )}
        </div>

        <div className="dashboard-map-action-wrap">
          <button type="button" className="bo-btn dashboard-map-btn" onClick={() => onNavigate("map")}>
            <MapIcon size={16} />
            Abrir mapa
          </button>
        </div>
      </div>
    </section>
  );
}
