import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createApplication, addToWaitlist, getAllApplications } from "./db";
import { scoreApplication } from "./leadScoring";
import { sendApplicationConfirmation, sendOwnerAlert } from "./emailService";
import { notifyOwner } from "./_core/notification";
import { checkRateLimit, RATE_LIMITS } from "./rateLimiter";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  application: router({
    submit: publicProcedure
      .input(z.object({
        firmName: z.string().min(1).max(255),
        fullName: z.string().min(1).max(255),
        title: z.string().min(1).max(255),
        workEmail: z.string().email().max(320),
        phone: z.string().min(1).max(64),
        website: z.string().max(512),
        linkedIn: z.string().max(512).optional(),
        answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
        utmSource: z.string().max(255).optional(),
        utmMedium: z.string().max(255).optional(),
        utmCampaign: z.string().max(255).optional(),
        utmContent: z.string().max(255).optional(),
        utmTerm: z.string().max(255).optional(),
        referrer: z.string().max(1024).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Extract IP for rate limiting
        const ipAddress = (ctx.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
          ?? (ctx.req.socket as { remoteAddress?: string })?.remoteAddress
          ?? 'unknown';

        // Rate limit: max 3 submissions per IP per hour
        const rateCheck = checkRateLimit(
          ipAddress,
          'submit',
          RATE_LIMITS.submit.max,
          RATE_LIMITS.submit.windowMs
        );
        if (!rateCheck.allowed) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many submissions from this location. Please try again later.',
          });
        }

        const { score, tier } = scoreApplication(input.answers as Record<string, string | string[]>);
        const userAgent = ctx.req.headers['user-agent'] ?? '';

        const applicationId = await createApplication({
          firmName: input.firmName,
          fullName: input.fullName,
          title: input.title,
          workEmail: input.workEmail,
          phone: input.phone,
          website: input.website,
          linkedIn: input.linkedIn,
          leadScore: score,
          leadTier: tier,
          answers: input.answers,
          status: 'pending',
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          utmContent: input.utmContent,
          utmTerm: input.utmTerm,
          referrer: input.referrer,
          ipAddress,
          userAgent,
        });

        sendApplicationConfirmation({
          to: input.workEmail,
          firmName: input.firmName,
          fullName: input.fullName,
          leadScore: score,
          leadTier: tier,
        }).catch(err => console.error('[Application] Confirmation email failed:', err));

        notifyOwner({
          title: `New Application: ${input.firmName} (Score: ${score} — ${tier.toUpperCase()})`,
          content: `${input.fullName} from ${input.firmName} submitted a private access application.\n\nEmail: ${input.workEmail}\nPhone: ${input.phone}\nLead Score: ${score}/100\nTier: ${tier.toUpperCase()}\nUTM Source: ${input.utmSource ?? 'direct'}`,
        }).catch(err => console.error('[Application] Owner notification failed:', err));

        sendOwnerAlert({
          firmName: input.firmName,
          fullName: input.fullName,
          email: input.workEmail,
          leadScore: score,
          leadTier: tier,
          applicationId,
        }).catch(err => console.error('[Application] Owner alert email failed:', err));

        return { success: true, applicationId, leadScore: score, leadTier: tier };
      }),

    joinWaitlist: publicProcedure
      .input(z.object({
        email: z.string().email().max(320),
        firmName: z.string().max(255).optional(),
        hardStopReason: z.string().max(512).optional(),
        referralEmail: z.string().email().max(320).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Rate limit: max 5 waitlist entries per IP per hour
        const ipAddress = (ctx.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
          ?? (ctx.req.socket as { remoteAddress?: string })?.remoteAddress
          ?? 'unknown';

        const rateCheck = checkRateLimit(
          ipAddress,
          'waitlist',
          RATE_LIMITS.waitlist.max,
          RATE_LIMITS.waitlist.windowMs
        );
        if (!rateCheck.allowed) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests from this location. Please try again later.',
          });
        }

        await addToWaitlist({
          email: input.email,
          firmName: input.firmName,
          hardStopReason: input.hardStopReason,
          referralEmail: input.referralEmail,
        });

        notifyOwner({
          title: `Waitlist Entry: ${input.firmName ?? input.email}`,
          content: `A firm hit a hard-stop and joined the waitlist.\n\nEmail: ${input.email}\nFirm: ${input.firmName ?? 'N/A'}\nReason: ${input.hardStopReason ?? 'N/A'}\nReferral: ${input.referralEmail ?? 'N/A'}`,
        }).catch(console.error);

        return { success: true };
      }),

    listAll: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return getAllApplications();
      }),
  }),
});

export type AppRouter = typeof appRouter;
