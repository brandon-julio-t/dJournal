import { JournalContractImplV1 } from "@/typechain-types";
import { ComponentType, useState } from "react";

export interface JournalFormProps {
  defaultValues?: Partial<JournalContractImplV1.JournalStruct>;
  onSubmit: (
    data: Pick<JournalContractImplV1.JournalStruct, "title" | "body">,
  ) => Promise<void> | void;
  onCancel: () => void;
  isLoading: boolean;
}

const JournalForm: ComponentType<JournalFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [body, setBody] = useState(defaultValues?.body ?? "");

  const _onSubmit = () => onSubmit({ title, body });

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        className="input input-bordered input-primary"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isLoading}
      />

      <textarea
        placeholder="Body"
        rows={7}
        className="textarea textarea-bordered textarea-primary"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        disabled={isLoading}
      ></textarea>

      <section className="flex flex-wrap justify-end gap-4">
        <button
          className="btn btn-primary"
          onClick={_onSubmit}
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner" />}
          Submit
        </button>
        <button className="btn" onClick={onCancel} disabled={isLoading}>
          {isLoading && <span className="loading loading-spinner" />}
          Cancel
        </button>
      </section>
    </div>
  );
};

export default JournalForm;
