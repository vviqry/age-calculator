import { motion } from 'framer-motion';
import InputForm from '../components/InputForm';
import ResultCard from '../components/ResultCard';
import HistoryFact from '../components/HistoryFact';
import useAgeStore from '../store/useAgeStore';

function Home() {
  const { result } = useAgeStore();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed px-4 py-12 md:py-20"
      style={{ backgroundImage: "url('https://wallpapers.com/images/featured-full/digital-art-background-98hwar6swibxmlqv.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/30 -z-10" />

      {/* Main Card — glassmorphism with entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl md:p-10"
      >
        <h1 className="mb-2 text-2xl font-bold text-white text-shadow md:text-3xl">
          Age Calculator
        </h1>
        <p className="mb-8 text-sm text-white/60 text-shadow-sm">
          Masukkan tanggal lahirmu untuk menghitung umur dan temukan fakta sejarah di tanggal tersebut.
        </p>

        {/* Form Input */}
        <InputForm />

        {/* Divider + Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <hr className="my-8 border-white/10" />
            <ResultCard />
          </motion.div>
        )}
      </motion.div>

      {/* History Facts */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl md:p-10"
        >
          <HistoryFact />
        </motion.div>
      )}
    </div>
  );
}

export default Home;
