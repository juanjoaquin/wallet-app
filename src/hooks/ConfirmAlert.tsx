interface ConfirmAlertProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 bg-opacity-50 z-50 px-2">
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-sm w-full border border-indigo-500">
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-indigo-700 font-semibold text-white rounded-lg">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
