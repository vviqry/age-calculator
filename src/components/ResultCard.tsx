import { motion } from 'framer-motion';
import useAgeStore from '../store/useAgeStore';

function ResultCard() {
  const { result } = useAgeStore();

  if (!result) return null;

  const items = [
    { value: result.years, singular: 'tahun', plural: 'tahun' },
    { value: result.months, singular: 'bulan', plural: 'bulan' },
    { value: result.days, singular: 'hari', plural: 'hari' },
  ];

  return (
    <div className="space-y-2 py-4">
      {items.map((item, index) => (
        <motion.p
          key={item.singular}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15, ease: 'easeOut' }}
          className="text-4xl font-extrabold leading-snug text-white text-shadow md:text-5xl"
        >
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {item.value}
          </span>{' '}
          {item.value === 1 ? item.singular : item.plural}
        </motion.p>
      ))}
    </div>
  );
}

export default ResultCard;
