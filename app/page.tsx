"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AREAS, DEVICES, createTicket, type Area, type Device } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [area, setArea] = useState<Area>("A区");
  const [device, setDevice] = useState<Device>("电脑");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return setError("请填写提交人姓名");
    if (!description.trim()) return setError("请描述一下故障现象");

    createTicket({
      name: name.trim(),
      area,
      device,
      description: description.trim(),
    });
    router.push("/tickets");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">提交报修</h1>
        <p className="mt-1 text-sm text-slate-500">
          填一下设备情况，提交后可以在工单列表里跟踪处理进度。
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            提交人姓名
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            placeholder="例如：王小明"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="area" className="mb-1.5 block text-sm font-medium">
              办公区
            </label>
            <select
              id="area"
              value={area}
              onChange={(event) => setArea(event.target.value as Area)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {AREAS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="device" className="mb-1.5 block text-sm font-medium">
              设备类型
            </label>
            <select
              id="device"
              value={device}
              onChange={(event) => setDevice(event.target.value as Device)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {DEVICES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium"
          >
            故障描述
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
            }}
            placeholder="什么时候开始的？有没有报错提示？已经试过哪些办法？"
            className="w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm leading-relaxed outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            提交报修
          </button>
        </div>
      </form>
    </div>
  );
}
