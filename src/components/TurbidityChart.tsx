"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LIMIT_NTU, readings, type Reading } from "@/data/readings";

/*
  Amber is a semantic state color here, not a second brand accent: it marks
  readings above the regulatory limit and appears nowhere else on the page.
*/

type DotRenderProps = {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: Reading;
};

function renderDot({ cx, cy, index, payload }: DotRenderProps) {
  const key = `dot-${index}`;
  if (cx == null || cy == null || !payload || payload.turbidity <= LIMIT_NTU) {
    return <g key={key} />;
  }
  return (
    <g key={key}>
      <circle cx={cx} cy={cy} r={7} fill="#f59e0b" fillOpacity={0.18} />
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill="#f59e0b"
        stroke="#0a0a0a"
        strokeWidth={1.5}
      />
    </g>
  );
}

export function TurbidityChart() {
  return (
    <div className="h-[300px] w-full sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={readings}
          margin={{ top: 24, right: 12, bottom: 4, left: -12 }}
        >
          <CartesianGrid
            stroke="#27272a"
            strokeDasharray="2 6"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#27272a" }}
            interval="preserveStartEnd"
            minTickGap={18}
          />
          <YAxis
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={52}
            domain={[0, 160]}
          />
          <Tooltip
            cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
            contentStyle={{
              background: "#121214",
              border: "1px solid #27272a",
              borderRadius: 12,
              fontSize: 12,
              color: "#f4f4f5",
            }}
            labelStyle={{ color: "#a1a1aa", marginBottom: 4 }}
            formatter={(value) => [`${value ?? "-"} NTU`, "Turbidity"]}
          />
          <ReferenceLine
            y={LIMIT_NTU}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            strokeOpacity={0.85}
            label={{
              value: "CONAMA limit 100 NTU",
              position: "insideTopRight",
              fill: "#f59e0b",
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="turbidity"
            stroke="#34d399"
            strokeWidth={1.6}
            dot={renderDot}
            activeDot={{ r: 4, fill: "#34d399", stroke: "#0a0a0a" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
