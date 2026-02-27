"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, UploadCloud, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitApplication, applicationFormOptions } from "@/lib/queries";
import { useJobBoardState } from "../context";
import type { Job, ScreeningQuestion, ApplicationResponse } from "../types";

interface ApplicationFormViewProps {
  job: Job;
}

function buildSchema(
  requireCoverLetter: boolean,
  questions: ScreeningQuestion[],
) {
  const shape: Record<string, z.ZodTypeAny> = {
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(1, "Phone number is required"),
    resumeFile: z
      .instanceof(File, { message: "Resume is required" })
      .refine((f) => f.size > 0, "Resume is required"),
  };

  if (requireCoverLetter) {
    shape.coverLetterFile = z
      .instanceof(File, { message: "Cover letter is required" })
      .refine((f) => f.size > 0, "Cover letter is required");
  }

  for (const q of questions) {
    const key = `q_${q.id}`;
    if (q.type === "multi_select") {
      shape[key] = q.required
        ? z.array(z.string()).min(1, "Please select at least one option")
        : z.array(z.string()).optional();
    } else {
      shape[key] = q.required
        ? z.string().min(1, "This field is required")
        : z.string().optional();
    }
  }

  return z.object(shape);
}

type FormValues = Record<string, unknown>;

export const ApplicationFormView: React.FC<ApplicationFormViewProps> = ({
  job,
}) => {
  const { slug } = useJobBoardState();
  const router = useRouter();
  const submitMutation = useSubmitApplication();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: form } = useQuery(applicationFormOptions(slug, job.id));

  const questions = useMemo(
    () => form?.screeningQuestions ?? [],
    [form?.screeningQuestions],
  );
  const requireCoverLetter = form?.requireCoverLetter ?? false;

  const schema = useMemo(
    () => buildSchema(requireCoverLetter, questions),
    [requireCoverLetter, questions],
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);

    const answers: Record<string, string | string[]> = {};
    for (const q of questions) {
      const val = data[`q_${q.id}`];
      if (val !== undefined) {
        answers[q.id] = val as string | string[];
      }
    }

    try {
      const result: ApplicationResponse = await submitMutation.mutateAsync({
        slug,
        jobId: job.id,
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        phone: data.phone as string,
        resumeFile: data.resumeFile as File,
        coverLetterFile: data.coverLetterFile as File | undefined,
        answers,
      });

      router.push(
        `/${slug}/jobs/${job.id}/apply/success${result.status === "rejected" ? "?rejected=true" : ""}`,
      );
    } catch (err) {
      const apiErr = err as Error & {
        status?: number;
        response?: ApplicationResponse;
      };
      setSubmitError(
        apiErr.response?.error ?? apiErr.message ?? "Something went wrong",
      );
    }
  };

  const handleClose = () => {
    router.back();
  };

  const fieldError = (name: string) => {
    const err = errors[name];
    if (!err?.message) return null;
    return <p className="text-sm text-red-500 mt-1">{err.message as string}</p>;
  };

  const resumeFile = useWatch({ control, name: "resumeFile" }) as
    | File
    | undefined;
  const coverLetterFile = useWatch({ control, name: "coverLetterFile" }) as
    | File
    | undefined;

  const renderFileUpload = (
    name: string,
    label: string,
    required: boolean,
    file: File | undefined,
  ) => {
    return (
      <div>
        <Label className="mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <label
          className={`block border-2 border-dashed rounded-lg p-8 text-center transition-colors group cursor-pointer ${
            errors[name]
              ? "border-red-300 hover:border-red-400"
              : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setValue(name, f, { shouldValidate: true });
            }}
          />
          <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-gray-600" />
          {file ? (
            <p className="mt-2 text-sm text-gray-700 font-medium">
              {file.name}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Click to upload</span>{" "}
              or drag and drop
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 10MB</p>
        </label>
        {fieldError(name)}
      </div>
    );
  };

  const renderQuestion = (q: ScreeningQuestion, index: number) => {
    const name = `q_${q.id}`;
    return (
      <div key={q.id} className="space-y-3">
        <Label>
          {index + 1}. {q.question}
          {q.required && <span className="text-red-500 ml-1">*</span>}
          {q.type === "multi_select" && (
            <span className="text-muted-foreground text-xs ml-2 font-normal">
              (Select all that apply)
            </span>
          )}
        </Label>

        {q.type === "yes_no" && (
          <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RadioGroup
                value={(field.value as string) || ""}
                onValueChange={field.onChange}
                className="flex gap-6"
              >
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <RadioGroupItem
                      value={option}
                      className="border-gray-300 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        )}

        {q.type === "single_select" && q.options && (
          <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RadioGroup
                value={(field.value as string) || ""}
                onValueChange={field.onChange}
                className="flex flex-col gap-2"
              >
                {q.options!.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <RadioGroupItem
                      value={opt}
                      className="border-gray-300 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        )}

        {q.type === "multi_select" && q.options && (
          <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => {
              const selected = (field.value as string[]) || [];
              return (
                <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-2">
                  {q.options!.map((opt) => {
                    const isSelected = selected.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`flex cursor-pointer items-center gap-3 p-3 border rounded transition-colors ${
                          isSelected
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {
                            const updated = isSelected
                              ? selected.filter((v) => v !== opt)
                              : [...selected, opt];
                            field.onChange(updated);
                          }}
                          className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              );
            }}
          />
        )}

        {q.type === "short_text" && (
          <Input
            type="text"
            {...register(name)}
            aria-invalid={!!errors[name]}
            placeholder={q.placeholder || "Enter your answer..."}
          />
        )}

        {q.type === "long_text" && (
          <Textarea
            {...register(name)}
            aria-invalid={!!errors[name]}
            placeholder={q.placeholder || "Enter your answer..."}
            className="min-h-[120px] resize-none"
          />
        )}

        {q.type === "number" && (
          <Input
            type="number"
            {...register(name)}
            aria-invalid={!!errors[name]}
            placeholder={q.placeholder || "Enter a number..."}
            min="0"
          />
        )}

        {q.type === "url" && (
          <Input
            type="url"
            {...register(name)}
            aria-invalid={!!errors[name]}
            placeholder={q.placeholder || "https://..."}
          />
        )}

        {fieldError(name)}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Apply for {job.title}
          </h2>
          <p className="text-sm text-gray-500">
            Please fill out the details below.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X size={24} />
        </Button>
      </div>

      <div className="flex-1 p-6 @2xl:p-10 bg-gray-50">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl mx-auto space-y-10"
        >
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          <section className="bg-white p-6 @2xl:p-8 rounded-xl shadow-sm space-y-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
              Contact Details
            </h3>

            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  {...register("firstName")}
                  aria-invalid={!!errors.firstName}
                  placeholder="Jane"
                />
                {fieldError("firstName")}
              </div>

              <div>
                <Label className="mb-2">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  {...register("lastName")}
                  aria-invalid={!!errors.lastName}
                  placeholder="Doe"
                />
                {fieldError("lastName")}
              </div>
            </div>

            <div>
              <Label className="mb-2">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                placeholder="you@example.com"
              />
              {fieldError("email")}
            </div>

            <div>
              <Label className="mb-2">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                {...register("phone")}
                aria-invalid={!!errors.phone}
                placeholder="+1 (555) 000-0000"
              />
              {fieldError("phone")}
            </div>
          </section>

          <section className="bg-white p-6 @2xl:p-8 rounded-xl shadow-sm space-y-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
              Documents
            </h3>

            {renderFileUpload("resumeFile", "Resume / CV", true, resumeFile)}

            {requireCoverLetter &&
              renderFileUpload(
                "coverLetterFile",
                "Cover Letter",
                true,
                coverLetterFile,
              )}
          </section>

          {questions.length > 0 && (
            <section className="bg-white p-6 @2xl:p-8 rounded-xl shadow-sm space-y-8">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
                Screening Questions
              </h3>

              {questions.map((q, idx) => renderQuestion(q, idx))}
            </section>
          )}

          <div className="pt-2 pb-8">
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-4 font-bold uppercase tracking-widest text-sm"
              size="lg"
            >
              {submitMutation.isPending
                ? "Submitting..."
                : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
