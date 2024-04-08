import {
  useDeleteJournal,
  useUpdateJournal,
} from "@/libs/smart-contracts/journal-contract";
import { JournalContractImplV1 } from "@/typechain-types";
import { ComponentType, RefObject, useRef } from "react";
import JournalForm, { JournalFormProps } from "./journal-form";

const JournalView: ComponentType<{
  id: number;
  journal: JournalContractImplV1.JournalStructOutput;
}> = ({ id, journal }) => {
  const updateModalRef: RefObject<HTMLDialogElement> = useRef(null);
  const detailModalRef: RefObject<HTMLDialogElement> = useRef(null);

  const { deleteJournal, isLoading: isDeleting } = useDeleteJournal();
  const { updateJournal, isLoading: isUpdating } = useUpdateJournal();
  const isLoading = isDeleting || isUpdating;

  const onView = () => detailModalRef.current?.showModal();

  const onEdit = () => updateModalRef.current?.showModal();
  const onEditCancel = () => updateModalRef.current?.close();
  const onUpdateSubmitted: JournalFormProps["onSubmit"] = async (data) => {
    await updateJournal({ ...data, id });
  };

  const onDelete = async () => {
    if (!confirm("You sure?")) {
      return;
    }

    await deleteJournal({ id });
  };

  return (
    <>
      <div className="card w-full rounded-xl border border-neutral-50/50">
        <div className="card-body flex flex-row justify-between gap-4">
          <section>
            <h3 className="text-lg font-semibold">
              {journal.title} @ {journal.createdAt.toString()}
            </h3>

            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {journal.body}
            </div>
          </section>

          <section className="flex justify-end gap-4">
            <button disabled={isLoading} onClick={onView} className="btn">
              {isLoading && <span className="loading loading-spinner" />}
              View
            </button>
            <dialog ref={detailModalRef} className="modal">
              <div className="modal-box">
                <h2 className="text-xl font-semibold">{journal.title}</h2>

                <div className="whitespace-pre-wrap py-4">{journal.body}</div>

                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>

            <button
              disabled={isLoading}
              onClick={onEdit}
              className="btn btn-outline"
            >
              {isLoading && <span className="loading loading-spinner" />}
              Update
            </button>
            <dialog ref={updateModalRef} className="modal">
              <div className="modal-box">
                <h2 className="text-xl font-semibold">New Journal</h2>

                <div className="py-4">
                  <JournalForm
                    onCancel={onEditCancel}
                    onSubmit={onUpdateSubmitted}
                    isLoading={isLoading}
                    defaultValues={journal}
                  />
                </div>
              </div>
            </dialog>

            <button
              disabled={isLoading}
              onClick={onDelete}
              className="btn btn-outline btn-error"
            >
              {isLoading && <span className="loading loading-spinner" />}
              Delete
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default JournalView;
