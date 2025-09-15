import Modal from "@/components/modal";
import { t } from "i18next";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  selected?: string;
}

const ViewModal = ({ isOpen, onClose, title, selected}: ViewModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="xl"
  >
  {/* Modal Content */}
  <div className="card bg-base-100 shadow-sm mt-6">
    <div className="card lg:card-side bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-around">  

        <fieldset className="fieldset w-70">
          <legend className="fieldset-legend">{t('Team')}</legend>
          <input type="text" placeholder="Type here" className="input input-neutral" value={selected ?? ''} disabled/>
        </fieldset>
      </div>
      </div>
    </div>
  </div>

  <div className="modal-action mt-6">
    <form method="dialog">
      {/* Modal Footer */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
          onClick={onClose}
        >
          {t("Cancel")}
        </button>
      </div>
    </form>
  </div>

  </Modal>
);

export default ViewModal;
