import { useRef } from 'react'
import { CURRENCIES, type Currency } from '../lib/format'

type Props = {
  currency: Currency
  onCurrencyChange: (currency: Currency) => void
  onExport: () => void
  onImport: (file: File) => void
}

export function Header({ currency, onCurrencyChange, onExport, onImport }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Gastos</h1>
        <p className="text-sm text-neutral-500">Tus datos se guardan solo en este navegador.</p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={currency}
          onChange={(event) => onCurrencyChange(event.target.value as Currency)}
          aria-label="Moneda"
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none focus:border-neutral-900"
        >
          {CURRENCIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onExport}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition hover:border-neutral-400"
        >
          Exportar
        </button>

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition hover:border-neutral-400"
        >
          Importar
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onImport(file)
            event.target.value = ''
          }}
        />
      </div>
    </header>
  )
}
