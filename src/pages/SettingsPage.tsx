// pages/SettingsPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button } from "../components/ui/button";
import { Trash2, RefreshCw, LogOut } from 'lucide-react';
import { PageTransition } from '../components/common/AnimatedComponents';

const SettingsPage = () => {
  const { resetDailyCounters, tasks, counters } = useApp();

  return (
    <PageTransition>
      <div className="pb-20 pt-16">
        <h1 className="text-2xl font-bold mb-6">Impostazioni</h1>

        {/* Statistiche generali */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Statistiche</h2>
          <div className="space-y-2">
            <p>Impegni totali: {tasks.length}</p>
            <p>Contatori attivi: {counters.length}</p>
          </div>
        </div>

        {/* Azioni */}
        <div className="space-y-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <Button
              variant="ghost"
              className="w-full p-4 flex items-center justify-between text-left"
              onClick={resetDailyCounters}
            >
              <div>
                <p className="font-medium">Reset Contatori Giornalieri</p>
                <p className="text-sm text-gray-500">
                  Azzera tutti i contatori giornalieri
                </p>
              </div>
              <RefreshCw className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <Button
              variant="ghost"
              className="w-full p-4 flex items-center justify-between text-left text-red-600"
            >
              <div>
                <p className="font-medium">Elimina tutti i dati</p>
                <p className="text-sm text-red-400">
                  Rimuovi tutti gli impegni e i contatori
                </p>
              </div>
              <Trash2 className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <Button
              variant="ghost"
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div>
                <p className="font-medium">Esci</p>
                <p className="text-sm text-gray-500">
                  Disconnetti questo account
                </p>
              </div>
              <LogOut className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>MyRoutine v1.0.0</p>
          <p className="mt-1">Sviluppato con ❤️</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default SettingsPage;