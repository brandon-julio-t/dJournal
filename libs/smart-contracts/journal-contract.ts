import {
  Config,
  UseReadContractParameters,
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import artifact from "@/artifacts/contracts/JournalContractImplV1.sol/JournalContractImplV1.json";
import { JournalContractImplV1 } from "@/typechain-types";
import { Abi } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const smartContractAddress = (process.env
  .NEXT_PUBLIC_DJOURNAL_PROXY_SMART_CONTRACT ?? "0x0") as `0x${string}`;

export function useGetMyJournals() {
  const config = useCommonConfig();

  return useReadContract<
    Abi,
    "getMyJournals",
    readonly unknown[],
    Config,
    Awaited<ReturnType<JournalContractImplV1["getMyJournals"]>>
  >({
    ...config,
    functionName: "getMyJournals",
  });
}

export function useCreateJournal() {
  const config = useCommonConfig();
  const { queryKey } = useGetMyJournals();
  const queryClient = useQueryClient();

  const { writeContractAsync, isPending, data } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({ hash: data });
  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess]);

  const createJournal = async ({
    title,
    body,
  }: Pick<JournalContractImplV1.JournalStruct, "title" | "body">) => {
    await writeContractAsync({
      ...config,
      functionName: "createJournal",
      args: [title, body],
    });
  };

  return {
    isLoading: isPending,
    createJournal: createJournal,
  };
}

export function useDeleteJournal() {
  const config = useCommonConfig();
  const { queryKey } = useGetMyJournals();
  const queryClient = useQueryClient();

  const { writeContractAsync, isPending, data } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash: data });
  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess]);

  const deleteJournal = async ({ id }: { id: number }) => {
    await writeContractAsync({
      ...config,
      functionName: "deleteJournal",
      args: [id],
    });
  };

  return {
    isLoading: isPending || isLoading,
    deleteJournal,
  };
}

export function useUpdateJournal() {
  const config = useCommonConfig();
  const { queryKey } = useGetMyJournals();
  const queryClient = useQueryClient();

  const { writeContractAsync, isPending, data } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash: data });
  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess]);

  const updateJournal = async ({
    id,
    title,
    body,
  }: { id: number } & Pick<
    JournalContractImplV1.JournalStruct,
    "title" | "body"
  >) => {
    await writeContractAsync({
      ...config,
      functionName: "updateJournal",
      args: [id, title, body],
    });
  };

  return {
    isLoading: isPending || isLoading,
    updateJournal,
  };
}

function useCommonConfig() {
  const { address } = useAccount();

  return {
    abi: artifact.abi as Abi,
    account: address,
    address: smartContractAddress,
  } satisfies UseReadContractParameters;
}
