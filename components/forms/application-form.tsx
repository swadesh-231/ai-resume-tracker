"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applicationFormSchema,
  STATUSES,
  type ApplicationFormValues,
} from "@/lib/validators";
import { STATUS_META } from "@/types";
import {
  createApplication,
  updateApplication,
} from "@/actions/application.actions";
import type { Application } from "@/db/schema";

function toDefaults(app?: Application): ApplicationFormValues {
  return {
    companyName: app?.companyName ?? "",
    role: app?.role ?? "",
    status: app?.status ?? "applied",
    location: app?.location ?? "",
    salary: app?.salary ?? "",
    jobUrl: app?.jobUrl ?? "",
    notes: app?.notes ?? "",
    appliedDate: app?.appliedDate
      ? format(new Date(app.appliedDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  };
}

export function ApplicationForm({ application }: { application?: Application }) {
  const router = useRouter();
  const isEdit = Boolean(application);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: toDefaults(application),
  });

  async function onSubmit(values: ApplicationFormValues) {
    const input = { ...values, appliedDate: new Date(values.appliedDate) };

    const result = isEdit
      ? await updateApplication(application!.id, input)
      : await createApplication(input);

    if (result.ok) {
      toast.success(isEdit ? "Application updated." : "Application created.");
      router.push("/dashboard/applications");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company *</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role *</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_META[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appliedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applied Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Remote · Bengaluru" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input placeholder="₹25 LPA · $120k" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="jobUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://company.com/careers/123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Referral from… · Interview on…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {isEdit ? "Save changes" : "Create application"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/dashboard/applications")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
