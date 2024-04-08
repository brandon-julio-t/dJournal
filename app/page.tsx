"use client";

import {
  useCreateJournal,
  useGetMyJournals,
} from "@/libs/smart-contracts/journal-contract";
import { Fragment, RefObject, useRef } from "react";
import JournalForm, { JournalFormProps } from "./components/journal-form";
import JournalView from "./components/journal-view";

const HomePage = () => {
  const { data } = useGetMyJournals();

  const { createJournal, isLoading } = useCreateJournal();

  const modalRef: RefObject<HTMLDialogElement> = useRef(null);

  const onNewJournal = () => modalRef.current?.showModal();

  const onCancelNewJournal = () => modalRef.current?.close();

  const onNewJournalSubmitted: JournalFormProps["onSubmit"] = async (data) => {
    await createJournal(data);
  };

  console.log(data);

  return (
    <div>
      <section className="flex flex-col gap-4">
        <header className="flex flex-wrap justify-between gap-4">
          <h2 className="text-xl font-semibold">My Journals</h2>

          <button onClick={onNewJournal} className="btn btn-primary">
            New Journal
          </button>
          <dialog ref={modalRef} className="modal">
            <div className="modal-box">
              <h2 className="text-xl font-semibold">New Journal</h2>

              <div className="py-4">
                <JournalForm
                  onCancel={onCancelNewJournal}
                  onSubmit={onNewJournalSubmitted}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </dialog>
        </header>

        {data?.map((journal, id) =>
          journal.deletedAt === 0n ? (
            <JournalView key={id} id={id} journal={journal} />
          ) : (
            <Fragment key={id} />
          ),
        )}
      </section>
    </div>
  );
};

export default HomePage;
