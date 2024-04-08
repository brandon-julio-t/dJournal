import { ComponentType, PropsWithChildren } from "react";

const ClientLayout: ComponentType<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <nav>
        <div className="container mx-auto flex justify-end gap-4">
          <w3m-button />
          <w3m-network-button />
        </div>
      </nav>

      <main className="container mx-auto">{children}</main>
    </div>
  );
};

export default ClientLayout;
