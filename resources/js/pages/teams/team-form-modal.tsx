import Modal from "@/components/modal";
import { t } from "i18next";

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: { name: string };
  setData: (key: "name", value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  mode: "create" | "edit";
  selectedTeam?: { id: number; name: string } | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TeamFormModal = ({isOpen, onClose, onSubmit, data, setData, errors, processing, mode, selectedTeam, handleChange}: TeamFormModalProps) => (
  <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? t("Create Team") : t("Edit Team")}
      size="xl"
    >
      <form
        method="dialog"
        className="mt-4 space-y-4"
        onSubmit={onSubmit}
      >
        {/* Team Name Field */}
        <div className="card bg-base-100 shadow-sm mt-6">
          <div className="card lg:card-side bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex justify-around">
                <div className="w-70">
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    {t("Team")}
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        value={mode === "create" ? data.name : selectedTeam?.name ?? ""}
                        onChange={(e) =>
                          mode === "create"
                            ? setData("name", e.target.value)
                            : handleChange(e)
                        }
                      />
                    </div>
                    {errors["name"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["name"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-orange-400 cursor-pointer ${
              processing ? "cursor-none! bg-indigo-300! hover:bg-indigo-400!" : ""
            }`}
            disabled={processing}
          >
            {processing && (
              <span className="loading loading-spinner loading-xs mr-2"></span>
            )}
            {t("Save Changes")}
          </button>
        </div>
      </form>
    </Modal>
);

export default TeamFormModal;
