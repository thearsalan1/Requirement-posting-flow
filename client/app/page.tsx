"use client";
import { useState } from "react";
import { CATEGORIES, CATEGORY_FIELDS, Category } from "@/lib/config";
import Field from "@/components/Field";
import Stepper from "@/components/Stepper";

const API = process.env.NEXT_PUBLIC_API_URL;
const BASIC_REQUIRED = [
  "eventName",
  "eventType",
  "startDate",
  "location",
  "category",
];

export default function Page() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Record<string, string>>({}); 
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(""); 
  const [loading, setLoading] = useState(false);

  const category = data.category as Category | undefined;
  const setValue = (name: string, value: string) =>
    setData({ ...data, [name]: value });

  const stepFields =
    category && (step === 2 || step === 3)
      ? CATEGORY_FIELDS[category][step - 2]
      : [];
  const allFields = category
    ? [...CATEGORY_FIELDS[category][0], ...CATEGORY_FIELDS[category][1]]
    : [];

  const getError = () => {
    const required =
      step === 1
        ? BASIC_REQUIRED
        : stepFields.filter((f) => !f.optional).map((f) => f.name);

    if (required.some((name) => !data[name]))
      return "Please fill all required fields";
    if (step === 1 && data.endDate && data.endDate < data.startDate)
      return "End date can't be before start date";
    return "";
  };

  const goNext = () => {
    const err = getError();
    setError(err);
    if (!err) setStep(step + 1);
  };

  const goBack = () => {
    setError("");
    setStep(step - 1);
  };

  const submit = async () => {
    setLoading(true);
    setError("");

    const details: Record<string, string | number | string[]> = {};
    for (const f of allFields) {
      const value = data[f.name];
      if (!value) continue;
      if (f.type === "number") details[f.name] = Number(value);
      else if (f.type === "list")
        details[f.name] = value.split(",").map((s) => s.trim());
      else details[f.name] = value;
    }

    const body = {
      eventName: data.eventName,
      eventType: data.eventType,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      location: data.location,
      venue: data.venue || undefined,
      category: data.category,
      details,
    };

    try {
      const res = await fetch(`${API}/api/requirements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setSaved(json.category);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    setSaved("");
    setData({});
    setStep(1);
  };

  const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Post a Requirement
          </h1>
          <p className="mt-2 text-slate-500">
            Tell us what you need for your event
          </p>
        </div>

        {/* SUCCESS SCREEN */}
        {saved ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>
            <h2 className="text-xl font-semibold">Requirement posted!</h2>
            <p className="mt-2 text-slate-500">
              Saved under{" "}
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium capitalize text-indigo-600">
                {saved}
              </span>
            </p>
            <button
              onClick={startOver}
              className="mt-8 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
              Post another
            </button>
          </div>
        ) : (
          <>
            <Stepper step={step} />

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <div className="space-y-5">
                  <Field
                    label="Event Name"
                    placeholder="e.g. Riya & Aman's Wedding"
                    value={data.eventName ?? ""}
                    onChange={(v) => setValue("eventName", v)}
                  />
                  <Field
                    label="Event Type"
                    placeholder="Wedding, Concert, Corporate..."
                    value={data.eventType ?? ""}
                    onChange={(v) => setValue("eventType", v)}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Start Date"
                      type="date"
                      value={data.startDate ?? ""}
                      onChange={(v) => setValue("startDate", v)}
                    />
                    <Field
                      label="End Date"
                      type="date"
                      optional
                      value={data.endDate ?? ""}
                      onChange={(v) => setValue("endDate", v)}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Location"
                      placeholder="City"
                      value={data.location ?? ""}
                      onChange={(v) => setValue("location", v)}
                    />
                    <Field
                      label="Venue"
                      placeholder="Venue name"
                      optional
                      value={data.venue ?? ""}
                      onChange={(v) => setValue("venue", v)}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      What are you looking for?
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setValue("category", c.value)}
                          className={`rounded-xl border-2 p-4 text-left transition ${
                            data.category === c.value
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className="text-2xl">{c.icon}</div>
                          <div className="mt-2 font-semibold">{c.label}</div>
                          <div className="text-xs text-slate-500">{c.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 & 3: CATEGORY FIELDS */}
              {(step === 2 || step === 3) && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">
                    {categoryLabel} requirements
                  </h2>
                  {stepFields.map((f) => (
                    <Field
                      key={f.name}
                      label={f.label}
                      optional={f.optional}
                      type={f.type === "number" ? "number" : "text"}
                      value={data[f.name] ?? ""}
                      onChange={(v) => setValue(f.name, v)}
                    />
                  ))}
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">
                    Review your requirement
                  </h2>
                  <div className="space-y-2 rounded-xl bg-slate-50 p-5 text-sm">
                    <Row label="Category" value={categoryLabel ?? ""} />
                    <Row label="Event" value={data.eventName} />
                    <Row label="Type" value={data.eventType} />
                    <Row label="Start Date" value={data.startDate} />
                    {data.endDate && (
                      <Row label="End Date" value={data.endDate} />
                    )}
                    <Row label="Location" value={data.location} />
                    {data.venue && <Row label="Venue" value={data.venue} />}
                  </div>
                  <div className="space-y-2 rounded-xl bg-slate-50 p-5 text-sm">
                    {allFields
                      .filter((f) => data[f.name])
                      .map((f) => (
                        <Row
                          key={f.name}
                          label={f.label}
                          value={data[f.name]}
                        />
                      ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* BUTTONS */}
              <div className="mt-8 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={goBack}
                    disabled={loading}
                    className="rounded-xl px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100"
                  >
                    ← Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 4 ? (
                  <button
                    onClick={goNext}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {loading ? "Submitting..." : "Submit Requirement"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
