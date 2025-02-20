import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export default function AlertErro({
  message,
  onClose,
  open,
}: {
  message: string;
  onClose: () => void;
  open: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-red-600 my-5 text-gray-50 p-3 rounded-lg flex items-start justify-between shadow-md"
        >
          <p className="grid grid-cols-[20px_1fr] items-center gap-2 text-base">
            <FaTriangleExclamation className="text-xl" />
            {message}
          </p>
          <button
            onClick={onClose}
            type="button"
            title="fechar alerta"
            className="ml-5"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
