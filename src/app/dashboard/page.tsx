"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Link from "next/link";
import { ArrowUpRight, Mountain, Store, Users } from "lucide-react";
import { useMemo, useState } from "react";

type KPI = {
  label: string;
  value: number;
  delta?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
};

type TopItem = { name: string; metric: number };

const kpis: KPI[] = [
  { label: "Total Visitors (YTD)", value: 128_940, delta: 12.4, icon: Users },
  { label: "Wisata Entries", value: 58, delta: 4.1, icon: Mountain },
  { label: "UMKM Entries", value: 73, delta: 7.8, icon: Store },
  { label: "Conversion Rate", value: 3.9, delta: 0.6 },
];

const topWisata: TopItem[] = [
  { name: "Pantai Putih", metric: 9421 },
  { name: "Gunung Sejuk", metric: 8310 },
  { name: "Air Terjun Indah", metric: 7920 },
  { name: "Kampung Adat", metric: 7402 },
  { name: "Danau Biru", metric: 7011 },
];

const topUmkm: TopItem[] = [
  { name: "Batik Sari", metric: 5210 },
  { name: "Kopi Lestari", metric: 4902 },
  { name: "Kerajinan Kayu", metric: 4722 },
  { name: "Roti Tradisi", metric: 4513 },
  { name: "Tenun Nusantara", metric: 4399 },
];

type MonthRange = 3 | 6 | 12;

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
}

function generateVisitors(range: MonthRange) {
  const today = new Date();
  const data: { month: string; visitors: number }[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    // basic mock: small randomness + trend
    const visitors = Math.round(
      8000 + (range - i) * 500 + Math.random() * 1500
    );
    data.push({ month: monthLabel(d), visitors });
  }
  return data;
}

export default function DashboardPage() {
  const [range, setRange] = useState<MonthRange>(6);
  const data = useMemo(() => generateVisitors(range), [range]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of KPIs and activity
          </p>
        </div>
        <Link href="/wisata">
          <Button variant="default" className="gap-1">
            Explore Data <ArrowUpRight className="size-4" />
          </Button>
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{k.label}</CardTitle>
                {Icon ? (
                  <Icon className="size-5 text-muted-foreground" />
                ) : null}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {k.label.includes("Rate")
                    ? `${k.value.toFixed(1)}%`
                    : k.value.toLocaleString()}
                </div>
                {typeof k.delta === "number" && (
                  <p className="text-xs text-muted-foreground">
                    +{k.delta}% from last period
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Visitors</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly visitors by selected range
              </p>
            </div>
            <div className="flex gap-2">
              {[3, 6, 12].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r as MonthRange)}
                  className={`inline-flex items-center rounded-md px-3 py-1 text-sm ${
                    range === r
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  Last {r}m
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visitors: { label: "Visitors", color: "hsl(var(--chart-1))" },
              }}
              className="h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="var(--color-visitors, var(--color-chart-1))"
                    name="Visitors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <TopListPanel
            title="Top 5 Wisata"
            items={topWisata}
            linkHref="/wisata"
          />
          <TopListPanel title="Top 5 UMKM" items={topUmkm} linkHref="/umkm" />
        </div>
      </section>
    </div>
  );
}

function TopListPanel({
  title,
  items,
  linkHref,
}: {
  title: string;
  items: TopItem[];
  linkHref: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Link href={linkHref} className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="grid gap-2">
        {items.map((it, idx) => (
          <div key={it.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="w-8 justify-center">
                {idx + 1}
              </Badge>
              <span className="font-medium">{it.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {it.metric.toLocaleString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
