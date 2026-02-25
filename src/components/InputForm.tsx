import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DateInput } from '../types/age.types';
import { validateDateInput, calculateAge } from '../utils/calculateAge';
import { getHistoricalEvents } from '../services/api';
import { translateToId } from '../services/translate';
import useAgeStore from '../store/useAgeStore';

function InputForm() {
  const [input, setInput] = useState<DateInput>({ day: 0, month: 0, year: 0 });
  const [error, setError] = useState<string | null>(null);

  const { setResult, setHistoricalFacts, setLoading, setError: setStoreError } = useAgeStore();

  const handleChange = (field: keyof DateInput, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setInput((prev) => ({ ...prev, [field]: numValue }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    const validationError = validateDateInput(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Hitung umur
    const ageResult = calculateAge(input);
    setResult(ageResult);

    // Fetch fakta sejarah + terjemahkan ke Indonesia
    setLoading(true);
    setStoreError(null);
    try {
      const data = await getHistoricalEvents(input.month, input.day);
      const topEvents = data.events.slice(0, 5);

      // Terjemahkan semua fakta secara paralel
      const translatedEvents = await Promise.all(
        topEvents.map(async (event: { text: string; year: number; pages: unknown[] }) => ({
          ...event,
          text: await translateToId(event.text),
        }))
      );

      setHistoricalFacts(translatedEvents);
    } catch {
      setStoreError('Gagal mengambil fakta sejarah');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    'w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-2xl font-bold text-white placeholder:text-white/30 outline-none transition-all focus:border-pink-400 focus:bg-white/20 focus:ring-2 focus:ring-pink-400/30';

  const labelStyle = 'block text-xs font-semibold uppercase tracking-widest text-white/50 mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {/* Day */}
        <div>
          <label htmlFor="day" className={labelStyle}>
            Day
          </label>
          <input
            id="day"
            type="number"
            placeholder="DD"
            min={1}
            max={31}
            value={input.day || ''}
            onChange={(e) => handleChange('day', e.target.value)}
            className={inputStyle}
          />
        </div>

        {/* Month */}
        <div>
          <label htmlFor="month" className={labelStyle}>
            Month
          </label>
          <input
            id="month"
            type="number"
            placeholder="MM"
            min={1}
            max={12}
            value={input.month || ''}
            onChange={(e) => handleChange('month', e.target.value)}
            className={inputStyle}
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className={labelStyle}>
            Year
          </label>
          <input
            id="year"
            type="number"
            placeholder="YYYY"
            min={1900}
            max={new Date().getFullYear()}
            value={input.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300">
          {error}
        </p>
      )}

      {/* Submit button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(236, 72, 153, 0.4)' }}
        whileTap={{ scale: 0.96 }}
        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 px-6 text-base font-semibold text-white shadow-lg shadow-pink-500/25 transition-colors hover:from-pink-600 hover:to-purple-700"
      >
        Hitung Umur
      </motion.button>
    </form>
  );
}

export default InputForm;
