"use client";

import { FormEvent } from "react";
import { FadeIn } from "@/components/ui/AnimatedText";
import { CONTACT_INFO } from "@/lib/data";

const SUPPORT_TYPES = [
  { value: "financial", label: "活動資金のご支援" },
  { value: "material", label: "物品・技術協力" },
  { value: "facility", label: "場所・設備のご提供" },
  { value: "mentor", label: "メンタリング・キャリア支援" },
  { value: "other", label: "まずは話を聞きたい" },
];

const SUBJECT = "【CIT-Racing Team】ご支援のご相談";

function buildGmailUrl(data: Record<string, FormDataEntryValue>): string {
  const supportLabel =
    SUPPORT_TYPES.find((t) => t.value === data.supportType)?.label ?? "未選択";

  const body = [
    "CIT-Racing Team 御中",
    "",
    "はじめまして。貴チームの活動に関心があり、ご連絡いたしました。",
    "",
    "--- ご記入内容 ---",
    `お名前: ${data.name ?? ""}`,
    `ご所属: ${data.company ?? ""}`,
    `メールアドレス: ${data.email ?? ""}`,
    `ご支援の内容: ${supportLabel}`,
    "",
    "ご相談内容:",
    String(data.message ?? ""),
    "",
    "--------------------",
    "どうぞよろしくお願いいたします。",
  ].join("\n");

  const params = new URLSearchParams({
    view: "cm",
    to: CONTACT_INFO.email,
    su: SUBJECT,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    window.open(buildGmailUrl(data), "_blank");
  };

  const quickGmailUrl = `https://mail.google.com/mail/?${new URLSearchParams({
    view: "cm",
    to: CONTACT_INFO.email,
    su: SUBJECT,
  }).toString()}`;

  return (
    <section
      id="contact"
      className="relative bg-racing-carbon px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <FadeIn>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-12 bg-racing-red" />
              <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                GET IN TOUCH
              </span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              まずは、
              <br />
              お話しませんか。
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-racing-white/70 md:text-base">
              ご支援のかたちは決まっていなくて大丈夫です。
              活動へのご質問や、こんなことができそう、というご提案だけでも嬉しいです。
              学生メンバーより順次ご返信いたします。
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <dl className="mt-10 space-y-5 text-sm">
              <div>
                <dt className="font-display text-xs tracking-[0.3em] text-racing-gray">
                  EMAIL
                </dt>
                <dd className="mt-1">
                  <a
                    href={quickGmailUrl}
                    className="underline-offset-4 transition-colors hover:text-racing-red hover:underline"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-display text-xs tracking-[0.3em] text-racing-gray">
                  ADDRESS
                </dt>
                <dd className="mt-1 leading-relaxed text-racing-white/80">
                  {CONTACT_INFO.address}
                </dd>
              </div>
              <div>
                <dt className="font-display text-xs tracking-[0.3em] text-racing-gray">
                  SOCIAL
                </dt>
                <dd className="mt-1 flex flex-col gap-1 text-racing-white/80">
                  <a
                    href={CONTACT_INFO.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-racing-red"
                  >
                    X (Twitter) — {CONTACT_INFO.xHandle}
                  </a>
                  <a
                    href={CONTACT_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-racing-red"
                  >
                    Instagram — {CONTACT_INFO.instagramHandle}
                  </a>
                </dd>
              </div>
            </dl>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <form
            onSubmit={onSubmit}
            className="relative border border-white/10 bg-racing-black p-6 md:p-10"
          >
            <div className="absolute -top-px left-0 h-px w-24 bg-racing-red" />

            <p className="mb-6 text-xs leading-relaxed text-racing-gray">
              下のフォームにご記入後、「メールで送信」ボタンを押すと、
              お使いのメールソフトが開き、入力内容が自動で差し込まれます。
              そのまま送信いただければ、私たちに届きます。
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="お名前" name="name" required />
              <Field label="会社名 / ご所属" name="company" />
              <Field
                label="メールアドレス"
                name="email"
                type="email"
                required
              />
            </div>

            <fieldset className="mt-6">
              <legend className="mb-3 font-display text-xs tracking-[0.3em] text-racing-gray">
                ご支援の内容（ご希望のもの）
              </legend>
              <div className="flex flex-wrap gap-3">
                {SUPPORT_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className="group inline-flex cursor-pointer items-center gap-2 border border-white/15 px-4 py-2 text-sm transition-colors has-[input:checked]:border-racing-red has-[input:checked]:bg-racing-red/10 hover:border-racing-red/60"
                  >
                    <input
                      type="radio"
                      name="supportType"
                      value={t.value}
                      className="sr-only"
                      defaultChecked={t.value === "other"}
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label className="block">
                <span className="mb-2 block font-display text-xs tracking-[0.3em] text-racing-gray">
                  メッセージ
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="peer w-full resize-none border-b border-white/20 bg-transparent px-1 py-2 text-sm text-racing-white placeholder:text-racing-white/30 focus:border-racing-red focus:outline-none transition-colors"
                  placeholder="ご質問・ご提案内容をお聞かせください"
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-racing-gray">
                お使いの環境でメールソフトが開かない場合は、
                <a
                  href={quickGmailUrl}
                  className="text-racing-white underline-offset-2 hover:text-racing-red hover:underline"
                >
                  {CONTACT_INFO.email}
                </a>
                まで直接ご連絡ください。
              </p>
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center justify-center gap-3 bg-racing-red px-8 py-4 font-display text-sm font-semibold tracking-[0.25em] transition-colors hover:bg-racing-crimson"
              >
                メールで送信
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-xs tracking-[0.3em] text-racing-gray">
        {label}
        {required && <span className="ml-1 text-racing-red">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-white/20 bg-transparent px-1 py-2 text-sm text-racing-white placeholder:text-racing-white/30 focus:border-racing-red focus:outline-none transition-colors"
      />
    </label>
  );
}
