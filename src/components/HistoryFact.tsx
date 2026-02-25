import { motion } from 'framer-motion';
import useAgeStore from '../store/useAgeStore';

function HistoryFact() {
  const { historicalFacts, isLoading, error } = useAgeStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-4 border-white/20 border-t-pink-400"
        />
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
        {error}
      </p>
    );
  }

  if (historicalFacts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white text-shadow">
        Peristiwa di Tanggal Ini
      </h2>

      <div className="space-y-3">
        {historicalFacts.map((fact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-pink-400/30"
          >
            <span className="mr-2 inline-block rounded-lg bg-pink-500/20 px-2 py-1 text-xs font-bold text-pink-300">
              {fact.year}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-white/70 text-shadow-sm">
              {fact.text}
            </p>
            {fact.pages?.[0] && (
              <a
                href={fact.pages[0].content_urls.desktop.page}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-medium text-pink-400 hover:text-pink-300 hover:underline"
              >
                Baca selengkapnya →
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HistoryFact;
