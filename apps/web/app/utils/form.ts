import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

export type Form = UseFormReturn<z.infer<typeof formSchema>>;
export type FormValues = z.infer<typeof formSchema>;
export type FieldName =
  | "token.symbol"
  | "token.name"
  | `token.tokenholders.${number}.amount`
  | `token.tokenholders.${number}.address`
  | "timelock.minDelay"
  | "governor.name"
  | "governor.votingDelay"
  | "governor.votingPeriod"
  | "governor.quorumNumerator"
  | "governor.proposalThreshold"
  | "governor.voteExtension";

export const formSchema = z.object({
  token: z.object({
    name: z.string().min(3).max(20), // Token name
    symbol: z.string().min(2).max(5), // Token symbol
    tokenholders: z
      .array(
        z.object({
          // Tokenholders
          address: z
            .string()
            .startsWith("0x")
            .length(42)
            .or(z.string().endsWith(".eth")), // Address or ENS name
          amount: z.coerce.number().min(1), // Amount of tokens
        }),
      )
      .min(1),
  }),
  timelock: z.object({
    minDelay: z.coerce.number().min(0), // Timelock minimum delay
  }),
  governor: z.object({
    name: z.string().min(3).max(20), // DAO name
    votingDelay: z.coerce.number().min(0).max(100), // Voting delay
    votingPeriod: z.coerce.number().min(0).max(100), // Voting period
    quorumNumerator: z.coerce.number().min(0).max(100), // Quorum numerator
    proposalThreshold: z.coerce.number().min(0).max(100), // Proposal threshold
    voteExtension: z.coerce.number().min(0).max(100), // Vote extension
  }),
});

export function useCreateDaoForm() {
  return useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: {
        name: "",
        symbol: "",
        tokenholders: [{ address: "", amount: 1 }],
      },
      timelock: {
        minDelay: 1, // 1 day
      },
      governor: {
        name: "",
        votingDelay: 1, // 1 day
        votingPeriod: 5, // 5 days
        quorumNumerator: 4, // 4%
        proposalThreshold: 1, // # of tokens
        voteExtension: 1, // 1 day
      },
    },
  });
}
