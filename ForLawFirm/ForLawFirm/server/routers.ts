import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getAvailableSlots, claimSlot } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  slots: router({
    getAvailable: publicProcedure
      .input(z.object({ market: z.string() }))
      .query(async ({ input }) => {
        const available = await getAvailableSlots(input.market);
        return { available, total: 3 };
      }),
    
    claim: protectedProcedure
      .input(z.object({
        market: z.string(),
        firmName: z.string(),
        practiceArea: z.string(),
        state: z.string(),
        budgetRange: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const success = await claimSlot(input.market, {
          userId: ctx.user.id,
          firmName: input.firmName,
          practiceArea: input.practiceArea,
          state: input.state,
          budgetRange: input.budgetRange,
        });
        
        if (!success) {
          throw new Error("No slots available for this market");
        }
        
        return { success: true, message: "Slot claimed successfully" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
