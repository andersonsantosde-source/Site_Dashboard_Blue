import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'bluepay_admin_2026';
const STORAGE_KEY = 'bluepay-admin-auth';

const uploadEndpoints = {
  sellers: '/api/upload/sellers',
  sales: '/api/upload/sales',
  commissions: '/api/upload/commissions',
} as const;

type UploadType = keyof typeof uploadEndpoints;

type UploadState = Record<UploadType, File | null>;

type UploadResult = Record<UploadType, string>;

function formatStatusMessage(type: UploadType, success: boolean, rows: number | null, message?: string) {
  if (success) {
    return `Arquivo ${type} enviado com sucesso (${rows ?? 0} linhas).`;
  }
  return `Erro ao enviar ${type}: ${message ?? 'Falha na requisição.'}`;
}

export default function AdminUpload() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadState>({
    sellers: null,
    sales: null,
    commissions: null,
  });
  const [results, setResults] = useState<UploadResult>({
    sellers: '',
    sales: '',
    commissions: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem(STORAGE_KEY);
    setAuthenticated(auth === ADMIN_PASSWORD);
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, ADMIN_PASSWORD);
      setAuthenticated(true);
      setMessage('Autenticado com sucesso.');
      setPassword('');
    } else {
      setMessage('Senha incorreta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
    setMessage('Sessão encerrada.');
  };

  const handleFileChange = (type: UploadType, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
    setResults((prev) => ({ ...prev, [type]: '' }));
  };

  const uploadFile = async (type: UploadType) => {
    const file = files[type];
    if (!file) {
      setResults((prev) => ({ ...prev, [type]: 'Selecione um arquivo CSV antes de enviar.' }));
      return;
    }

    setUploading(true);
    setResults((prev) => ({ ...prev, [type]: 'Enviando...' }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadEndpoints[type], {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const errorMessage = payload?.detail || response.statusText;
        setResults((prev) => ({ ...prev, [type]: formatStatusMessage(type, false, null, errorMessage) }));
        return;
      }

      const payload = await response.json();
      setResults((prev) => ({ ...prev, [type]: formatStatusMessage(type, true, payload.rows ?? null) }));
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Erro ao enviar dados.';
      setResults((prev) => ({ ...prev, [type]: formatStatusMessage(type, false, null, messageText) }));
    } finally {
      setUploading(false);
    }
  };

  const instructions = useMemo(
    () => [
      {
        title: 'Vendedores',
        type: 'sellers' as UploadType,
        fields: [
          'id',
          'code',
          'name',
          'region',
          'email',
          'phone',
          'joinDate',
          'status',
        ],
      },
      {
        title: 'Vendas',
        type: 'sales' as UploadType,
        fields: [
          'sellerId',
          'month',
          'budget',
          'forecast',
          'actual',
          'deals',
          'avgTicket',
          'conversionRate',
          'pipelineValue',
        ],
      },
      {
        title: 'Comissões',
        type: 'commissions' as UploadType,
        fields: [
          'sellerId',
          'month',
          'baseCommission',
          'bonusCommission',
          'totalCommission',
          'attainmentRate',
          'tier',
          'nextTierThreshold',
          'nextTierValue',
          'nextTierGap',
        ],
      },
    ],
    []
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl bg-slate-900/95 border border-slate-700 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Acesso de administrador</h1>
              <p className="text-sm text-slate-400">Informe a senha para ver a interface de upload de CSV.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-slate-300 text-sm font-medium">Senha do administrador</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleLogin} disabled={!password || uploading}>
                Entrar
              </Button>
              <span className="text-sm text-slate-400">Senha padrão definida em <code className="rounded bg-slate-800 px-1 py-0.5">VITE_ADMIN_PASSWORD</code>.</span>
            </div>
          </div>

          {message ? <p className="mt-4 text-sm text-rose-400">{message}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel de Upload de CSV</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Faça upload dos arquivos de vendedores, vendas e comissões para atualizar os dados do dashboard.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sair do admin
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {instructions.map((item) => (
            <section key={item.type} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-sm text-slate-400">Formato CSV esperado</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Arquivo CSV</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(event) => handleFileChange(item.type, event.target.files?.[0] ?? null)}
                  className="w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-100"
                />
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Colunas:</p>
                  <p className="text-sm text-slate-300">{item.fields.join(', ')}</p>
                </div>
                <Button onClick={() => uploadFile(item.type)} disabled={uploading}>
                  Enviar {item.title}
                </Button>
                {results[item.type] ? (
                  <p className="text-sm text-slate-300">{results[item.type]}</p>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="text-lg font-semibold mb-3">Importante</h3>
          <ul className="list-disc space-y-2 pl-5 text-slate-400">
            <li>Os arquivos devem ser CSV válidos e conter cabeçalhos.</li>
            <li>Os uploads são salvos em <code className="rounded bg-slate-800 px-1 py-0.5">backend/data/</code>.</li>
            <li>Use este painel apenas com a conta de administrador.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
